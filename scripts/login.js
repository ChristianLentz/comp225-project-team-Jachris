/**
 * This file handles the functionality of the login page, including: 
 * 
 * - Logging a user into the app 
 * - Creating a new user and sending that data to db 
 */

import { onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider } from "firebase/auth";
