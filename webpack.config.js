/**
 * This file is how we configure the webpack CLI 
 * 
 * We can have this run in development or production mode. Webpack will use a module 
 * bundler which removes unused code from node_modules upon building our website. 
 * 
 * This bundle that we then use to build our website is put into scripts/dist/bundle.js
 * 
 * Use $ npm run build in the terminal to compile new code to bundle.js, and then 
 * serve to see the changes locally. $ npm run build will update bundle.js everytime 
 * we use it. This puts our changes into production and tests them
 * 
 * Note that, in general, the main.js and bundle.js that we get from webpack is 
 * typically unreadable, but we can use source maps to get readable code in dev console 
 */

const path = require('path');

module.exports = {
    // pick a mode for webpack to run (CHANGE TO PRODUCTION WHEN DONE!)
    mode: 'development', 
    // makes code more readable (and thus easier to debug) in the dev console 
    devtool: 'eval-source-map',
    // entry point for webpack, this is where we start the build process 
    entry: './scripts/index.js',
    // output file, this is where the bundled code is sent
    output: { 
        path: path.resolve(__dirname, 'scripts/dist'), 
        filename: 'bundle.js',
    },
    // resolve node module erros upon compile
    resolve: {
        fallback: {'path': require.resolve('path-browserify'),
                    "os": require.resolve("os-browserify/browser"), 
                    "querystring": false, 
                    "stream": false, 
                    "https": false, 
                    "http": false, 
                    "crypto": false, 
                    "zlib": false,
                    "fs": false,
                    "tls": false,
                    "net": false, 
                    "child_process": false, 
                    "request": false},
        extensions: ['.jsx', '.js', '.tsx', '.ts'],
     },
};