var mongoose = require('mongoose');
var Genres = mongoose.model('genresModel');


module.exports.getAllGenres = function(req,res){
    Genres
        .find()
        .exec(function(err,systems){
            if(err){
                sendJsonResponse(res,404,err);
                return;
            }
            sendJsonResponse(res,200,systems);
        });
};

var sendJsonResponse = function(res,status,content) {
    res.status(status);
    res.json(content);
};