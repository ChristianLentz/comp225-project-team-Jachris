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
  onAuthStateChanged,   
  GoogleAuthProvider, 
  signInWithPopup,
  ProviderId} from "firebase/auth"; 

// Import DB scripts 
import { getUserIDByEmail, 
  createUser} from "./dbScripts"; 

// Import backend scripts
import { runBackend } from "./backendScripts";

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
let user = null; 

// Initialize database and analytics
const myDB = getFirestore();                
const analytics = getAnalytics(); 

// ============================ User Auth ============================

signInWithPopup(auth, provider)
  .then((result) => async function() {
    // This gives you a Google Access Token. You can use it to access the Google API.
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential.accessToken;
    // The signed-in user info.
    user = result.user;
    email = user.email; 
    // Add a new user to the DB if email not yet associated with user - THIS IS NOT WORKING ??
    if (getUserIDByEmail(email) == null) { 
      let userData = []; 
      userData.push({key: "user_email", value: email});
      await createUser(userData);
    }
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
  });

// ============================ Run App ============================

// run the app
await runBackend(myDB);

// // check if a user is currently logged in
// onAuthStateChanged(auth, user => async function() {
//     // if there is a user logged in 
//     if (user != null) { 
//       console.log(`'${JSON.stringify(user)}' is logged in!`);

//       // 1) direct user to home page (index.html)

//     // if there is no user logged in 
//     } else { 
//       console.log("no user!");

//       // 1) direct to login page 
//       // 2) allow user to login/create account 
//       // 3) direct user to home page (index.html)

//     } 
//   });