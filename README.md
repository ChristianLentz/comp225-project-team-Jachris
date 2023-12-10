# Mac Community Trade Center
## Authors: Christian Lentz, Jacob Hellenbrand, Jake Murakami 
## Comp 225 Fall 2023

### What is this project?
Mac Buy-Back resembles a virtual Mac Free-Swap. This website is an online and easily accessible space for any member of the Macalester community to buy, sell, trade or donate used items. The ultimate goal is to connect members of the Macalester community with each other and with the Mac Free-Swap, creating a sense of community while reducing the potential for waste on campus. In addition, students will be able to find the necesities that they need to live at little to no cost. See our [project proposal](projectProposal.pdf) to understand this project in more detail.

### Getting Started 
The best way to familiarize yourself with our site is to checkout the production instnace [here](https://mac-community-trade-center.web.app/). 

If you want to get started with running this application locally, follow these step:

- Download nodeJS and npm. This is a crucial step. You can do this [here](https://nodejs.org/en/download).
- Clone this repository from remote. You can do this by opening with Github Desktop, downloading the zipped folder directly to your machine, or using **git clone**.
- Open the project and navigate to the root directory in your terminal of choice.
- Install the following packages by running the following in the terminal: 

  - **npm i --g serve** --> allows you to host locally, just use **npm serve [directory]** to do this 
  - **npm i firebase** and **npm -g install firebase-tools** --> allows you to use the Firebase tools that run the project.
  - **npm install webpack webpack-cli** --> allows you to use the Webpack moduler bundler which compiles our Java Script code.
  - **node_modules/.bin/webpack** --> this is how we tell our project to use Webpack.
  - **npm install os-browserify** --> needed to run webpack with the Firebase admin SDK.
  - **npm install path-browserify** --> needed to run webpack with Firebase admin SDK.
  - Note: the two steps above are rather important, as the admin SDK is needed to authenticate users. 
  - **npm i form-data --save** --> allows you to use the form-data node module, which is useful for collectiong user data from an HTML from
 
If at anytime you get authentication errors in the terminal when trying to install these packages (which may happen with Mac iOS) you should remove node_modules from your local repository and redo the previous steps using **sudo npm ...** for each command line prompt. You are now ready to go!

### Using Webpack 

We use the Webpack CLI to compile and bundle our Java Script code into an output at scripts/dist/bundle.js, which removes unused code and makes production instances of the website much more efficient. When using Webpack for this project, you must run the build script **npm run build** everytime that you make a change to a Java Script file. This puts your changes into bundle.js, which is what we use to build the project. If you cannot run the build script after making changes, then you have an error somewhere! Also note that the first time that you run the project on your machine, you must run the build script to crete a copy of bundle.js on your local repository.  

### How do I host locally? 

This is the final (and simplest) step of the process. Open your terminal of choice and navigate to the root directory of this project. In the terminal run **serve** or **npm serve**. Using **serve** without specifying a directory to serve will sereve the root directory of the project. This is what we want, since *index.html* (the html file for the homepage of our website) is located in our root directory. Follow the link provided in the terminal, you are now looking at a local instance of the webiste!

### Development Workflow

This firebase app is configured for automatic deploys upon PR merge. When working on this project as a developer, create a branch from *main*. Once your changes are tested and ready to go, publish as a pull request to be reviewed. Finally, once the PR has been merged into main, the build script automatically runs and puts changes from the PR into production. Although it is possible to deploy directly from the terminal, this is only for those who have admin access to the Firebase project. This workflow allows others to contribute changes to production without requiring admin access. 

### Next Steps and TODOs 

- Google Authentication
- Set rules for firestore and storage
- Update project proposal

### Currnet Bugs

- Autofilling emails on the login form ocassionally does not allow the user to login. However, a simple work around is to write your email manually. 

### Helpful Sources

- Defualt profile images retreived from [here](https://www.freepik.com/search?format=search&query=cartoon%20animal%20profile).
- The [Firebase documentation](https://firebase.google.com/docs?hl=en&authuser=0&_gl=1*1pfdh62*_ga*ODU2OTQzNTM0LjE3MDAwNzY3NTg.*_ga_CW55HF8NVT*MTcwMTI3NTEwOC4yMS4xLjE3MDEyNzY1MzUuNjAuMC4w) describes how to get started with and use Google Firebase. In particular, we use Firestore, Storage and Hosting for this project. Also note that for this project, we are using the Web Modular API, as this is setup for module bundling and *tree shaking*. 
- Support for the programming languages and other tools used in this project: 
  - [JavaScript, W3Schools](https://www.w3schools.com/js/DEFAULT.asp)
  - [HTML, mozilla.org](https://developer.mozilla.org/en-US/docs/Web/HTML)
  - [CSS, mozilla.org](https://developer.mozilla.org/en-US/docs/Web/CSS)
  - [Webpack CLI](https://webpack.js.org/)
  - A brief introduction to [NoSQL](https://www.geeksforgeeks.org/introduction-to-nosql/), since the Firestore database is a NoSQL databse.
- Support for other node modules and tools used: 
  - [form-data](https://www.npmjs.com/package/form-data) for working with HTML form elements 
  - [FileReader objects](https://developer.mozilla.org/en-US/docs/Web/API/FileReader) for reading image files and [File API](https://developer.mozilla.org/en-US/docs/Web/API/File) for creating file objects in JavaScript. These are used in conjunction with Firebase Storage for handling images that users upload for their posts. 
