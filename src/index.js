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
import { 
    getAuth, 
    onAuthStateChanged} from "firebase/auth";
import { 
    getFirestore, 
    doc,
    Timestamp, 
    FieldValue, 
    Filter} from "firebase/firestore"; // 'https://gstatic.com/firebasejs/9.0.0/firebase-firestore.js'

// Import other SDKs and functions needed

// ------------------------------------------------------------ 

// In this section we initialize the the firebase app 

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

// initialize the app 
const myApp = initializeApp(firebaseConfig);
// initialize the database                            TODO: set up DB
const myDB = getFirestore();  
// get analytics for a given instance of the app      TODO: set this up 
const analytics = getAnalytics();
// get auth for the current instance of the app       TODO: set this up
const auth = getAuth(); 

// ------------------------------------------------------------ 

/**
 * In this section we handle the actual functionality of the app. We use 
 * event handlers to respond to actions from the user within the site 
 * 
 * See more about event handlers and asynchronous actions in JS here: 
 * https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous/Introducing
 */

// check if user is currently logged in
onAuthStateChanged(auth, user => {
    if (user != null) { 
        console.log("logged in!"); 
        // run the app 
    } else { 
        console.log("no user!");
        // direct user to login page and then run the app 
    }
}); 