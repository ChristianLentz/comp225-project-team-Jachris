/**
 * This file is how we configure the webpack CLI 
 * 
 * We can have this run in development or production mode. Webpack will use a module 
 * bundler which removes unused code from node_modules upon building our website. 
 * 
 * This bundle that we then use to build our website is put into dist/bundle.js
 * 
 * Use 'npm run build' or 'serve dist/' in the terminal to perform all of this, as 
 * these are currently configured to do this! Check package.json or index.html
 * 
 * Note that 'npm run build' will update bundle.js everytime we use 'npm run build'. This
 * puts our changes into production and tests them
 * 
 * Note that, in general, the main.js and bundle.js that we get from webpack is 
 * typically unreadable
 */

const path = require('path'); 

module.exports = {
    // pick a mode for webpack to run 
    mode: 'development', 
    // makes code more readable (and thus easier to debug) in the dev console 
    devtool: 'eval-source-map',
    // entry point for webpack, this is where we start the build process 
    entry: './src/index.js',
    // output file, this is where the bundled code is sent
    output: { 
        path: path.resolve(__dirname, 'dist'), 
        filename: 'bundle.js'
    }
};

/**
 * TODO: set up webpack to run in production or development mode
 * 
 * Prodcution mode will be best for when the website is actually live. 
 * 
 * Right now we have webpack configured to run in development. In the future we can 
 * do this by configuring three files: 
 * 
 * - webpack.common.js --> webpack config common to both modes 
 * - webpack.dev.js --> webpack config only for development 
 * - webpack.prod.js --> webpack config only for production 
 * 
 * Refer to https://webpack.js.org/guides/production/
 * 
 * Right now, package.json (our npm setup file) is using 'webpack --mode=development'
 * for a build script (since we have dev mode configured). Later, we will need to 
 * change this simply to 'webpack' and then specify the mode to run when we run the 
 * build script in the terminal. 
 */