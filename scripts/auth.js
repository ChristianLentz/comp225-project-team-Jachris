/**
 * Manually run user authentication. Collect user's email from an html 
 * form and check to verify that they are a member of the Macalester 
 * organization. Note that this is not a vaild authentication, and is 
 * a minimum viable product version of authentication. 
 */

// import db scripts 
import { getFormData } from "./dbScripts";

// import backend scripts 
import { runBackend } from "./backendScripts";

// authentication data ... stored using session storage
var email = "email";
var isAuthenticated = "isAuth";

// html elements used in auth process ... stored using session storage
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

            // display elements of the page on load 
            if (document.title === "Home") { 
                displayHomePageElems(false);
            }

            // restrict access to unauthenticated users
            getLinkSelectors();
            addEventListeners();

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
 * Get selectors for post and account links on the nav bar. We use these 
 * to add event listeners that restrict access to these pages when a user 
 * is not authenticated. 
 */
function getLinkSelectors() { 
    navbar = document.getElementById("navBar");
    accountLink = navbar.querySelector(".account");
    postLink = navbar.querySelector(".post");
}

/**
 * Add events listeners to post and account links. 
 */
function addEventListeners() { 
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
}

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
                console.log(`user '${emailFetched}' has been authenticated`); 
                window.location.href = "/pages/accountPage/account.html";
                await runBackend(db, store, email);
            }
            else {

                // TODO: throw an error on the front end, email is not valid!

            }
        });
    }, 1500);
}

/**
 * Remove the event listeners added to the nav bar links for post and account 
 * pages. These need to be removed once a user is authenticated. 
 */
export function removeListeners() { 
    getLinkSelectors();
    accountLink.removeEventListener("mouseover", forceLogin);
    postLink.removeEventListener("mouseover", forceLogin);
}

/**
 * Wait for the page to load to display the nav bar, post area and filters. 
 * 
 * If the call originates from the backend, do not display the login page link. 
 * 
 * @param {Boolean} backend determienes if the call originated from the backend 
 */
export function displayHomePageElems(backend) { 
    if (backend) {
        document.getElementsByClassName("login")[0].style.display = "none";
    }
    document.getElementById("loading").style.display = "none";
    document.getElementById("navBar").style.display = "inline-block";
    document.getElementsByClassName("row")[0].style.display = "flex";
}