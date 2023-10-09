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
 */

// import firestore functions from firebase library 
import { Firestore, doc } from "firebase/firestore"; 

/**
 * Get all users from the db according to the given query. 
 * @param {Firestore} db - reference to cloud firestore
 * @param {query} query 
 */
export function getAllUsers (db) { 

}

/**
 * Get all posts from the db according to the given query. 
 * @param {Firestore} db - a reference to cloud firestore
 * @param {query} query  
 */
export function getAllPosts (db, query) { 

}

/**
 * Get data for a specific user from the DB. 
 * @param {Firestore} db - a reference to cloud firestore
 * @param {number} userID 
 */
export function getUserData (db, userID) { 
    // a reference to the userID document 
    const userDoc = doc(db, 'users' + userID.toString()); 
    return userDoc; 
}

/**
 * Get all posts associated with a given user in ascending order sorted by postID
 * @param {Firestore} db - a reference to cloud firestore 
 * @param {number} userID 
 */
export function getAllPostsForUser (db, userID) { 

}

/**
 * Get a specific post from the DB. 
 * @param {number} postID 
 */
export function getPost (postID) { 
    const postDoc = doc(db, 'posts' + postID.toString()); 
    return postDoc;
}

/**
 * Add a newly created user and their data to the users collection 
 * @param {Array} data 
 */
export function createUser (data) { 

}

/**
 * Add a newly created post and its data to the posts collection 
 * @param {Array} data 
 */
export function createPost (data) { 

}

