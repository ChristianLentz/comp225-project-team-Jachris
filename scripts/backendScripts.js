/**
 * This file contains scripts which handle all of the backend functionality of 
 * the app. 
 */

// ============================ Imports, variables, constants ============================

// Import db scripts 
import { queryForPostsByFilter,
    getValueOfFieldByPath,
    convertDataFromObjToArray,
    getUserIDByEmail, 
    createPost, 
    getFormData, 
    createUser} from "./dbScripts";

// number of items per post/user document (WILL CHANGE AS MORE FEATURES ADDED)
const numPostItems = 8; 
const numUserItems = 2; 
// limit for querying for posts
const queryLim = 48; 

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

    // Add new user to DB
    // only if authenticated user's email not yet associated with user in DB  
    if (!userAdded) { 
        let userData = []; 
        userData.push({key: "user_email", value: currUserEmail});
        // await createUser(db, userData);
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
    const numPosts = await getValueOfFieldByPath(db, 'metrics/totals', "total_posts", 0);
    if (numPosts > 0) { 
        let postsToAdd = await getPosts(db, filters); 

        // TODO: 
        // add posts to home page as html elements
        const postGrid = document.querySelector('.postGrid'); // Select the grid container
        for (const post of postsToAdd) {
            // Create a new card element based on the template
            const cardTemplate = document.querySelector('.flipdiv').cloneNode(true);
            // Update the card content with the retrieved data
            // console.log("title" ,post.post_title.value);
            // console.log("price", post.post_price);
            // console.log("trying to get price", post[4].value);
            // Front of card
            cardTemplate.querySelector('.frontText').textContent = post[2].value; // Access 'post_title'
            cardTemplate.querySelector('.frontPrice').textContent = '$' + post[3].value; // Access 'post_price'
            // Back of card
            cardTemplate.querySelector('.backTitle').textContent = post[2].value;
            cardTemplate.querySelector('.backDescription').textContent = post[4].value; //Post descrip
            cardTemplate.querySelector('.price').textContent = '$' + post[3].value;
            cardTemplate.querySelector('.sellerInfo').textContent = post[0].value; //seller name
            
            // Append the card to the "postGrid" container
            postGrid.appendChild(cardTemplate);
        }

    } else { 

        // TODO: AFTER MVP PHASE
        // show on the front end that the selected filter do not return anything

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
    const userData = null; 
    const userPosts = null; 

    // TODO:
    // get user's data to display on account page 
    // get all posts associated with the user
    // add button on front end to edit account, send to/update db on submit 

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
      }); 
    },1000); 
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
 * Used in homePageBackend and accountPageBackend
 * 
 * @param {Firestore} db a reference to firestore
 * @param {Array} filters items to query by, an array of strings
 */
async function getPosts(db, filters) { 
    let postArr = []; 
    const posts = await queryForPostsByFilter(db, filters, queryLim);
        // for each post we fetched, convert to array
        if (posts != null) { 
            for (let i = 0; i < posts.length; i++) {  
                const post = convertDataFromObjToArray(posts[i], numPostItems); 
                postArr.push(post);   
            }
        }
    return postArr; 
}