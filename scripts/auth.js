/**
 * 
 * 
 * 
 * 
 */

// import db scripts 
import { getFormData, getUserIDByEmail } from "./dbScripts";

// import backend scripts 
import { runBackend } from "./backendScripts";

// session storage variables
var email = "email";
var isAuthenticated = "isAuth";

export async function runUserAuth(db, store) {

    // let window load upon open 
    window.setTimeout(async function () {

        // check session storage to see if user is authenticated
        const isNotAuth = !(sessionStorage.getItem(isAuthenticated) === "true");
        if (isNotAuth) {

            // get selectors for nav bar elements 
            const navbar = document.getElementById("navBar");
            const accountLink = navbar.querySelector(".account");
            const postLink = navbar.querySelector(".post");

            // if user clicks account page, send them to login
            if (accountLink) {
                accountLink.addEventListener("mouseover", function () {
                    forceLogin();
                });
            }

            // if user clicks post page, send them to login
            if (postLink) {
                postLink.addEventListener("mouseover", function () {
                    forceLogin();
                });
            }

            // authenticate user once they submit the login form
            if (document.title == "Login") {
                await authenticate(db, store);
            }
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
* Authenticate the user once they submit the login form. 
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