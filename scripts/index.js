/**
 * - The functionality of our app will be built using nodeJS.
 * - The index.js file handles the startup of the app, this is the first thing 
 * that we run. All key functionality starts here. 
 * - This is the entry point for the webpack module bundler.
 */

// Import functions from the firebase SDK
import { initializeApp } from "firebase/app"; 
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";  
import { getAuth, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

// Import db scripts 
import { createUser, createPost } from "./dbScripts";

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

// Initialize firebase app, user auth, db, analytics
const firebaseAPP = initializeApp(firebaseConfig);
const auth = getAuth();  
const myDB = getFirestore();                 
const analytics = getAnalytics(); 

// initialize express JS app - there is an error when we try to use this?
// const express = require('express'); 
// const expressApp = express(); 

// import the form-data node module for getting data from HTML forms 
const FormData = require('form-data');

// ------------------------------------------------------------ User Auth 

// // This signs up new users to create a new password and username (Mac Email)
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

// // Allows users to sign in with their username and password. 
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
  
// // Authenticate with Firebase using the Google provider object. Opens up other tab to sign in with email. 
//   signInWithPopup(auth, provider)
//   .then((result) => {
//     // This gives you a Google Access Token. You can use it to access the Google API.
//     const credential = GoogleAuthProvider.credentialFromResult(result);
//     const token = credential.accessToken;
//     // The signed-in user info.
//     const user = result.user;
//     // IdP data available using getAdditionalUserInfo(result)
//     // ...
//   }).catch((error) => {
//     // Handle Errors here.
//     const errorCode = error.code;
//     const errorMessage = error.message;
//     // The email of the user's account used.
//     const email = error.customData.email;
//     // The AuthCredential type that was used.
//     const credential = GoogleAuthProvider.credentialFromError(error);
//     // ...
//   });

// ------------------------------------------------------------ testing db

// // put hardcoded data into the db 
// const userData = {
//   firstName: 'First',
//   lastName: 'Last',
//   username: 'firstLastNames', 
//   password: 'superSupserSecretPassword', 
//   email: 'flast@macalester.edu', 
// };
// await createUser(myDB, userData); 

// // get data from an html form and add it to the db
// // check that we are on the post page
// if (document.title == "Post") { 
//   // get the post form as an HTML element
//   const newPostForm = document.forms[0];
//   const postFormData = new FormData(newPostForm);
//   // get the html button for adding post 
//   const postBtn = document.getElementsByClassName("button")[0];
//   // if button is not null
//   if (postBtn) { 
//     // add event listener for clikcing the button
//     // print data in console on click 
//     postBtn.addEventListener("click", function() { 
//       for (const [key, value] of postFormData) { 
//         console.log(`key-value pair: (${key}, ${value})`); 
//       } 
//     }); 
//   } else { 
//     console.log("post btn not found!"); 
//   }
// }

// ------------------------------------------------------------ Run app 

// check if a user is currently logged in
onAuthStateChanged(auth, user => {
    // if logged in 
    if (user != null) { 
      console.log(`'${JSON.stringify(user)}' is logged in!`);
    // if not logged in
    } else { 
      console.log("no user!");
      // direct to login page 
    } 
});