/**
 * This file contains backend functionality for linking our site to our databse.
 * 
 * Our database is built using the Firebase feature Cloud Firestore, using NoSQL.
 * 
 * Our database will contain two collections: users and posts. 
 * 
 * Each document within the users collection will represent one user or one post. The 
 * naming convention for each document will be userX or postX, where X is a positive 
 * integer representing the order in which the post/user was added to the site. For
 * example, user137 created their account and was added to the DB before user138. 
 * 
 * Each user will have the following items within its document: 
 * 
 *      - firstName -> string 
 *      - lastName -> string
 *      - username -> string
 *      - password -> string 
 *      - email -> string 
 *      - userID -> an integer > 0 
 * 
 * Each post will have the following items within its document:
 * 
 *      - title -> string 
 *      - sell -> boolean
 *      - price -> real number > 0 (will default to zero if sell is false)
 *      - description -> string  
 *      - postID -> an integer > 0
 *      - postedBy -> an integer > 0 corresponding to the user who posted 
 *      - datePosted -> a string in the format mm/dd/yyyy
 *
 * More items will be added as we move past the minimum viable product phase and 
 * implement more features. These may include: 
 * 
 *      - A sub-collection for each user to define their tags/prefs
 *      - A sub-collection for each post to define the tags given to it by the poster
 * 
 * We are exporting async functions here, which can only be called during asynchronous 
 * actions.
 */

// import firestore functions from firebase library 
import { Firestore, doc } from "firebase/firestore"; 

/**
 * Some notes: 
 * 
 *  - We can use 'set' to add data to a document. If the document DNE, it will be created (we must 
 *  provide an ID for the doc in this case), if the doc does exist, then we can overwrite the whole 
 *  thing or use 'merge'
 *  - We can store strings, booleans, numbers (as doubles), dates, null, and nested arrays
 *  and objects in a collection in firestore
 *  - If we want to create a document but don't have a meaningful ID to provide, then we can use 'add'
 *  to create the doc and generate an ID
 */

/**
 * Get all users from the db according to the given query. 
 * @param {Firestore} db - reference to cloud firestore
 * @param {query} query 
 */
export async function getAllUsers (db, query) { 

}

/**
 * Get all posts from the db according to the given query. 
 * @param {Firestore} db - a reference to cloud firestore
 * @param {query} query  
 */
export async function getAllPosts (db, query) { 

}

/**
 * Get data for a specific user from the DB. 
 * @param {Firestore} db - a reference to cloud firestore
 * @param {number} userID 
 */
export async function getUserData (db, userID) { 
    // a reference to the userID document 
    const userDoc = doc(db, 'users' + userID.toString()); 
    return userDoc; 
}

/**
 * Get all posts associated with a given user in ascending order sorted by postID
 * @param {Firestore} db - a reference to cloud firestore 
 * @param {number} userID 
 */
export async function getAllPostsForUser (db, userID) { 

}

/**
 * Get a specific post from the DB. 
 * @param {Firestore} db - a reference to firestore 
 * @param {number} postID 
 */
export async function getPost (postID) { 
    const postDoc = doc(db, 'posts' + postID.toString()); 
    return postDoc;
}

/**
 * Add a newly created user and their data to the users collection 
 * @param {Firestore} db - a reference to firestore 
 * @param {Array} data 
 */
export async function createUser (db) { 
    const userRef = db.collection('users').doc('user2');
    // we do not have to set these to null if they are not there (thanks NoSQL)
    // once we get actual user data, edit these fields according the actual data in 
    // the data array 
    await userRef.set({
        firstName: 'Testy',
        lastName: 'McTesterton Jr.',
        username: 'testUsername1', 
        password: 'superSecretPassword', 
        email: 'test@macalester.edu', 
        userID: 2
    });
}

/**
 * Add a newly created post and its data to the posts collection 
 * @param {Array} data 
 */
export async function createPost (data) { 

}

