# Virtual Mac Community Trade Center 
## Authors: Christian Lentz, Jacob Hellenbrand, Jake Murakami 
## Comp 225 Fall 2023

### What is this project? ###

### Getting Started ###
If you want to get started with running this application on your local machine, follow these step:

- Clone the repository from remote. You can do this by opening with Github Desktop, downloading the repository directly to your machine, or using **git clone https://github.com/ChristianLentz/comp225-project-team-Jachris** in the directory that you want to store this project.
- Open the project and navigate to the root directory in your terminal of choice and make sure that you have nodeJS/npm installed.
- Install the following packages by running the following in the terminal: 
  - **npm i --g serve** --> allows you to host locally, just use **npm serve [directory]** to do this 
  - **npm i firebase** to install the Firbase SDK --> allows you to use the Firebase tools that run the project.
  - **npm install webpack webpack-cli** --> allows you to use the Webpack moduler bundler which compiles our Java Script code.
  - **node_modules/.bin/webpack** --> this is how we tell our project to use Webpack.
 
If at anytime you get authentication errors in the terminal when trying to install these packages (which may happen with Mac iOS) you should remove node_modules from your local repository and redo the previous steps using **sudo npm ...** for each command line prompt. You are now ready to go! 

### Using Webpack ###

We use the Webpack CLI to compile and bundle our Java Script code into an output at dist/bundle.js, which removes unused code and makes production instances of the website much more efficient. When using Webpack for development, you must run the build script **npm run build** everytime that you make a change to a Java Script file. This puts your changes into bundle.js, which is what we use to build the project. Note that if you cannot run the build script after making changes, then you have an error somewhere!  
