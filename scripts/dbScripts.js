/**
 * This file contains our database scripts. 
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
 *      - profile picture
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
 *      - image(s)
 * 
 * Similar to users, the postID will be generated by us upon creation of the post. 
 *
 * More items will be added as we move past the minimum viable product phase and 
 * implement more features. These may include: 
 * 
 *      - A sub-collection for each user to define their tags/prefs
 *      - A sub-collection for each post to define the tags given to it by the poster
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
    limit
} from "firebase/firestore";

// ============================ Scripts ============================

/**
 * Query for a set of posts according to the filters which the user selects on the 
 * home page. 
 * 
 * @param {Firestore} db a reference to cloud firestore
 * @param {Array} filters the filters selected by the user
 * @param {Number} lim a number to limit results returned by the query 
 */
export async function queryForPostsByFilter (db, filters, lim) { 
    let posts = []; 
    let postQuery = null; 

    // if no filters selected, grab posts with no constraint other than limit = lim
    if (filters.length == 0) { 
        postQuery = query( 
            collection(db, "posts"), 
            limit(lim), 
        );
    } 

    // else, query by filters with limit = lim 
    else { 

        // THIS IS AFTER MVP PHASE!

    }

    // get the posts from the query and return the data 
    const postSnapshot = await getDocs(postQuery);
    if (postSnapshot.empty) { 
        throw new Error("No posts found with given query!");
    } else { 
        const len = postSnapshot.docs.length;
        for (let i = 0; i < len; i++) { 
            // get the object stored in Firestore
            const docRef = postSnapshot.docs.at(i).ref;
            const newDataOb = await getAllDocumentDataByRef(docRef);
            // add to the array to return
            posts.push(newDataOb);  
        }
    }
    return posts; 
}

/**
 * Get data for a specific user from the DB. 
 * 
 * @param {Firestore} db a reference to cloud firestore
 * @param {Number} userID an ID corresponding to the user whose data we are getting 
 */
export async function getUserData (db, userID) { 
    pathToDoc = 'users/user' + userID.toString(); 
    const docRef = doc(db, pathToDoc);
    return await getAllDocumentDataByRef(docRef);
}

/**
 * Get data for a specific post from the DB. 
 * 
 * @param {Firestore} db a reference to firestore 
 * @param {Number} postID an ID corresponding to the post data we are getting 
 */
export async function getPostData (db, postID) {
    const pathToDoc = 'posts/post' + postID.toString(); 
    const docRef = doc(db, pathToDoc); 
    return await getAllDocumentDataByRef(docRef);
}

/**
 * Add a newly created user and their data to the users collection
 * 
 * THIS NEEDS TO RUN WITH USER AUTH! 
 * 
 * @param {Firestore} db a reference to firestore 
 * @param {Array} data user data to be added to the database
 */
export async function createUser (db, data) { 

    // generate a new userID 
    // FIX THIS, should not be based on totals, this will not guarantee that IDs are unique if we allow deletion!! 
    // (after MVP phase)
    const numUsers = await getValueOfFieldByPath(db, 'metrics/totals', "total_users", 0);
    const newUserID = numUsers + 1; 
    data.push({key: "userID", value: newUserID});

    // cast data array to object, generate refernce to user doc, write to doc
    const dataObj = Object.assign({}, data);
    const userRef = doc(db, 'users/user' + newUserID.toString());
    await setDoc(userRef, dataObj)
        .then(() => { 
            console.log(`user '${userRef.id}' has been added to users collection`); 
        })
        .catch((error) => { 
            console.log(`Error when create user '${userRef.id}': '${error}'`);
        }); 

    // increment the number of users 
    await changeUserTotal(newUserID); 
}

/**
 * Delte the user data associated with the provided userID
 * 
 * THIS NEEDS TO BE TESTED! (after MVP phase)
 * 
 * @param {Firestore} db a reference to firestore
 * @param {Number} userID the ID associated with the user to delete 
 */
export async function deleteUser (db, userID) { 
    // get number of users
    const numUsers = await getValueOfFieldByPath(db, 'metrics/totals', "total_users", 0);
    if (numUsers > 0) { 
        // query for the user to delete
        const userQuery = query( 
            collection(db, "users"), 
            where('userID', '==', userID), 
        ); 
        const userQuerySnap = await getDocs(userQuery);
        let userDocRef = await getDoc(userQuerySnap.docs.at(0).ref);
        // delete the user 
        deleteDoc(userDocRef)
            .then(() => { 
                console.log(`user '${userDocRef.id}' has been deleted from users collection`);
            })
            .catch((error) => { 
                console.log(`Error when delete user '${userDocRef.id}': '${error}'`);
            }); 
        // decrement user total 
        await changeUserTotal(db, numUsers-1);
    } else { 
        throw new Error(`cannot delete user '${userDocRef.id}', there are no users in the database.`); 
    }
}

/**
 * Add a newly created post and its data to the posts collection
 * 
 * @param {Firestore} db a reference to firestore
 * @param {Array} data post data to be added to the db 
 */
export async function createPost (db, data) { 

    // generate an ID for the post
    // FIX THIS, should not be based on totals, this will not guarantee that IDs are unique if we allow deletion!!
    // (after MVP phase)
    const numPosts = await getValueOfFieldByPath(db, 'metrics/totals', "total_posts", 0); 
    const newPostID = numPosts + 1;
    data.push({key: "postID", value: newPostID});
 
    // generate date posted 
    const datePosted = getTodayDate(); 
    data.push({key: "date_posted", value: datePosted}); 
    // cast data array to object, generate refernce to user doc, write to doc 
    const dataObj = Object.assign({}, data);
    const postRef = doc(db, 'posts/post' + newPostID.toString()); 
    await setDoc(postRef, dataObj)
        .then(() => { 
            console.log(`post '${postRef.id}' has been added to posts collection`); 
        })
        .catch((error) => { 
            console.log(`Error when create post '${postRef.id}': '${error}'`);
        }); 
    // increment the number of posts 
    await changePostTotal(db, newPostID); 
}

/**
 * Delte the post data associated with the provided postID
 * 
 * THIS NEEDS TO BE TESTED! (after MVP phase)
 * 
 * @param {Firestore} db a reference to firestore
 * @param {Number} postID the ID associated with the post to delete
 */
export async function deletePost (db, postID) { 
    // get number of posts
    const numPosts = await getValueOfFieldByPath(db, 'metrics/totals', "total_posts", 0);
    if (numPosts > 0) { 
        // query for the post to delete
        const postQuery = query( 
            collection(db, "posts"), 
            where('postID', '==', postID), 
        ); 
        const postQuerySnap = await getDocs(postQuery);
        let postDocRef = await getDoc(postQuerySnap.docs.at(0).ref);
        // delete the post 
        deleteDoc(postDocRef)
            .then(() => { 
                console.log(`post '${postDocRef.id}' has been deleted from posts collection`);
            })
            .catch((error) => { 
                console.log(`Error when delete post '${postDocRef.id}': '${error}'`);
            }); 
        // decrement user total 
        await changePostTotal(db, numPosts-1);
    } else { 
        throw new Error(`cannot delete post '${postDocRef.id}', there are no posts in the database.`); 
    }
}

// ============================ Helper Functions ============================

/**
 * Get the value for a given field within a Firestore document. Create the field 
 * with a default value if that field does not yes exist. 
 * 
 * @param {Firestore} db a reference to Firestore
 * @param {String} pathToDoc path to a document in firestore
 * @param {String} field the field whose value we want to get 
 * @param {*} default default value for that field 
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
 * Get all data stored within a given document in Firestore. 
 * 
 * Firestore will return document data as 'undefined' if the document DNE, 
 * in which case we throw an error. 
 *
 * @param {DocumentReference<DocumentData, DocumentData>} docRef reference to a document in firestore
 */
async function getAllDocumentDataByRef(docRef) { 
    const docData = getDoc(docRef);
    if ( (await docData).data() == undefined) { 
        throw new Error(`Error when getting document data: document ${docRef.id} does not exist` ); 
    } else { 
        return (await docData).data(); 
    }
}

/**
 * Get a userID by their provided email. A helper for the create post function. 
 * 
 * @param {Firestore} db a reference to Firestore
 * @param {String} email an email provided by the user 
 */
export async function getUserIDByEmail(db, email) { 
    // query for user with the provided email (this should be unique!)
    const userQuery = query( 
        collection(db, "users"), 
        where('user_email', '==', email))
    // get the user's userID 
    const userQuerySnap = await getDocs(userQuery);
    console.log(userQuerySnap.size);
    if (userQuerySnap.empty) { 
        // no user with that email is found 
        return null; 
    }
    else { 
        let user = await getDoc(userQuerySnap.docs.at(0).ref);
        return user.data()['userID']; // ERROR IN THIS LINE ?? 
    } 
}

/**
 * Get data from an HTMLFormElement and construct a dictionary to hold the data.
 * 
 * Helpful links for using form-data node module: 
 * - https://developer.mozilla.org/en-US/docs/Web/API/FormData
 * - https://www.npmjs.com/package/form-data
 * 
 * In order to use the form-data node module, you must run the following in the 
 * terminal: $npm i form-data --save
 * 
 * @param {String} formName the HTML name attribute of a form 
 */
export async function getFormData(formName) { 
    const formDataArr = [];   
    // get form as HTMLFormElement using HTML name attribute 
    const newForm = document.forms.namedItem(formName);
    // if form not null, create data dictionary 
    if (newForm) {  
        let formData = new FormData(newForm); 
        for (const [newKey, newValue] of formData) { 
            formDataArr.push({key: newKey, value: newValue}); 
        }
    }
    return formDataArr;
}

/**
 * Log new user created in the metrics collection. 
 * 
 * @param {firestore} db a reference to Firestore
 * @param {Number} count the new number of users to set
 */
async function changeUserTotal(db, count) { 
    const totalsRef = doc(db, 'metrics/totals');
    await setDoc(totalsRef, {total_users: count}, {merge : true})
        .then(() => { 
            console.log(`total users is now: '${count}'`); 
        })
        .catch((error) => { 
            console.log(`Error when incrementing user count: '${error}'`);
        }); 
}

/**
 * Log new pose created in the metrics collection. 
 * 
 * @param {firestore} db a reference to Firestore
 * @param {Number} count the new number of posts to set
 */
async function changePostTotal(db, count) { 
    const totalsRef = doc(db, 'metrics/totals');
    await setDoc(totalsRef, {total_posts: count}, {merge : true})
        .then(() => { 
            console.log(`total posts is now: '${count}'`); 
        })
        .catch((error) => { 
            console.log(`Error when incrementing post count: '${error}'`);
        });
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
 * @param {any[]} object an object with underlying array
 * @param {Number} len length of the array which is wrapped in the object 
 */
export function convertDataFromObjToArray(object, len) { 
    const objAsArr = []; 
    for (let j = 0; j < len; j++) { 
        objAsArr.push({key: object[j].key, value: object[j].value})
    }
    return objAsArr; 
}

/**
 * Get the current date in mm/dd/yyyy format.
 */
function getTodayDate() { 
    const date = new Date();   
    const today = (date.getMonth()+1) + "/" + date.getDate() + "/" + date.getFullYear(); 
    return today; 
}