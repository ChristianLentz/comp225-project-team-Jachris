/**
 * Manually run user authentication. Collect user's email from an html 
 * form and check to verify that they are a member of the Macalester 
 * organization. Note that this is not a vaild authentication, and is 
 * a minimum viable product version of authentication. 
 */

// import db scripts 
import { getFormData, getUserIDByEmail } from "./dbScripts";

// import backend scripts 
import { runBackend } from "./backendScripts";

// session storage variables
var email = "email";
var isAuthenticated = "isAuth";

// html elements used in auth process
var navbar;
var accountLink;
var postLink;

// ============================ Auth Script ============================

/**
 * The MVP authentication script. 
 * 
 * @param {Firestore} db a reference to firestore
 * @param {Storage} store a reference to storage
 */
export async function runUserAuth(db, store) {

    // let window load upon open 
    window.setTimeout(async function () {

        // check session storage to see if user is authenticated
        const isNotAuth = !(sessionStorage.getItem(isAuthenticated) === "true");
        if (isNotAuth) {

            var navbar = document.getElementById("navBar");
            var accountLink = navbar.querySelector(".account");
            var postLink = navbar.querySelector(".post"); 

            // if user tries to access account or post page, send them to login
            if (accountLink || postLink) {
                accountLink.addEventListener("mouseover", function (event) {
                    event.preventDefault(); 
                    forceLogin();
                });
                postLink.addEventListener("mouseover", function (event) {
                    event.preventDefault();
                    forceLogin();
                });
            }

            // authenticate user when they access the login page
            if (document.title == "Login") {
                await authenticate(db, store);
            }
        // user already authenticated during this browser session
        } else {
            await runBackend(db, store, email);
        }
        
    }, 1000);

}

// ============================ Helper Functions ============================

/**
* Prevent user from viewing the website before authentication. 
*/
function forceLogin() {
    window.location.href = "/pages/loginPage/login.html";
}

/**
 * Authenticate user once they submit the login form. 
 * 
 * @param {Firestore} db a references to firestore
 * @param {Storage} store a reference to storage
 */
async function authenticate(db, store) {
    window.setTimeout(async function () {
        // get the login form 
        const loginForm = document.getElementsByName("login-form").item(0);
        loginForm.addEventListener("submit", async function (event) {
            event.preventDefault();
            // get email from the login form
            const logininfo = await getFormData("login-form");
            const emailFetched = logininfo[0].value.toString();
            // if valid emial, authenticate and run the app 
            if (emailFetched.endsWith("@macalester.edu")) {
                sessionStorage.setItem(email, emailFetched);
                sessionStorage.setItem(isAuthenticated, "true");
                await runBackend(db, store, email);
            }
            else {

                // TODO: throw an error on the front end, email is not valid!

            }
        });
    }, 1000);
}

/**
 * Remove the event listeners added to the nav bar links for post and account 
 * pages. These need to be removed once a user is authenticated. 
 */
export function removeListeners() { 
    accountLink.removeEventListener("mouseover", forceLogin);
    post.removeEventListener("mouseover", forceLogin);
}