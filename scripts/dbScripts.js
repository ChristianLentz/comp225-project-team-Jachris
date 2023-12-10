/**
 * This file contains our database scripts. 
 * 
 * Any function in our project that reads or writes to the database, or helps 
 * format data at any point in that process is included in this file. 
 * 
 * Our database is built using the Firebase feature Cloud Firestore, using NoSQL.
 * 
 * Our database will contain three collections: metrics, users and posts. 
 * 
 * Each document within the users/posts collections will represent one user or one post. 
 * The naming convention for each document will be userX or postX, where X is a positive 
 * integer representing the order in which the post/user was added to the site. For
 * example, user137 created their account and was added to the DB before user138. 
 * 
 * Each user will have the following items within its document: 
 * 
 *      - user_email: string
 *      - userID: an integer > 0
 *      - user_title: string
 *      - user_name: a string with the user's first and last name
 *      - profile_pic: string, name of defualt profile image selected
 *      - isNew: boolean to determine if user has recently created their account
 *      - storage_ref: string, reference to user's bucket in firebase storage
 * 
 * Each post will have the following items within its document:
 * 
 *      - post_title: string 
 *      - post_price: real number > 0 (will default to zero if sell is false)
 *      - post_msg: a string with a description of the post
 *      - date_posted: a string in the format mm/dd/yyyy
 *      - user_name: a string coresponding to the user who who posted
 *      - user_email: a string corresponding to email of the user who posted
 *      - post_userID: an integer > 0 corresponding to the user who posted 
 *      - postID: an integer > 0
 *      - category: string, used to categorize the post
 *      - post_img: string, the name of the image file for that post
 * 
 * Similar to users, the postID will be generated by us upon creation of the post.
 * 
 * The metrics collection counts the total number of users and posts currently 
 * contained within the database. It also counts the total number of posts that 
 * have even been made on the site, which we use to assign unique ID numbers to 
 * each new post. 
 */

// ============================ Imports ============================

import {
    collection,
    doc,
    setDoc,
    getDoc,
    where,
    getDocs,
    query,
    deleteDoc,
    limit,
    QuerySnapshot
} from "firebase/firestore";

import { 
    getStorage, 
    ref, 
    uploadBytes, 
    getDownloadURL, 
    deleteObject, 
} from "firebase/storage";

// ============================ Scripts ============================

/**
 * Query for a set of posts according to the filters which the user selects on the 
 * home page. 
 * 
 * @param {Firestore} db a reference to cloud firestore.
 * @param {String} filter the filters selected by the user.
 * @param {Number} lim a number to limit results returned by the query. 
 * 
 * @returns an array of posts as the objects retrieved from firestore, or null.
 */
export async function queryForPostsByFilter(db, filter, lim) {

    let postQuery = null;
    // if no filters selected, query posts with no constraint other than limit = lim
    if (filter == null) {
        postQuery = query(
            collection(db, "posts"),
            limit(lim),
        );
    }
    // else, query by provided filter with limit = lim 
    else {
        const queryMap = { key: "category", value: filter }
        postQuery = query(
            collection(db, "posts"),
            where("5", "==", queryMap),
            limit(lim),
        );
    }
    // get the posts from the query and return the data 
    const postSnapshot = await getDocs(postQuery);
    return await unwrapPostQuery(postSnapshot);
}

/**
 * Get the data for a user which is associated with a given id. 
 * 
 * @param {Firestore} db a reference to firestore. 
 * @param {Number} id the id of a user in the database. 
 * 
 * @returns the array of data for a given user, or throws an error.
 */
export async function getUserData(db, id) {

    const docRef = doc(db, 'users/user' + id.toString());
    return await getAllDocumentDataByRef(docRef);
}

/**
 * Get all of the posts associated with a given user. 
 * 
 * @param {Firestore} db a reference to firestore. 
 * @param {Number} email the id of a user in the database.
 * 
 * @returns an array of posts as the objects collected from firestore, or null. 
 */
export async function getUserPosts(db, id) {

    const queryMap = { key: "post_userID", value: id }
    const postQuery = query(
        collection(db, "posts"),
        where("8", "==", queryMap),
    );
    const postSnapshot = await getDocs(postQuery);
    return await unwrapPostQuery(postSnapshot);
}

/**
 * Add a newly created user and their data to the users collection.
 * 
 * @param {Firestore} db a reference to firestore.
 * @param {String} email the email associated with the user we are creating.  
 */
export async function createUser(db, email) {

    // generate a new userID
    const numUsers = await getValueOfFieldByPath(db, 'metrics/totals', "total_users", 0);
    const newUserID = numUsers + 1;
    // generate image storage bucket for user 
    const bucketName = 'user' + newUserID.toString();
    // create user data object 
    const userData = {
        user_email: email,
        userID: newUserID,
        isNew: true,
        storage_ref: bucketName,
    }
    // generate refernce to user doc, write to doc
    const userRef = doc(db, 'users/user' + newUserID.toString());
    await setDocByRef(userRef, userData);
    // increment the number of users 
    const totalsRef = doc(db, 'metrics/totals');
    await setDocByRef(totalsRef, { total_users: numUsers + 1 });
}

/**
 * Add a newly created post and its data to the posts collection
 * 
 * @param {Firestore} db a reference to firestore.
 * @param {Array} data post data to be added to the db.
 */
export async function createPost(db, data) {

    // generate an ID for the post 
    const num = await getValueOfFieldByPath(db, 'metrics/totals', "all_time_posts", 0);
    const newPostID = num + 1;
    data.push({ key: "postID", value: newPostID });
    // cast data array to object, generate refernce to user doc, write to doc 
    const dataObj = Object.assign({}, data);
    const postRef = doc(db, 'posts/post' + newPostID.toString());
    await setDocByRef(postRef, dataObj);
    // increment the number of posts  
    const numPosts = await getValueOfFieldByPath(db, 'metrics/totals', "total_posts", 0);
    const totalsRef = doc(db, 'metrics/totals');
    await setDocByRef(totalsRef, { all_time_posts: newPostID });
    await setDocByRef(totalsRef, { total_posts: numPosts + 1 });
}

/**
 * Delete the post data associated with the provided postID. This 
 * entails deleting the post's collection from the database and 
 * deleting the associated image in firebase storage. 
 * 
 * @param {Firestore} db a reference to firestore.
 * @param {Storage} store a reference to storage. 
 * @param {Number} postID the ID associated with the post to delete.
 * @param {String} imagePath a path to an image in firebase storage.
 */
export async function deletePost(db, store, postID, imagePath) {

    // get number of posts
    const numPosts = await getValueOfFieldByPath(db, 'metrics/totals', "total_posts", 0);
    if (numPosts > 0) {
        // delete document from db
        const postDocRef = doc(db, 'posts/post' + postID.toString());
        await deleteDocByRef(postDocRef);
        // delete image from storage
        const imageRef = ref(store, imagePath);
        deleteObject(imageRef);
        // decrement post total
        const totalsRef = doc(db, 'metrics/totals');
        await setDocByRef(totalsRef, { total_posts: numPosts - 1 });
    }
}

// ============================ Helper Functions ============================

/**
 * Set/update the data for a document given a reference to it. 
 * 
 * @param {any[]} data data to set
 * @param {DocumentSnapshot<DocumentData, DocumentData>} docRef reference to document
 */
export async function setDocByRef(docRef, data) {

    await setDoc(docRef, data, { merge: true })
        .then(() => {
            console.log(`document '${docRef.id}' has been added/updated in database`);
        })
        .catch((error) => {
            console.log(`Error when adding/editing document '${docRef.id}': '${error}'`);
        });
}

/**
 * Delete a document from the database given a refernce to it. 
 * 
 * @param {DocumentSnapshot<DocumentData, DocumentData>} docRef reference to document
 */
async function deleteDocByRef(docRef) {

    await deleteDoc(docRef)
        .then(() => {
            console.log(`document '${docRef.id}' has been deleted from database`);
        })
        .catch((error) => {
            console.log(`Error when delete document '${docRef.id}': '${error}'`);
        });
}

/**
 * Unwrap a query snapshot from the post database. This is used in both 
 * queryForPostsByfilter and getUserPosts. 
 * 
 * @param {QuerySnapshot} postSnapshot 
 * 
 * @returns An array of posts as the object retrieved from firestore, or null. 
 */
async function unwrapPostQuery(postSnapshot) {

    let posts = [];
    if (postSnapshot.empty) {
        // no posts found for the given query 
        return null;
    } else {
        const len = postSnapshot.docs.length;
        for (let i = 0; i < len; i++) {
            // get the object stored in Firestore
            const docRef = postSnapshot.docs.at(i).ref;
            const newDataOb = await getAllDocumentDataByRef(docRef);
            // add to the array to return
            posts.push(newDataOb);
        }
        return posts;
    }
}

/**
 * Get the value for a given field within a Firestore document. Create the field 
 * with a default value if that field does not yes exist. 
 * 
 * @param {Firestore} db a reference to Firestore
 * @param {String} pathToDoc path to a document in firestore
 * @param {String} field the field whose value we want to get 
 * @param {*} default default value for that field 
 * 
 * @returns field value or the default that was set.
 */
export async function getValueOfFieldByPath(db, pathToDoc, field, defaultVal) {

    const docRef = doc(db, pathToDoc);
    const docSnapshot = getDoc(docRef);
    if ((await docSnapshot).exists) {
        return (await docSnapshot).get(field);
    } else {
        return await defaultVal;
    }
}

/**
 * Get all data stored within a given document in Firestore. Note that the data 
 * from Firestore is stored as an object. In our case, the object has an underlying 
 * array. 
 * 
 * Firestore will return document data as 'undefined' if the document DNE.
 *
 * @param {DocumentReference<DocumentData, DocumentData>} docRef reference to a document in firestore.
 * 
 * @returns A data object from firestore, or an error if the document DNE. 
 */
async function getAllDocumentDataByRef(docRef) {

    const docData = getDoc(docRef);
    if ((await docData).data() == undefined) {
        throw new Error(`Error when getting document data: document ${docRef.id} does not exist`);
    } else {
        return (await docData).data();
    }
}

/**
 * Firebase will only allow us to insert data wrapped in an Object. 
 * 
 * For example, in createPost and createUser, before we send anything to the database, 
 * we call Object.assign({}, data) to wrap the data in an array object. 
 * 
 * This helper function 'unwraps' that object, and converts and object with underlying 
 * to an just an array, which is easier to work with. 
 * 
 * To do this, we need to know the length of the underlying array! 
 * 
 * @param {any[]} object an object with underlying array.
 * @param {Number} len length of the array which is wrapped in the object. 
 * 
 * @returns an array of key value pairs.
 */
export function convertDataFromObjToArray(object, len) {

    const objAsArr = [];
    for (let j = 0; j < len; j++) {
        objAsArr.push({ key: object[j].key, value: object[j].value })
    }
    return objAsArr;
}

/**
 * Get a userID by their provided email.
 * 
 * This helper function is used a number of times in backendScripts.js
 * 
 * @param {Firestore} db a reference to Firestore.
 * @param {String} email an email provided by the user.
 * 
 * @returns a number, or null if no user is found by provided email. 
 */
export async function getUserIDByEmail(db, email) {

    // query for user with the provided email (this should be unique!)
    const userQuery = query(
        collection(db, "users"),
        where('user_email', '==', email),
        limit(1),);
    // get the user's ID 
    const userQuerySnap = await getDocs(userQuery);
    if (userQuerySnap.empty) {
        // no user with that email was found  
        return null;
    }
    else {
        // existing user with that email was found 
        let user = await getDoc(userQuerySnap.docs.at(0).ref);
        return user.data()['userID'];
    }
}

/**
 * Set the user's isNew status to false once we have initialized their profile. 
 * 
 * @param {Firestore} db 
 * @param {String} pathToDoc 
 */
export async function updateUserStatus(db, pathToDoc) {

    const userRef = doc(db, pathToDoc);
    await setDoc(userRef, { isNew: false }, { merge: true });
}

/**
 * Get data from an HTMLFormElement and construct a dictionary to hold the data.
 * Handles both the new post and login forms.
 * 
 * Helpful links for using form-data node module: 
 * - https://developer.mozilla.org/en-US/docs/Web/API/FormData
 * - https://www.npmjs.com/package/form-data
 * 
 * In order to use the form-data node module, you must run the following in the 
 * terminal: $npm i form-data --save
 * 
 * @param {String} formName the HTML name attribute of a form. 
 * 
 * @returns An array/dictionary of data extracted from an HTML form placed in 
 * (key, value) pairs. 
 */
export async function getFormData(formName, store, userID) {

    const formDataArr = [];
    const newForm = document.forms.namedItem(formName);
    // if form not null, create data dictionary 
    if (newForm) {
        let formData = new FormData(newForm);
        for (const [newKey, newValue] of formData) {
            if (newKey == "post_img") {
                // add the name of the image to the db collection for the post
                formDataArr.push({ key: newKey, value: newValue.name });
                // add a date posted to the image
                const datePosted = getTodayDate();
                formDataArr.push({ key: "date_posted", value: datePosted });
                // upload the image to firebase storage 
                // directory is userID/datetime/fileName
                const newImageRef = ref(store, 'user' + userID.toString() + '/' + datePosted + '/' + (newValue.name));
                uploadBytes(newImageRef, newValue).then( () => {
                    console.log(`'${newValue.name}' file upload success'`);
                }).catch((error) => {
                    console.error(`error when upload file '${newValue.name}':`, error);
                })
            }
            // handle other HTML elements
            else {
                formDataArr.push({ key: newKey, value: newValue });
            }
        }
    }
    return formDataArr;
}

/**
 * Get the URL of the image from firbease storage 
 * 
 * @param {String} imagePath string of userID/image name 
 * 
 * @returns URL of image path inside of firbase storage
 */
export async function getImageURL(imagePath) {
    const storage = getStorage();
    const imageRef = ref(storage, imagePath);
    try {
        // Get the download URL of the image
        const url = await getDownloadURL(imageRef);
        // return the download URL
        return url;
    } catch (error) {
        console.error(`Error getting download URL for image ${imagePath}: `, error);
        throw error; 
    }
}

/**
 * Get the current date and time. 
 * 
 * @returns date/time as a string in mm/dd/yyyy format. 
 */
function getTodayDate() {

    const date = new Date();
    const today = (date.getMonth() + 1) + "-" + date.getDate() + "-" + date.getFullYear();
    const time = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
    return today + '@' + time 
}