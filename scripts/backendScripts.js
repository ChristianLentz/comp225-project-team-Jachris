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
    deletePost, 
    getFormData,
    createUser,
    setDocByRef
} from "./dbScripts";

// import auth helper 
import { removeListeners, displayHomePageElems } from "./auth";

// import firestore functions
import { doc } from "firebase/firestore";

// number of items per post
const numPostItems = 9;

// limit for querying for posts
const queryLim = 48;


// ============================ Scripts ============================

/**
 * Run the backend of the app. Execute certain scripts given user auth state and 
 * the current html document where they are located.
 * 
 * @param {Firestore} db a reference to firestore 
 * @param {Storage} store a reference to storage
 */
export async function runBackend(db, store) {

    var currUserEmail = sessionStorage.getItem("email");
    var currUserID = await getUserIDByEmail(db, currUserEmail);

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
            await homePageBackend(db, store, []).then( () => { 
                displayHomePageElems(true);
            });
        }, 1000); 
    }

    // run scripts for the Account page
    if (document.title === "Account") { 
        const otherEmail = sessionStorage.getItem("otherEmail");
        if (otherEmail == null) { 
            // dispalay the current user
            await accountPageWrapper(db, store, currUserEmail, currUserID, false);
        } 
        else { 
            // display the other user
            const otherID = await getUserIDByEmail(db, otherEmail);
            await accountPageWrapper(db, store, otherEmail, otherID, true)
                .then( () => { 
                    sessionStorage.removeItem("otherEmail"); 
                }
            );
        }
    }

    // run scripts for the Post page
    if (document.title === "Post") {
        window.setTimeout( async function() { 
            removeListeners(); 
            await postPageBackend(db, store);
        }, 1000); 
    }
}

// ============================ Home page and helpers ============================

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

    // get data for the posts to display on the home page
    // this will be an arrary of arrays, where each post array has key-value pairs
    let postsToAdd = await getPosts(db, filters);
    if (postsToAdd == null) { 
        // this handles two cases: 
        // 1: no posts exist in db
        // 2: user's filter query returns nothing
        const popup = document.getElementById("noPostPopup");
        displayPopup(popup); 
    }
    else { 
        // add each post to the postGrid div
        const postGrid = document.querySelector('.postGrid');
        for (const post of postsToAdd) {
            addPostToHomePage(post, postGrid);
        }
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
 * Add a single post to the home page.
 * 
 * @param {Firestore} db a reference to firestore
 * @param {Storage} store a reference to storage
 * @param {Array} post the post to add. 
 * @param {HTMLElement} postGrid HTML element to add the data to.
 */
function addPostToHomePage(post, postGrid) { 

    // create a new card element
    const cardTemplate = document.querySelector('.flipdiv').cloneNode(true);
    cardTemplate.style.display = 'block';
    // front of card
    cardTemplate.querySelector('.frontText').textContent = post[2].value;                  // Access 'post_title'
    cardTemplate.querySelector('.frontPrice').textContent = '$' + post[3].value;           // Access 'post_price'
    // back of card
    cardTemplate.querySelector('.backTitle').textContent = post[2].value;
    cardTemplate.querySelector('.price').textContent = '$' + post[3].value;
    cardTemplate.querySelector('.backDescription').textContent = post[4].value;            // access post descrip
    cardTemplate.querySelector('.sellerInfo').textContent = 'Seller: ' + post[0].value;    // access seller name 

    // add an event listener to the visitBtn that sends to user's profile
    cardTemplate.querySelector('.visitBtn').addEventListener( "click",  async function(event) {
        event.preventDefault();
        const emailElem = post[1].value; 
        sessionStorage.setItem("otherEmail", emailElem);
        console.log(`Now viewing user '${emailElem}`); 
        window.location.href = "/pages/accountPage/account.html";
    });

    // append the card to the "postGrid" container
    postGrid.appendChild(cardTemplate);
}

// ============================ Account page and helpers ============================


/**
 * A wrappeer function which appropriately runs the account page backend 
 * given a user's account to display. 
 * 
 * @param {Firestore} db a reference to firestore
 * @param {Storage} store a reference to storage 
 * @param {*} email email of user's account
 * @param {*} ID ID of user's account 
 * @param {Boolean} otherUser boolean to determine if current authenticated user
 */
async function accountPageWrapper(db, store, email, ID, otherUser) { 

    window.setTimeout( async function() { 
        removeListeners(); 
        await accountPageBackend(db, store, email, ID, otherUser).then( () => { 
            displayAccountPageElems(otherUser); 
        });
    }, 1000);
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
 * @param {String} userEmail email associated with the user's account 
 * @param {Number} userID the user's ID
 * @param {Boolean} otherUser determines if the user is the current authenticated user
 */
async function accountPageBackend(db, store, userEmail, userID, otherUser) {

    // get information about the user whose page we are building
    const userPath = "users/user" + userID.toString();
    const isNew = await getValueOfFieldByPath(db, userPath, "isNew", false);
    // edit account when 'editBtn' is clicked 
    if (!otherUser) { 
        document.getElementById('editBtn').addEventListener('click', async function () {
            await accountModal(db, userPath, userEmail, isNew);
            await updateUserStatus(db, userPath);
        });
    }
    // ask user to set their info upon account creation
    if (isNew) {
        await accountModal(db, userPath, userEmail, isNew); 
        await updateUserStatus(db, userPath);
    } else {
        // display account info
        const userData = await getUserData(db, userID);
        setAccountFrontend(userData['user_name'],
                            userData['user_title'],
                            userData['profile_pic'],
                            userEmail);
        // display posts
        const userPostObjs = await getUserPosts(db, userID);
        console.log(userPostObjs); 
        if (userPostObjs != null) {
            const userPosts = convertPosts(userPostObjs);
            const userPostArea = document.querySelector('.postGrid');
            for (const post of userPosts) {
                console.log(post);
                addPostToAccountPage(db, post, userPostArea);
            }
        }
    }
}

/**
 * Display the elemetns of the account page once we have loaded 
 * the appropraite data from the backend. If we are diplsaying the 
 * page for a user other than the current authenticated user, then 
 * otherUser will be true. 
 * 
 * @param {Boolean} otherUser determines which account page to display
 */
function displayAccountPageElems(otherUser) {  

    // don't allow edit access when viewing another user's account 
    if (otherUser) { 
        console.log("made it to the other user elems");
        const trashBtns = document.getElementsByClassName("trashButton"); 
        console.log(trashBtns);
        for (var i = 0; i < trashBtns.length; i++) { 
            trashBtns.item(i).style.display = "none";
        }
    } else { 
        document.getElementById("editBtn").style.display = "block";
    }

    // elements to show in both cases of otherUser
    document.getElementById("loading").style.display = "none";
    document.getElementsByClassName("card")[0].style.display = "block"; 
    document.getElementsByClassName("userPostarea")[0].style.display = "block";
    document.getElementsByClassName("postGrid")[0].style.display = "grid";
    document.getElementsByClassName("footer")[0].style.display = "block";
}

/**
 * Open the 'edit account' modal when a new user is logged in, or when the 
 * current user requests to edit. When the user is done, close the modal, 
 * and call 'updateAccountInfo' to update the front end, and send the data 
 * to the database. 
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
    setAccountFrontend(userName, userTitle, selectedImg, email);
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
function setAccountFrontend(name, title, img, email) {

    document.getElementById('cardName').innerText = name;
    document.getElementById('title').innerText = title;
    document.getElementById('cardImage').setAttribute('src', img);
    document.querySelector('div.card > a').setAttribute('href', "mailto:" + email);
}

/**
 * Add a post to the user's account page.
 * 
 * @param {Firestore} db a reference to firestore 
 * @param {Array} post an array with the post data to add
 * @param {HTMLElement} postGrid div to add the post to 
 */
function addPostToAccountPage(db, post, postGrid) {

    // create a new card element
    const cardTemplate = document.querySelector('.flipdiv').cloneNode(true);
    cardTemplate.style.display = 'block';
    // front of card
    cardTemplate.querySelector('.frontText').textContent = post[2].value;                 // Access 'post_title'
    cardTemplate.querySelector('.frontPrice').textContent = '$' + post[3].value;          // Access 'post_price'
    // back of card
    cardTemplate.querySelector('.backTitle').textContent = post[2].value;
    cardTemplate.querySelector('.price').textContent = '$' + post[3].value;
    cardTemplate.querySelector('.backDescription').textContent = post[4].value;           // access post descrip
    cardTemplate.querySelector('.sellerInfo').textContent = 'Seller: ' + post[0].value;   // access seller name

    // add event listener to delete the post upon user's request 
    cardTemplate.querySelector('.trashButton').addEventListener( "click", async function() { 
        await deletePost(db, post[6].value);
    });

    // add the post to the page 
    postGrid.appendChild(cardTemplate);
}

// ============================ Post page and helpers ============================

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
            const emailText = document.getElementById("post-mail").value;
            const userID = await getUserIDByEmail(db, emailText);
            if (userID == null) { 
                const popup = document.getElementById("invalidEmailPopup"); 
                displayPopup(popup);
            } 
            else { 
                const newPostData = await getFormData("post-form");
                await sendPostToDB(db, newPostData, userID);
            }
        });
    }, 1000);
}

/**
 * Collect a new post and send to the the database. 
 * 
 * @param {Firestore} db a reference to firestore
 * @param {Array} newPostData data to be added to the databse
 * @param {Number} userID the ID associated with the user who is posting 
 */
async function sendPostToDB(db, newPostData, userID) {

    // add the user ID to the form data 
    newPostData.push({ key: "post_userID", value: userID });
    // send data to the db 
    await createPost(db, newPostData);
    window.location.href = "/index.html"; 
}

// ============================ Other Helper Functions ============================

/**
 * The functions in this section are used in multiple pages across the backend 
 * and some are used in auth.js. 
 */

/**
 * Call convertDataArrayFromObjToArray on an array of posts. This unwraps the 
 * object returned from firebase and provides an array of data that we can add 
 * to the frontend. This is used for both homePageBackend and accountPageBackend. 
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
 * Display a popup on the page. This is used for the noPostPopup on the 
 * home page, the invalidEmailPopup on the post page and the invalidLoginPopup 
 * on the lgin page. 
 * 
 * @param {HTMLElement} popup
 */
export function displayPopup(popup) { 

    // diplay the popup
    popup.style.display = "block"; 
    // get the close button and add event listener 
    const closeBtn = document.getElementById("closePopup"); 
    closeBtn.addEventListener( "click", () => { 
        popup.style.display = "none"; 
    });
}