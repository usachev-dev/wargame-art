var mongoose = require('mongoose');
var dbURI = process.env.LOCAL_DB_ENV;

if (process.env.NODE_ENV==='production') {
    dbURI = process.env.PRODUCTION_DB_ENV;
}
mongoose.connect(dbURI);
/*
mongoose.connection.on('connected',function(){
    console.log('Mongoose connected to ' + dbURI);
});
*/
mongoose.connection.on('connected', function (ref) {
    console.log('Mongoose connected to ' + dbURI);
    //trying to get collection names
    mongoose.connection.db.listCollections(function (err, names) {
        console.log('collections'+names); // [{ name: 'dbname.myCollection' }]
    });
});

mongoose.connection.on('error', function(err){
    console.log('Mongoose connection error: ' + err);
});
mongoose.connection.on('disconnected',function(){
    console.log('Mongoose disconnected');
});

var gracefulShutdown = function (msg,callback){
    mongoose.connection(function(){
        console.log('Mongoose disconnected through ' + msg);
        callback();
    });
};

var readLine = require ("readline");
if (process.platform ==="win32"){
    var rl = readLine.createInterface ({
        input:process.stdin,
        output:process.stdout
    });
    rl.on ("SIGINT",function(){
        process.emit ("SIGINT");
    });
}

process.once('SIGUSR2', function(){
    gracefulShutdown('nodemon restart', function (){
        process.kill(process.pid, 'SIGUSR2');
    });
});
process.on('SIGINT',function(){
    gracefulShutdown('app termination', function(){
        process.exit(0);
    });
});
process.on('SIGTERM', function(){
    gracefulShutdown('Heroku app shutdown', function(){
        process.exit(0);
    });
});

require('./galleries');
require('./systems');
require('./genres');
