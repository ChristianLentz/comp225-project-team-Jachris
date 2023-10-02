/**
 * - The functionality of our app will be built using nodeJS
 * - The index.js file handles the startup of the app, this is the first thing 
 * that we run.
 * - All key functionality starts here. This is where we import the packages we 
 * need, initialize the app / db, and get auth state / analytics for a given 
 * instance of the app  
 */

// Import functions from the firebase SDK
import { initializeApp } from "firebase/app"; // 'https://gstatic.com/firebasejs/9.0.0/firebase-app.js'
import { getAuth, onAuthStateChanged } from "firebase/auth"; // 'https://gstatic.com/firebasejs/9.0.0/firebase-auth.js'
import { getFirestore, Timestamp, FieldValue, Filter} from "firebase/firestore"; // 'https://gstatic.com/firebasejs/9.0.0/firebase-firestore.js'
import { getAnalytics } from "firebase/analytics"; // 'https://gstatic.com/firebasejs/9.0.0/firebase-analytics.js'

// Import other SDKs and functions needed

// ------------------------------------------------------------ initialize app

// Our Firebase configuration
// Note that measurementID is an optional parameter here
const firebaseConfig = {
  apiKey: "AIzaSyDnuNDOz0v2w4M78YHk8mUupDKWT073MSE",
  authDomain: "mac-community-trade-center.firebaseapp.com",
  projectId: "mac-community-trade-center",
  storageBucket: "mac-community-trade-center.appspot.com",
  messagingSenderId: "889714479210",
  appId: "1:889714479210:web:c6719ae19008c2da0eba13",
  measurementId: "G-DWMWXEG7BY"
};
const myApp = initializeApp(firebaseConfig);

// ------------------------------------------------------------ initialize db

// Initialize database
// TODO: set up our db
const myDB = getFirestore(firebaseConfig) 

// ------------------------------------------------------------ analytics 

// Get analytics for a given instance of the app
// TODO: set this up!   
const analytics = getAnalytics(myApp);

// ------------------------------------------------------------ user auth

// Get auth for the current instance of the app 
// TODO: set up user authentification with mac emails! 
const auth = getAuth(myApp); 

// Check / recored user login 
onAuthStateChanged(auth, user => { 
    if (user != null) { 
        console.log("logged in!"); 
    } else { 
        console.log("no user!"); 
    }
})