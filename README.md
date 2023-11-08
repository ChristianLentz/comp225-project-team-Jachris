# Mac Buy-Back
## Authors: Christian Lentz, Jacob Hellenbrand, Jake Murakami 
## Comp 225 Fall 2023

### What is this project? ###
Mac Buy-Back resembles a virtual Mac Free-Swap. This website is an online and easily accessible space for any member of the Macalester community to buy, sell, trade or donate used items. The ultimate goal is to connect members of the Macalester community with each other and with the Mac Free-Swap, creating a sense of community while reducing the potential for waste on campus. In addition, students will be able to find the necesities that they need to live at little to no cost. 

### Getting Started 
If you want to get started with running this application on your local machine, follow these step:

- Download nodeJS and npm on your local machine. This is a crucial step. You can do this here: https://nodejs.org/en/download
- Clone this repository from remote. You can do this by opening with Github Desktop, downloading the zipped folder directly to your machine, or using **git clone**.
- Open the project and navigate to the root directory in your terminal of choice.
- Install the following packages by running the following in the terminal: 

  - **npm i --g serve** --> allows you to host locally, just use **npm serve [directory]** to do this 
  - **npm i firebase** and **npm -g install firebase-tools** --> allows you to use the Firebase tools that run the project.
  - **npm install webpack webpack-cli** --> allows you to use the Webpack moduler bundler which compiles our Java Script code.
  - **node_modules/.bin/webpack** --> this is how we tell our project to use Webpack.
  - **npm i express --save** --> allows you to use express JS, which we use for routing.
  - **npm i form-data --save** --> allows you to use the form-data node module, which is useful for collectiong user data from an HTML from  
 
If at anytime you get authentication errors in the terminal when trying to install these packages (which may happen with Mac iOS) you should remove node_modules from your local repository and redo the previous steps using **sudo npm ...** for each command line prompt. You are now ready to go! 

### Using Webpack 

We use the Webpack CLI to compile and bundle our Java Script code into an output at scripts/dist/bundle.js, which removes unused code and makes production instances of the website much more efficient. When using Webpack for this project, you must run the build script **npm run build** everytime that you make a change to a Java Script file. This puts your changes into bundle.js, which is what we use to build the project. If you cannot run the build script after making changes, then you have an error somewhere! Also note that the first time that you run the project on your machine, you must run the build script to crete a copy of bundle.js on your local repository.  

### How do I host locally? 

This is the final (and simplest) step of the process. Open your terminal of choice and navigate to the root directory of this project. In the terminal run **serve** or **npm serve**. Using **serve** without specifying a directory to serve will sereve the root directory of the project. This is what we want, since *index.html* (the html file for the homepage of our website) is located in our root directory. Follow the link provided in the terminal, you are now looking at a local instance of the webiste!

### Current Issues/Bugs

- Accessibility Issues with html elements

### TODOs for MVP

- Beutify/comment code
- Login page is deprecated now that user auth is in place
- Routing
- Storing images in Firestore
- Backend for user account page
- Displaying images on the front end (home page and user account)

### Features after MVP 

- Add tags to user posts
- Filter for posts on the home page according to tags
- Allow users to search for other users
- Allow users to delete their posts (this will require us to update the ID assignment for posts) 
