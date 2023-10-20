/**
 * The functionality of our app will be built using nodeJS.
 * 
 * The index.js file handles the startup of the app, this is the first thing 
 * that we run, and is the entry point for the webpack module bundler. 
 *  
 */

// Import functions from the firebase SDK
import { initializeApp } from "firebase/app"; 
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";  
import { getAuth, 
  onAuthStateChanged, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  GoogleAuthProvider, 
  signInWithPopup} from "firebase/auth"; 

// Import db scripts 
import { createUser, createPost, getFormData } from "./dbScripts";

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

// Initialize firebase app, user auth, db, analytics
const firebaseAPP = initializeApp(firebaseConfig);
const auth = getAuth(firebaseAPP);  
const myDB = getFirestore();                
const analytics = getAnalytics(); 

// ------------------------------------------------------------ User Auth

const provider = new GoogleAuthProvider(firebaseAPP);
var e = "email"
var p = "password"


// This signs up new users to create a new password and username (Mac Email)

  createUserWithEmailAndPassword(auth, e, p)
   .then((userCredential) => {
    // Signed up 
    const user = userCredential.user;
    // ...
 })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
//     // ...
 });

// Allows users to sign in with their username and password. 
signInWithEmailAndPassword()
  .then((userCredential) => {
  // Signed in 
   const user = userCredential.user;    
})
  .catch((error) => {
  const errorCode = error.code;
  const errorMessage = error.message;
});
  
// Authenticate with Firebase using the Google provider object. Opens up other tab to sign in with email. 
signInWithPopup(auth, provider)
  .then((result) => {
    // This gives you a Google Access Token. You can use it to access the Google API.
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential.accessToken;
    // The signed-in user info.
    const user = result.user;
    // IdP data available using getAdditionalUserInfo(result)
    // ...
    }).catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.customData.email;
      // The AuthCredential type that was used.
      const credential = GoogleAuthProvider.credentialFromError(error);
      // ... 
 });

// ------------------------------------------------------------ testing db
 
/**
 * things to add here: 
 *    - move this to new file which runs upon user login? 
 *    - need to do the same thing for the create user form
 *    - only allow form submit if all fields are present (throw error if not)
 *    - only add to db if email is associated with autenticated user (throw error if not)
 *        - need user auth done for this? 
 *    - when checking current doc title, we shold only execute if user is authenticated
 */
if (document.title == "Post") {
  // pause and let window load 
  window.setTimeout( async function() { 
    // wait for add post button to be clicked
    const postBtn = document.getElementById("create-post-btn"); 
    postBtn.addEventListener("click", async function(event) { 
      event.preventDefault();
      // collect data 
      const newPostData = await getFormData("post-form");
      // send data to the db 
      await createPost(myDB, newPostData); 
    }); 
  },1000); 
}

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