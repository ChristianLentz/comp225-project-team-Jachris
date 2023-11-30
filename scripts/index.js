/**
 * The index.js file handles the startup and initialization of the app. This is the 
 * first thing that we run, and is the entry point for the webpack module bundler. This 
 * file also handles user authentication, and calls a script to execute backend functions. 
 */

// ============================ Initialize App ============================

// Import functions from the firebase SDK
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; 
import { getAuth, 
  GoogleAuthProvider,
  signInWithCredential, 
  signInWithPopup, } from "firebase/auth";

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
  measurementId: "G-DWMWXEG7BY",
  storageBucket: "gs://mac-community-trade-center.appspot.com"
};

// Initialize firebase app 
const firebaseAPP = initializeApp(firebaseConfig);

// Initialize database, get db scripts 
const myDB = getFirestore();
import { getFormData, getUserIDByEmail } from "./dbScripts";

// Initialize storage with reference to our storage bucket
const myStore = getStorage(); 

// MVP user auth - we use window.sessionStorage for these
var email = "email";
var isAuthenticated = "isAuth";

// ============================ MVP Auth ============================

// window.setTimeout( async function () {

//   // ONLY RUN ALL OF THIS IF THE SESSION STORAGE IS EMPTY ?

//   // get selectors for nav bar elements 
//   const navbar = document.getElementById("navBar"); 
//   const accountLink = navbar.querySelector(".account"); 
//   const postLink = navbar.querySelector(".post");

//   // if user clicks account page, send them to login
//   if(accountLink) { 
//     accountLink.addEventListener( "mouseover", function() { 
//       forceLogin();  
//     });
//   }
  
//   // if user clicks post page, send them to login
//   if (postLink) {  
//     postLink.addEventListener( "mouseover", function() { 
//       forceLogin();  
//     });
//   }

//   // authenticate user once they submit the login form
//   if (document.title == "Login") {
//     await authenticate(); 
//   }
// }, 1000); 

// // ============================ Helper Functions ============================

// /**
//  * Prevent user from viewing the website before authentication. 
//  */
// function forceLogin() { 
//   const isAuth = localStorage.getItem("isAuth"); 
//   if (isAuth != "true") { 
//     window.location.href = "/pages/loginPage/login.html";
//   } 
// }

// /**
//  * Authenticate the user once they submit the login form. 
//  */
// async function authenticate() { 
//   window.setTimeout(async function () {  
//     const loginForm = document.getElementsByName("login-form").item(0);
//     loginForm.addEventListener("submit", async function (event) {
//       event.preventDefault();
//       const logininfo = await getFormData("login-form");
//       const emailFetched = logininfo.at(0).value.toString();
//       if (emailFetched.endsWith("@macalester.edu")) { 
//         sessionStorage.setItem(email, emailFetched); 
//         sessionStorage.setItem(isAuthenticated, "true"); 
//         await runApp(); 
//       }
//       else { 
            
//         // TODO: throw an error on the front end, email is not valid!

//       }
//     });
//   }, 1000);
// }

// /**
//  * Run the app/backend once we have authenticated the user. 
//  */
// async function runApp() { 

//   // NEED TO CREATE THE USER AND ADD THE USER IN THE DB FIRST ?

//   const userEmail = sessionStorage.getItem(email); 
//   const userID = await getUserIDByEmail(myDB, userEmail); 
//   if (userID == null) {
//     // current authenticated user is new, userAdded = false 
//     await runBackend(myDB, myStore, userEmail, false); 
//   }
//   else {
//     // current authenticated user is not new, userAdded = true
//     await runBackend(myDB, myStore, userEmail, true);
//   }
// }

// ============================ Google OAuth ============================

// Initialize user auth 
// const auth = getAuth(firebaseAPP);
// const provider = new GoogleAuthProvider();
// auth.languageCode = 'en';

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

// run the back end!
if (isAuthenticated) {
  console.log(`user '${email}' has been authenticated`);
  const userID = await getUserIDByEmail(myDB, email);
  // boolean passed to runBackend will determine if we add the user to the db 
  if (userID == null) {
    // current authenticated user is new, userAdded = false  
    await runBackend(myDB, myStore, email, false);
  }
  else {
    // current authenticated user is not new, userAdded = true
    await runBackend(myDB, myStore, email, true);
  }
}