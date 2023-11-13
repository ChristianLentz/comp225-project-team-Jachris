/**
 * This file contains scripts which handle all of the backend functionality of 
 * the app. The main pupose of this file is to connect the database to the 
 * front end.  
 */

// ============================ Imports, variables, constants ============================

// Import db scripts 
import { queryForPostsByFilter,
    getUserPosts,
    getUserData, 
    getValueOfFieldByPath,
    convertDataFromObjToArray,
    getUserIDByEmail, 
    createPost, 
    getFormData, 
    createUser} from "./dbScripts";

// number of items per post (WILL CHANGE AS MORE FEATURES ADDED)
const numPostItems = 8;
// limit for querying for posts
const queryLim = 48; 
// boolean to determine if this is a new user
let newUser = false; 

// ============================ Scripts ============================

/**
 * Run the backend of the app. Execute certain scripts given user auth state and 
 * the current html document where they are located.
 * 
 * @param {Firestore} db a reference to firestore 
 * @param {String} currUserEmail the email for the current authenticated user
 * @param {Boolean} userAdded determines if we add the current user to the db as a new user
 */
export async function runBackend(db, currUserEmail, userAdded) { 

    newUser = !userAdded

    // Add new user to DB
    // only if authenticated user's email not yet associated with user in DB  
    if (newUser) { 
        await createUser(db, currUserEmail);
        window.location.href = "/pages/accountPage/account.html"
    }

    // run scripts for the Home page
    if (document.title == "Home") {

        // TODO: AFTER MVP PHASE
        // get filters currently selected 
 
        await homePageBackend(db, []);  
    }

    // run scripts for the Account page
    if (document.title == "Account") { 
        await accountPageBackend(db, currUserEmail); 
    }

    // run scripts for the Post page
    if (document.title == "Post") {
        await postPageBackend(db)
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
 * @param {Array} filters the filters currently selected for filtering posts 
 */
async function homePageBackend(db, filters) { 
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
 * @param {String} userEmail email associated with the current authenticated user
 */
async function accountPageBackend(db, userEmail) { 

    const userID = await getUserIDByEmail(db, userEmail);

    // testing
    console.log("checking new user");
    console.log("new user boolean", newUser);

    // TODO: 
    if (newUser) { 
        // ask user to set their account info if they are new

        console.log("new user found");
        openModal();
        console.log("should open mondal");

    } else {  
        // display the user's posts on their account page

        // testing 
        console.log("never found new user")

        const userPosts = await getUserPosts(db, userID);
        if (userPosts != null) { 
            const posts = convertPosts(userPosts); 
            // add the posts here!

        }
    }

    // TODO: 
    // add the user's data to their account page 
    const userCard = document.querySelector('.card');
    const userData = await getUserData(db, userID);

    // ============= working on this ============= 
    
    // // updates the text on account page, breaks the js for edit account
    // const titleElement = userCard.querySelector('.title');
    // titleElement.textContent = userEmail;

    // const userCard = document.querySelector('.card');

    // const titleElement = userCard.querySelector('.title');
    // console.log("titleElement:", titleElement); 
    // console.log("usercard", userCard);

    // console.log("user data", userData);
    // console.log("user email",userEmail);
    // console.log("test", userData.userEmail);
    // userCard.querySelector('.cardName').textContent = 'test bru';
    // userCard.querySelector('.title').textContent = "userEmail"; // Access 'post_title'
    // cardTemplate.querySelector('.frontPrice').textContent = '$' + post[3].value;

    // ============= working on this ============= 

    // TODO:
    // update the user's data when edit button clicked

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
 */
async function postPageBackend(db) { 

    // pause and let window load 
    window.setTimeout( async function() { 
      // collect the post data and add to the database when button clicked
      const postForm = document.getElementsByName("post-form").item(0);
      postForm.addEventListener("submit", async function(event) {
        event.preventDefault();
        const newPostData = await getFormData("post-form"); 
        await sendPostToDB(db, newPostData);
        window.location.href = "/pages/accountPage/account.html"
      }); 
    },1000);
    // send user to their account page 
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
        newPostData.push({key: "post_userID", value: userID});
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
    // Create a new card element based on the template
    const cardTemplate = document.querySelector('.flipdiv').cloneNode(true);
    // Update the card content with the retrieved data
    // Front of card
    cardTemplate.querySelector('.frontText').textContent = post[2].value; // Access 'post_title'
    cardTemplate.querySelector('.frontPrice').textContent = '$' + post[3].value; // Access 'post_price'
    // Back of card
    cardTemplate.querySelector('.backTitle').textContent = post[2].value;
    cardTemplate.querySelector('.backDescription').textContent = post[4].value; // Post descrip
    cardTemplate.querySelector('.price').textContent = '$' + post[3].value;
    cardTemplate.querySelector('.sellerInfo').textContent = post[0].value; // seller name
    // Append the card to the "postGrid" container
    postGrid.appendChild(cardTemplate);
}