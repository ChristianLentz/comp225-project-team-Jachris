/**
 * This file contains scripts which handle all of the backend functionality of 
 * the app. The main pupose of this file is to connect the database to the 
 * front end.  
 */

// ============================ Imports, variables, constants ============================

// import db scripts 
import {
    queryForPostsByFilter,
    getUserPosts,
    getUserData,
    getValueOfFieldByPath,
    updateUserStatus,
    convertDataFromObjToArray,
    getUserIDByEmail,
    createPost,
    getFormData,
    createUser,
    setDocByRef
} from "./dbScripts";

// import auth helper 
import { removeListeners } from "./auth";

// import firestore functions
import { doc } from "firebase/firestore";

// number of items per post
const numPostItems = 8;

// limit for querying for posts
const queryLim = 48;

// current user's info
var currUserEmail; 
var currUserID; 

// ============================ Scripts ============================

/**
 * Run the backend of the app. Execute certain scripts given user auth state and 
 * the current html document where they are located.
 * 
 * @param {Firestore} db a reference to firestore 
 * @param {Storage} store a reference to storage
 * @param {String} email session storage key for the current user's email
 */
export async function runBackend(db, store, email) {

    currUserEmail = sessionStorage.getItem(email);
    currUserID = await getUserIDByEmail(db, currUserEmail);

    // Add new user to DB
    // only if authenticated user's email not yet associated with user in DB  
    if (currUserID == null) {
        await createUser(db, store, currUserEmail).then( async function () { 
            currUserID = await getUserIDByEmail(db, currUserEmail);
        }); 
    } 

    // run scripts for the Home page
    if (document.title === "Home") {

        window.setTimeout( async function() { 

            // TODO: AFTER MVP PHASE
            // get filters currently selected 

            removeListeners(); 
            await homePageBackend(db, store, []);
        }, 1000); 
    }

    // run scripts for the Account page
    if (document.title === "Account") {
        window.setTimeout( async function() { 
            removeListeners(); 
            await accountPageBackend(db, store, currUserEmail, currUserID);
        }, 1000); 
    }

    // run scripts for the Post page
    if (document.title === "Post") {
        window.setTimeout( async function() { 
            removeListeners(); 
            await postPageBackend(db, store);
        }, 1000); 
    }

    // redirect authenticated users to their account if access login form 
    if (document.title === "Login") { 
        window.location.href = "/pages/accountPage/account.html"; 
    }
}

/**
 * Run the backend scripts associated with the Home page. This includes: 
 * 
 * - Fetching posts to populate the home page 
 * 
 * Eventually we may query posts based on filters. 
 * 
 * @param {Firestore} db a reference to firestore
 * @param {Storage} store a reference to storage
 * @param {Array} filters the filters currently selected for filtering posts 
 */
async function homePageBackend(db, store, filters) {

    // get the data for the posts 
    // this will be an arrary of arrays, where each post array has key-value pairs
    const numPosts = await getValueOfFieldByPath(db, 'metrics/totals', "total_posts", 0);
    if (numPosts > 0) {
        // get posts and add to the home page
        let postsToAdd = await getPosts(db, filters);
        const postGrid = document.querySelector('.postGrid');
        for (const post of postsToAdd) {
            addPostToHomePage(post, postGrid);
        }
    } else {

        // TODO: AFTER MVP PHASE
        // show on the front end that the selected filters do not return anything

    }
}

/**
 * Run the backend scripts associated with the Account page. This includes: 
 * 
 * - Fetching the current user's data to display on the page
 * - Fetching the current user's posts to display on the page
 * - Deleting or adding data to the db according to user's edits
 * 
 * Eventually we will allow the user to delete their posts using a button on the 
 * account page.  
 * 
 * @param {Firestore} db a reference to firestore
 * @param {Storage} store a reference to storage
 * @param {String} userEmail email associated with the current authenticated user
 */
async function accountPageBackend(db, store, userEmail, userID) {

    // get information about the current user
    const userPath = "users/user" + userID.toString();
    const isNew = await getValueOfFieldByPath(db, userPath, "isNew", false);
    // edit account when 'editBtn' is clicked 
    document.getElementById('editBtn').addEventListener('click', async function () {
        await accountModal(db, userPath, userEmail, isNew);
        await updateUserStatus(db, userPath);
    });
    // ask user to set their info upon account creation
    if (isNew) {
        console.log("made it to user modal part and updating user status");
        await accountModal(db, userPath, userEmail, isNew);
        await updateUserStatus(db, userPath);
    } else {
        // display account info 
        const userData = await getUserData(db, userID);
        setFrontend(
            userData['user_name'],
            userData['user_title'],
            userData['profile_pic'],
            userEmail
        );
        // display posts
        const userPostObjs = await getUserPosts(db, userID);
        const userPosts = convertPosts(userPostObjs);
        if (userPosts != null) {
            const userPostArea = document.querySelector('.postGrid');
            for (const post of userPosts) {
                addPostToAccountPage(post, userPostArea);
            }
        }
    }
}

/**
 * Run the backend scripts associated with the Post page. This includes: 
 * 
 * - Adding a new post to the database 
 * - Recording total posts
 * - Assigning the new post an ID corresponding to the user who posted it 
 * 
 * Eventually we will allow multiple photoes per posts and tags for the posts 
 * which correspond to the filters on the home page. 
 * 
 * @param {Firestore} db a referece to firestore
 * @param {Storage} store a reference to storage
 */
async function postPageBackend(db, store) {

    // pause and let window load 
    window.setTimeout(async function () {
        // collect the post data and add to the database when button clicked
        const postForm = document.getElementsByName("post-form").item(0);
        postForm.addEventListener("submit", async function (event) {
            event.preventDefault();
            const newPostData = await getFormData("post-form");
            await sendPostToDB(db, newPostData);
            window.location.href = "/pages/accountPage/account.html"
        });
    }, 1000);
}

// ============================ Helper Functions ============================

/**
 * Collect a new post and send to the the database. 
 * 
 * @param {Firestore} db a reference to firestore
 * @param {Array} newPostData data to be added to the databse
 */
async function sendPostToDB(db, newPostData) {

    // get the user's email and userID 
    const emailText = document.getElementById("post-mail").value;
    const userID = await getUserIDByEmail(db, emailText);
    if (userID != null) {
        // add the user ID to the form data 
        newPostData.push({ key: "post_userID", value: userID });
        // send data to the db 
        await createPost(db, newPostData);
    }
    // throw error if email is not valid
    else {

        // TODO: 
        // also need to throw this error on the front end

        throw new Error("There is no user associated with email provided for post.");
    }
}

/**
 * Uses the queryForPostsByFilter function in dbScripts.js to get a set of posts
 * according to given filters to query by. 
 * 
 * Will return queryLim posts at most. 
 * 
 * Used in homePageBackend. 
 * 
 * @param {Firestore} db a reference to firestore
 * @param {Array} filters items to query by, an array of strings
 * 
 * @returns the posts data that we queried for, or null 
 */
async function getPosts(db, filters) {

    const posts = await queryForPostsByFilter(db, filters, queryLim);
    if (posts == null) {
        return posts;
    } else {
        return convertPosts(posts);
    }
}

/**
 * Call convertDataArrayFromObjToArray on an array of posts. Used multiple
 * times in this file. 
 * 
 * @param {Array} posts the array of posts as objects from firestore
 * 
 * @returns an array of arrays, where each inner array is the data for one post. 
 */
function convertPosts(posts) {

    let postArr = [];
    for (let i = 0; i < posts.length; i++) {
        const post = convertDataFromObjToArray(posts[i], numPostItems);
        postArr.push(post);
    }
    return postArr;
}

/**
 * Add a single post to the home page. Used in homePageBackend
 * 
 * @param {Array} post the post to add. 
 * @param {HTMLElement} postGrid HTML element to add the data to.
 */
function addPostToHomePage(post, postGrid) {

    // create a new card element
    const cardTemplate = document.querySelector('.flipdiv').cloneNode(true);
    // front of card
    cardTemplate.querySelector('.frontText').textContent = post[2].value;                  // Access 'post_title'
    cardTemplate.querySelector('.frontPrice').textContent = '$' + post[3].value;           // Access 'post_price'
    // back of card
    cardTemplate.querySelector('.backTitle').textContent = post[2].value;
    cardTemplate.querySelector('.price').textContent = '$' + post[3].value;
    cardTemplate.querySelector('.backDescription').textContent = post[4].value;            // access post descrip
    cardTemplate.querySelector('.sellerInfo').textContent = 'Seller: ' + post[0].value;    // access seller name
    // append the card to the "postGrid" container
    postGrid.appendChild(cardTemplate);
}

/**
 * Open the edit account modal when a new user is logged in, or when the 
 * current user requests to edit. When the user is done, close the model, 
 * update the front end, and send the data to the database. 
 * 
 * @param {Firestore} db  a reference to firestore 
 * @param {String} path a path to the user's document in firebase
 * @param {String} email the current user's email
 * @param {Boolean} isNew boolean to determine if the user is new
 */
async function accountModal(db, path, email, isNew) {

    // open the modal
    document.getElementById('editModal').style.display = 'block';
    // update values for html elements
    document.getElementById('username').value = document.getElementById('cardName').innerText;
    document.getElementById('descrip').value = document.getElementById('title').innerText;
    if (!isNew) {
        const currentImageSrc = document.getElementById('cardImage').getAttribute('src');
        document.querySelector(`input[name="profilePhoto"][value="${currentImageSrc}"]`).checked = true;
    }
    // add event listener to the submit button 
    document.getElementById('editForm').addEventListener('submit', async function (event) {
        event.preventDefault();
        await updateAccountInfo(db, path, email);
        // close the modal 
        document.getElementById('editModal').style.display = 'none';
    });
}

/**
 * When user is done updating profile, update the front end and send 
 * data to the databse. 
 * 
 * @param {Firestore} db a reference to firestore
 * @param {String} path a path to the user's document in firebase
 */
async function updateAccountInfo(db, path, email) {

    // get data entered by the user
    const userName = document.getElementById('username').value;
    const userTitle = document.getElementById('descrip').value;
    const selectedImg = document.querySelector('input[name="profilePhoto"]:checked').value;
    setFrontend(userName, userTitle, selectedImg, email);
    // send data to the database
    const data = {
        user_name: userName,
        user_title: userTitle,
        profile_pic: selectedImg
    }
    const docRef = doc(db, path);
    await setDocByRef(docRef, data);
}

/**
 * Update the user account front end. 
 * 
 * @param {String} name name of the user
 * @param {String} title title of the user
 * @param {String} img a path to user's profile picture 
 * @param {String} email email of the user
 */
function setFrontend(name, title, img, email) {

    document.getElementById('cardName').innerText = name;
    document.getElementById('title').innerText = title;
    document.getElementById('cardImage').setAttribute('src', img);
    document.querySelector('div.card > a').setAttribute('href', "mailto:" + email);
}

/**
 * Add a post to the user's account page
 * 
 * @param {Array} post 
 * @param {HTMLElement} postGrid
 */
function addPostToAccountPage(post, postGrid) {

    // create a new card element
    const cardTemplate = document.querySelector('.flipdiv').cloneNode(true);
    // front of card
    cardTemplate.querySelector('.frontText').textContent = post[2].value;                 // Access 'post_title'
    cardTemplate.querySelector('.frontPrice').textContent = '$' + post[3].value;          // Access 'post_price'
    // back of card
    cardTemplate.querySelector('.backTitle').textContent = post[2].value;
    cardTemplate.querySelector('.price').textContent = '$' + post[3].value;
    cardTemplate.querySelector('.backDescription').textContent = post[4].value;           // access post descrip
    cardTemplate.querySelector('.sellerInfo').textContent = 'Seller: ' + post[0].value;   // access seller name
    // append the card to the "postGrid" container
    postGrid.appendChild(cardTemplate);
}