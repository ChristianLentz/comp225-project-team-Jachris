/**
 * The index.js file handles the startup and initialization of the app. This is the 
 * first thing that we run, and is the entry point for the webpack module bundler. This 
 * file calls scripts to handle user authentication, which then runs the backend.  
 */

// ============================ Initialize App ============================

// Import functions from the firebase SDK
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Firebase configuration - measurementID is an optional parameter
const firebaseConfig = {
  apiKey: "AIzaSyDnuNDOz0v2w4M78YHk8mUupDKWT073MSE",
  authDomain: "mac-community-trade-center.firebaseapp.com",
  projectId: "mac-community-trade-center",
  storageBucket: "mac-community-trade-center.appspot.com",
  messagingSenderId: "889714479210",
  appId: "1:889714479210:web:c6719ae19008c2da0eba13",
  measurementId: "G-DWMWXEG7BY",
  storageBucket: "gs://mac-community-trade-center.appspot.com"
};

// Initialize firebase app 
const firebaseAPP = initializeApp(firebaseConfig);

// Initialize database, get db scripts 
const myDB = getFirestore();

// Initialize storage with reference to our storage bucket
const myStore = getStorage();

// run the app starting with authentication 
import { runUserAuth } from "./auth.js"
await runUserAuth(myDB, myStore);