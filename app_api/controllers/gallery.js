var mongoose = require('mongoose');
var Gal = mongoose.model('galleriesModel');

module.exports.galleryListByDate = function(req,res) {
    Gal
        .find()
        .sort({"publicationDate":-1})
        .select('-images')
        .exec(function(err,entries){
            if(err){
                sendJsonResponse(res, 404, err);
                return;
            }
            sendJsonResponse(res,200,entries);
        });
};


module.exports.entryCreate = function(req,res) {
    var Images = req.body.images.split(',');
    var imageResult=[];
    for (image in Images) {
        imageResult.push({filename:Images[image]});
    }
    dataToSave = {
        slug: req.body.slug,
        title: req.body.title,
        subtitle: req.body.subtitle,
        level: req.body.level,
        system: req.body.system,
        genre: req.body.genre,
        mainImage: {filename: req.body.mainImage},
        images: imageResult
    };
    Gal.create(dataToSave, function(err,entry){
        if (err) {
            sendJsonResponse(res, 400, err);
        } else {
            sendJsonResponse(res,201,entry);
        }

    });
};
module.exports.entryReadOne = function(req,res) {
    if (req.params && req.params.slug) {
        Gal
            .findOne({"slug":req.params.slug})
            .exec(function (err, entry) {
                if(!entry){
                    sendJsonResponse(res, 404, {"message":"entry not found"});
                    return;
                } else if (err) {
                    sendJsonResponse (res, 404, err);
                    return;
                }
                sendJsonResponse(res, 200, entry);
            });
    } else {
        sendJsonResponse (res,404,{"message":"No entry parameter in request"});
    }
};
module.exports.entryUpdateOne = function(req,res) {
    if (req.params && req.params.slug) {
        Gal
            .findOne({"slug":req.params.slug})
            .select ('-images -publicationDate')
            .exec(
                function(err,entry) {
                    if (!entry) {
                        sendJsonResponse(res, 404, {"message": "entry not found"});
                        return;
                    } else if (err) {
                        sendJsonResponse(res, 404, err);
                        return;
                    }
                    entry.slug = req.body.slug;
                    entry.title = req.body.title;
                    entry.subtitle = req.body.subtitle;
                    entry.level = req.body.level;
                    entry.system = req.body.system;
                    entry.genre = req.body.genre;
                    entry.mainImage.filename = req.body.mainImageFilename;
                    entry.save(function (err, entry) {
                        if (err) {
                            sendJsonResponse(res,404,err);
                        } else {
                            sendJsonResponse(res,200,entry);
                        }
                    });
                }
            );
    } else {
        sendJsonResponse(res,404,{"message":"slug is required"});
        return;
    }
};

module.exports.entryDeleteOne = function(req,res) {
    if(!req.params.slug){
        sendJsonResponse(res,404,{"message":"Entry not found, slug required"});
        return;
    }
    Gal
        .findOneAndRemove({slug:req.params.slug},function(err,entry){
            if (!entry) {
                sendJsonResponse(res,404,{"message":"entry not found"});
                return;
            } else if (err) {
                sendJsonResponse(res,400,err);
                return;
            }
            sendJsonResponse(res,200,entry);
        });
};
module.exports.mainImageRead = function(req,res) {
    if (req.params && req.params.slug) {
    Gal
        .findOne({"slug":req.params.slug})
        .select('mainImage')
        .exec(function (err, entry) {
            if(!entry){
                sendJsonResponse(res, 404, {"message":"entry not found"});
                return;
            } else if (err) {
                sendJsonResponse (res, 404, err);
                return;
            }
            sendJsonResponse(res, 200, entry);
        });
    } else {
        sendJsonResponse (res,404,{"message":"No entry parameter in request"});
    }
};
module.exports.readAllImages = function(req,res) {
    if (req.params && req.params.slug) {
    Gal
        .findOne({"slug":req.params.slug})
        .select('images')
        .exec(function (err, entry) {
            if(!entry){
                sendJsonResponse(res, 404, {"message":"entry not found"});
                return;
            } else if (err) {
                sendJsonResponse (res, 404, err);
                return;
            }
            sendJsonResponse(res, 200, entry);
        });
    } else {
        sendJsonResponse (res,404,{"message":"No entry parameter in request"});
    }
};

module.exports.imageAddToEntry = function(req,res) {
    var entrySlug = req.params.slug;
    if (entrySlug) {
        Gal
            .findOne({slug: entrySlug})
            .select("images")
            .exec(
                function (err,entry){
                    if(err) {
                        sendJsonResponse(res, 400, err);
                    } else {
                        doAddImage(req,res,entry);
                    }
                }
            );
    } else {
        sendJsonResponse(res,404,{"message":"Not found, entry slug required"});
    }
};

module.exports.imageDeleteOne = function(req,res) {
    if(!req.params.slug || !req.params.image){
        sendJsonResponse(res,404,{"message":"Not found, slug and image filename required"});
        return;
    }
    Gal
        .findOne({slug:req.params.slug})
        .select('images')
        .exec(
            function(err,entry){
            if (!entry) {
                sendJsonResponse(res,404,{"message":"entry not found"});
                return;
            } else if (err) {
                sendJsonResponse(res,400,err);
                return;
            }
            if(entry.images && entry.images.length > 0){
                var result = [];
                var deleted = 0;
                for (var i = 0; i<entry.images.length; i++){
                    if(!(entry.images[i].filename===req.params.image)){
                        result.push(entry.images[i]);
                        continue;
                    }
                    deleted++;
                }
                entry.images = result;
                entry.save (function(err,entry){
                    if (err) {
                        sendJsonResponse(res,400,err);
                    } else {
                        sendJsonResponse(res,200,{"message": deleted + " images deleted"})
                    }
                })
            } else {
                sendJsonResponse(res,404, {"message":"no images to delete"});
            }
        });
};




var doAddImage = function(req,res,entry){
    if(!entry) {
        sendJsonResponse(res,404,{
            "message":"Entry not found"
        });
    } else {
        var filenames = req.body.filenames.split(',');
        for (i in filenames){
            entry.images.push({filename:filenames[i]});
        }
        entry.save(function(err,entry){
            if (err) {
                sendJsonResponse(res,400,err);
            } else {
                sendJsonResponse(res,201,filenames);
            }
        });
    }
};




var sendJsonResponse = function(res,status,content) {
    res.status(status);
    res.json(content);
};

