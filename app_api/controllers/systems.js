var mongoose = require('mongoose');
var Sys = mongoose.model('systemsModel');


module.exports.getAllSystems = function(req,res){
    Sys
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
