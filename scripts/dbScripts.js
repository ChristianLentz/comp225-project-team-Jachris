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
 *      - username - string
 *      - password - string 
 *      - email - string 
 *      - userID - an integer > 0 
 * 
 * Each post will have the following items within its document:
 * 
 *      - title - string 
 *      - sellOrDonate - boolean
 *      - price - real number > 0
 *      - description - string  
 *      - postID - an integer > 0
 *      - postedBy - an integer > 0 corresponding to the user who posted 
 *      - datePosted - a string in the format mm/dd/yyyy
 *
 * More items will be added as we move past the minimum viable product phase and 
 * implement more features. 
 */

// import firestore functions from firebase library 
import {} from "firebase/firestore"; 

/**
 * Get all users from the DB sorted in ascending order by userID
 */
function getAllUsers () { 

}

/**
 * Get all posts from the DB sorted in ascending order by postID
 */
function getAllPosts () { 

}

/**
 * Get a specific user from the DB
 * @param {*} user 
 */
function getUser (user) { 

}

/**
 * Get all posts associated with a given user in ascending order sorted by postID
 * @param {*} user 
 * 
 */
function getAllPostsForUser (user) { 

}

