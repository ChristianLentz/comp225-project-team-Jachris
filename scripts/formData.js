/**
 * This file contains a number of scripts which extract data from HTML forms 
 * and format them so that they may be added to the db. 
 * 
 * These functions are used in index.js
 * 
 * Helpful links for working with the form-data node module: 
 * 
 * https://developer.mozilla.org/en-US/docs/Web/API/FormData
 * https://www.npmjs.com/package/form-data
 * 
 * In order to use the form-data node module, you must run the following in the 
 * terminal: $npm i form-data --save 
 */

// import the form-data node module for getting data from HTML forms 
const FormData = require('form-data');

/**
 * Get data from the login form using form-data node module. 
 */
export async function getLoginFormData() { 
    
}

/**
 * Get data from the create user form using form-data node module. 
 */
export async function getCreateUserFormData() { 

}

/**
 * Format the new user data in preparation to be sent to the db. 
 * Each user should have the following data: 
 * 
 * - firstName: string 
 * - lastName: string
 * - username: string
 * - password: string 
 * - email: string 
 * - userID: an integer > 0
 */
function formatNewUserData(userFormData) { 

}

/**
 * Get data from the new post form using form-data node module. 
 */
export async function getPostFormData() { 
    let postFormData;
    // wait for page to load 
    window.onload = function() { 
        // get the post form as an HTMLFormElement
        const newPostForm = document.forms.namedItem("post-form");
        // ensure form was found and continue
        if (newPostForm) { 
          // add event listener to get the form data on submit 
          let postFormOutput;  
          newPostForm.addEventListener("submit", (event) => {
            // prevent page from reloading and losing form data on submit 
            event.preventDefault();
            // create FormData object 
            postFormOutput = document.querySelector("#post-form-output");
            postFormData = new FormData(newPostForm); 
            for (const [key, value] of postFormData) { 
              console.log(`key-value pair: (${key}, ${value})`); 
            }
          });
        }
    } 
    // return formatNewPostData(postFormData); 
}

/**
 * Format the new post data in preparation to be sent to the db. 
 * Each post should have the following data:
 *  
 * - title: string 
 * - price: real number > 0 (will default to zero if sell is false)
 * - description: string  
 * - postID: an integer > 0
 * - postedBy: an integer > 0 corresponding to the user who posted 
 * - datePosted: a string in the format mm/dd/yyyy
 * 
 * @param {FormData} postFormData 
 */
function formatNewPostData(postFormData) {  
    let formattedPostFormData = { }; 
    return formattedPostFormData; 
}