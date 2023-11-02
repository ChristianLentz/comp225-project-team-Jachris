/**
 * The functionality of our app will be built using nodeJS.
 * 
 * The index.js file handles the startup of the app, this is the first thing 
 * that we run, and is the entry point for the webpack module bundler. 
 */

// ------------------------------------------------------------ Imports, Initialize App

// Import functions from the firebase SDK
import { initializeApp } from "firebase/app"; 
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";  
import { getAuth, 
  onAuthStateChanged, 
  createUserWithEmailAndPassword,  
  GoogleAuthProvider, 
  signInWithPopup,
  ProviderId} from "firebase/auth"; 

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

// Initialize firebase app, user auth, db, analytics
const firebaseAPP = initializeApp(firebaseConfig);
const auth = getAuth(firebaseAPP);
auth.languageCode = 'en'  
const myDB = getFirestore();                
const analytics = getAnalytics(); 
const provider = new GoogleAuthProvider();

// ------------------------------------------------------------ User Auth

const signInWithGoogle= () => {
    signInWithPopup(auth, ProviderId)
    .then((result) => {
      const name = result.user.displayName;
      const email = result.user.email;
      const profilePic = result.user.photoURL;
    })
    .catch((error) => {
      console.log(error);
    });
};

// function firebaseApp() {
  //   return (
  //     <div className="firebaseApp">
  //       <button class="login-with-google-btn" onClick={signInWithGoogle}>
  //       </button>
  //       <h1>{localStorage.getItem("name")}</h1>
  //       <h1>{localStorage.getItem("email")}</h1>
  //      <img src={localStorage.getItem("profilePic")} />
  //     </div>
  //   );
  // }

// ------------------------------------------------------------ Run app 

// check if a user is currently logged in
onAuthStateChanged(auth, user => {
    // if there is a user logged in 
    if (user != null) { 
      console.log(`'${JSON.stringify(user)}' is logged in!`);

      // 1) direct user to home page (index.html)

    // if there is no user logged in 
    } else { 
      console.log("no user!");

      // 1) direct to login page 
      // 2) allow user to login/create account 
      // 3) direct user to home page (index.html) 

    } 
  });

// run the app once user is authenticated
await runBackend(myDB); 