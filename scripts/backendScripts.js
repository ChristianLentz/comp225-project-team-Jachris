/**
 * This file contains scripts which handle all of the backend functionality of 
 * the app. 
 */

// Import db scripts 
import { queryForPostsByFilter,
    getValueOfFieldByPath,
    getUserIDByEmail, 
    createPost, 
    getFormData } from "./dbScripts";

/**
 * Run the backend of the app. Execute certain scripts given user auth state and 
 * the current html document where they are located.
 * 
 * @param {Firestore} db a reference to firestore 
 */
export async function runBackend(db) { 

    // run scripts for the Home page
    if (document.title == "Home") {

        // GET FILTERS - this is after MVP phase 
 
        await homePageBackend(db, []);  
    }

    // run scripts for the Account page
    if (document.title == "Account") {
        await accountPageBackend(db); 
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
    // get data for posts to add to the home page  
    const numPosts = await getValueOfFieldByPath(db, 'metrics/totals', "total_posts", 0);
    if (numPosts > 0) { 
        const posts = await queryForPostsByFilter(db, filters, 50);
        for (let i = 0; i < posts.length; i++) { 
            console.log(posts[i])
        }
    }

    const posts = await queryForPostsByFilter(db, filters, 50);
    const postGrid = document.querySelector('.postGrid'); // Select the grid container

    for (const post of posts) {
    // Create a new card element based on the template
    const cardTemplate = document.querySelector('.flipdiv').cloneNode(true);

    // Update the card content with the retrieved data
    cardTemplate.querySelector('.frontText').textContent = "post.post_title"; // Access 'post_title'
    cardTemplate.querySelector('.frontPrice').textContent = "post.post_price"; // Access 'post_price'

    // Append the card to the "postGrid" container
    postGrid.appendChild(cardTemplate);
}


    // add the posts as html element 
    // update as needed 
}

/**
 * Run the backend scripts associated with the Account page. This includes: 
 * 
 * - Fetching the current user's data to display on the page
 * - Fetching the current user's posts to display on the page
 * 
 * Eventually we will allow the user to delete their posts using a button on the 
 * account page.  
 * 
 * @param {Firestore} db a reference to firestore
 */
async function accountPageBackend(db) { 

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
    // ALSO NEED TO THROW THIS ERROR ON THE FRONT END!
    else { 
        throw new Error("There is no user associated with email provided for post."); 
    }
}