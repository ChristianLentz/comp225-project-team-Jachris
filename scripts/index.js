/**
 * - The functionality of our app will be built using nodeJS
 * - The index.js file handles the startup of the app, this is the first thing 
 * that we run.
 * - All key functionality starts here. This is where we import the packages we 
 * need, initialize the app / db, and get auth state / analytics for a given 
 * instance of the app  
 */

// Import functions from the firebase SDK
import { initializeApp } from "firebase/app"; 
import { getAnalytics } from "firebase/analytics";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";  
import { getAuth, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider } from "firebase/auth";
import { createUser } from "./dbScripts";

// ------------------------------------------------------------ 

// Firebase configuration
// measurementID is an optional parameter
const firebaseConfig = {
  apiKey: "AIzaSyDnuNDOz0v2w4M78YHk8mUupDKWT073MSE",
  authDomain: "mac-community-trade-center.firebaseapp.com",
  projectId: "mac-community-trade-center",
  storageBucket: "mac-community-trade-center.appspot.com",
  messagingSenderId: "889714479210",
  appId: "1:889714479210:web:c6719ae19008c2da0eba13",
  measurementId: "G-DWMWXEG7BY"
};

const myApp = initializeApp(firebaseConfig); // initialize app 
const myDB = getFirestore();                 // get database
const analytics = getAnalytics();            // analytics 
const auth = getAuth();                      // user auth 

// ------------------------------------------------------------ 

/**
 * Handle functionality of the app. 
 * 
 * Event handlers and asynchronous actions in JS here: 
 * https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous/Introducing
 */

// commented these chunks since there are errors here

//This signs up new users to create a new password and username (Mac Email)
// createUserWithEmailAndPassword(auth, email, password)
//   .then((userCredential) => {
//     // Signed up 
//     const user = userCredential.user;
//     // ...
//   })
//   .catch((error) => {
//     const errorCode = error.code;
//     const errorMessage = error.message;
//     // ...
//   });

// Allows users to sign in with their username and password. 
// signInWithEmailAndPassword(auth, email, password)
//   .then((userCredential) => {
//     // Signed in 
//     const user = userCredential.user;
//     // ...
//   })
//   .catch((error) => {
//     const errorCode = error.code;
//     const errorMessage = error.message;
//   });

// ---------------------------------

// testing adding data to the db 

const userData = {
  firstName: 'First',
  lastName: 'Last',
  username: 'firstLastNames', 
  password: 'superSupserSecretPassword', 
  email: 'flast@macalester.edu', 
};
await createUser(myDB, userData); 

// ---------------------------------

// testing getting data from the db 

// ---------------------------------


// check if a user is currently logged in
onAuthStateChanged(auth, user => {
    // if logged in, run the app 
    if (user != null) { 
      console.log("logged in!");
    // if not logged in, direct user to login page and then run the app 
    } else { 
      console.log("no user no user no user!");
    } 
});


