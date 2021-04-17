const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

const dbURL = require('./config').DBURL;
const dboptions = require('./config').DB_OPTIONS;

//export this function and imported by server.js
module.exports =function(){

    mongoose.connect(dbURL,dboptions);

    mongoose.connection.on('connected', function(){
        console.log("Mongoose default connection is open to ", dbURL);
    });

    mongoose.connection.on('error', function(err){
        console.error("Mongoose default connection has occured "+err+" error");
        process.exit();
    });

   
}