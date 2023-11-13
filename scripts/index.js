/**
 * The index.js file handles the startup and initialization of the app. This is the 
 * first thing that we run, and is the entry point for the webpack module bundler. This 
 * file also handles user authentication, and calls a script to execute backend functions. 
 */

// ============================ Initialize App ============================

// Import functions from the firebase SDK
import { initializeApp } from "firebase/app"; 
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";  
import { getAuth,    
  GoogleAuthProvider, 
  signInWithPopup,
  ProviderId} from "firebase/auth";  

// Import backend scripts
import { runBackend } from "./backendScripts";

// Import database scripts
import { getUserIDByEmail } from "./dbScripts"; 

// initialize express JS app - there is a webpack error when we try to use this?
// const express = require('express'); 
// const expressApp = express(); 

// Firebase configuration - measurementID is an optional parameter
const firebaseConfig = {
  apiKey: "AIzaSyDnuNDOz0v2w4M78YHk8mUupDKWT073MSE",
  authDomain: "mac-community-trade-center.firebaseapp.com",
  projectId: "mac-community-trade-center",
  storageBucket: "mac-community-trade-center.appspot.com",
  messagingSenderId: "889714479210",
  appId: "1:889714479210:web:c6719ae19008c2da0eba13",
  measurementId: "G-DWMWXEG7BY"
};

// Initialize firebase app 
const firebaseAPP = initializeApp(firebaseConfig); 

// Initialize user auth 
const auth = getAuth(firebaseAPP);
const provider = new GoogleAuthProvider();
auth.languageCode = 'en';  
let email = null;  
let isAuthenticated = false; 

// Initialize database and analytics
const myDB = getFirestore();                
const analytics = getAnalytics(); 

// ============================ User Auth ============================

await signInWithPopup(auth, provider)
  .then( (result) => {
    // This gives you a Google Access Token. You can use it to access the Google API.
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential.accessToken;
    // The signed-in user info.
    const user = result.user;
    email = user.email;   
    // Set authenticated flag to true
    isAuthenticated = true; 
    // IdP data available using getAdditionalUserInfo(result)
  }).catch((error) => {
    // Handle errors here.
    const errorCode = error.code;
    const errorMessage = error.message;
    const credential = GoogleAuthProvider.credentialFromError(error);
    // Log the errors in the console.
    console.log("Error when authenticating user. Error code: ", errorCode);
    console.log("Error when authenticating user. Error message: ", errorMessage);
    console.log("Error when authenticating user. AuthCredential type used: ", credential); 
    // Set authenticated flag to false 
    isAuthenticated = false; 
  });
// ============================ Sets token for user auth ============================
firebase.auth().setPersistence(Auth.Persistence.SESSION)
  .then(() => {
    // Existing and future Auth states are now persisted in the current
    // session only. Closing the window would clear any existing state even
    // if a user forgets to sign out.
    // ...
    // New sign-in will be persisted with session persistence.
    return firebase.auth().signInWithPopup(auth, provider);
  })
  .catch((error) => {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
  });

// ============================ Run App ============================

// run the back end!
if (isAuthenticated) { 
  console.log(`user '${email}' has been authenticated`);
  const userID = await getUserIDByEmail(myDB, email); 
  // boolean passed to runBackend will determine if we add the user to the db 
  if (userID == null) { 
    // current authenticated user is new, userAdded = false  
    await runBackend(myDB, email, false);
  } 
  else { 
    // current authenticated user is not new, userAdded = true
    await runBackend(myDB, email, true);
  }
}

// ============================ working on user sessions ============================

// firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION)
//   .then(() => {
//     // Existing and future Auth states are now persisted in the current
//     // session only. Closing the window would clear any existing state even
//     // if a user forgets to sign out.
//     // ...
//     // New sign-in will be persisted with session persistence.
//     return firebase.auth().signInWithPopup(auth, provider);
//   })
//   .catch((error) => {
//     // Handle Errors here.
//     var errorCode = error.code;
//     var errorMessage = error.message;
//   });