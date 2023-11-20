/**
 * The index.js file handles the startup and initialization of the app. This is the 
 * first thing that we run, and is the entry point for the webpack module bundler. This 
 * file also handles user authentication, and calls a script to execute backend functions. 
 */

// ============================ Initialize App ============================

// Import functions from the firebase SDK
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithCredential,
  signInWithPopup,
} from "firebase/auth";

// Import backend scripts
import { runBackend } from "./backendScripts";

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

// Initialize database
const myDB = getFirestore();

// Import database scripts
import { getUserIDByEmail } from "./dbScripts";

// ============================ User Auth ============================

// // sign in user with google O auth 
// await signInWithPopup(auth, provider)
//   .then( (result) => {
//     const credential = GoogleAuthProvider.credentialFromResult(result);
//     const token = credential.accessToken;
//     const user = result.user;
//     email = user.email;   
//     isAuthenticated = true; 
//   }).catch((error) => {
//     // handle errors 
//     const errorCode = error.code;
//     const errorMessage = error.message;
//     const credential = GoogleAuthProvider.credentialFromError(error);
//     // log the errors 
//     console.log("Error when authenticating user. Error code: ", errorCode);
//     console.log("Error when authenticating user. Error message: ", errorMessage);
//     console.log("Error when authenticating user. AuthCredential type used: ", credential); 
//     isAuthenticated = false; 
//   });

// function handleCredentialResponse(response) {
//   // Build Firebase credential with the Google ID token.
//   const idToken = response.credential;
//   const credential = GoogleAuthProvider.credential(idToken);

//   // Sign in with credential from the Google user.
//   signInWithCredential(auth, credential).catch((error) => {
//     // Handle Errors here.
//     const errorCode = error.code;
//     const errorMessage = error.message;
//     // The email of the user's account used.
//     const email = error.email;
//     // The credential that was used.
//     const credential = GoogleAuthProvider.credentialFromError(error);
//     // ...
//   });
// }

// ============================ Run App ============================

isAuthenticated = true;
email = "clentz@macalester.edu";

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