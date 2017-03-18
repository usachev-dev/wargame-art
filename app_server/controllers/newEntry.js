var request = require ('request');
var moment = require('moment');
var aws = require('aws-sdk');
var myAwsConfig = new aws.Config({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: 'us-east-1'
});
var BUCKET_NAME = process.env.AWS_S3_BUCKET;
var s3 = new aws.S3();


var apiOptions;
apiOptions = {
    server: "http://localhost:3000"
};
if (process.env.NODE_ENV === 'production'){
    apiOptions.server = "https://wargame-art.herokuapp.com";
}

module.exports.newEntrySubmit = function(req,res) {
    var uploadFile = function (file, remoteFilename) {

        s3.putObject({
            ACL: 'public-read',
            Bucket: BUCKET_NAME,
            Key: 'gallery/'+remoteFilename,
            Body: file.buffer,
            ContentType: file.mimetype,
        },function(error,response){
            if (!error) {
                console.log('uploaded file ' + remoteFilename);
            } else {
                console.log(error);
            }
        });
    };

    var postEntryData = function(req,res) {
        var path, requestOptions, postData;
        path = '/api/gallery';

        postData = {
            slug: req.body.slug,
            title: req.body.title,
            subtitle: req.body.subtitle,
            description: req.body.description,
            level: req.body.level,
            system: req.body.system,
            genre: req.body.genre,
            mainImage: {filename: 'main_'+req.files.mainImage[0].originalname, alt:req.body.system+' '+req.body.slug+' painted photo'},
            images: imagesData
        };
        requestOptions = {
            url: apiOptions.server + path,
            method: "POST",
            json: postData
        };
        request(requestOptions, function (err, response, body) {
            if (response.statusCode === 201) {
                res.redirect('/gallery/' + postData.slug);
            } else {
                _showError(req, res, response.statusCode);
            }
        });
    };

    var imagesData=[];

    uploadFile(req.files.mainImage[0],req.body.slug+'/'+'main_'+req.files.mainImage[0].originalname);
    for (var i in req.files.images){
        imagesData.push({
            filename: req.files.images[i].originalname,
            alt: req.body.system+' '+req.body.slug+' painted photo'
        });
        uploadFile(req.files.images[i],req.body.slug+'/'+req.files.images[i].originalname);

    }
    postEntryData(req,res);

};














module.exports.newEntrySubmitWithCallbacksNotWorking = function(req,res) {
    /* console.log(req.body);
     console.log(req.files.mainImage.length);
    console.log(req.files.mainImage[0].originalname);
     console.log(Storage);
     console.log(bucket);
    var controllerData;
    var uploadFile = function (file, remoteFilename, callback) {

        s3.putObject({
            ACL: 'public-read',
            Bucket: BUCKET_NAME,
            Key: remoteFilename,
            Body: file.buffer,
            ContentType: file.mimetype,
        },function(error,response){
            if (!error) {
                console.log('uploaded file ' + remoteFilename);
                callback();
            } else {
                console.log(error);
            }
        });
    };

    var postEntryData = function(req,res) {
        var path, requestOptions, postData;
        path = '/api/gallery';

        postData = {
            slug: req.body.slug,
            title: req.body.title,
            subtitle: req.body.subtitle,
            description: req.body.description,
            level: req.body.level,
            system: req.body.system.system,
            genre: req.body.system.genre,
            mainImage: 'main_'+req.files.mainImage[0].originalname,
            images: "placeholder filename for image 1,placeholder filename for image 2"
        };
        console.log(postData);
        requestOptions = {
            url: apiOptions.server + path,
            method: "POST",
            json: postData
        };
        request(requestOptions, function (err, response, body) {
            if (response.statusCode === 201) {
                res.redirect('/gallery/' + postData.slug);
            } else {
                _showError(req, res, response.statusCode);
            }
        });
    };
    controllerData = {
        req: req,
        res: res
    };

    var callbackArray=[];

    if (controllerData.req.files.images.length>0){
        //console.log(controllerData.req.files.images);
        var last=1;
        for (var i = controllerData.req.files.images.length-1; i>=0;i--){
            console.log(i);
            console.log(controllerData.req.files.images[i]);
            if (last){
                callbackArray.unshift(
                    ()=>({
                        uploadFile(controllerData.req.files.images[i],controllerData.req.body.slug+'/'+controllerData.req.files.images[i].originalname,
                        ()=>({
                        uploadFile(controllerData.req.files.mainImage[0],controllerData.req.body.slug+'/'+'main_'+controllerData.req.files.mainImage[0].originalname,
                                ()=>({ postEntryData(controllerData.req,controllerData.res) }));
                                }));
                            }));
                last=0;
            } else {
                callbackArray.unshift(()=>{
                    uploadFile(controllerData.req.files.images[i],controllerData.req.body.slug+'/'+controllerData.req.files.images[i].originalname, callbackArray[i+1])
                });
            }
        }
    callbackArray[0]();
    } else {
        uploadFile(req.files.mainImage[0],req.body.slug+'/'+'main_'+req.files.mainImage[0].originalname,postEntryData);
    }
     */

/*
    uploadFile(req.files.mainImage[0],req.body.slug+'/'+'main_'+req.files.mainImage[0].originalname,postEntryData);
        (req,res)=>{
            for (var i in req.files.images ){

        }

    }
*/


};



var renderNewEntryForm = function(req,res,systems,genres){
    res.render('newEntry',{
        title: 'Enter new gallery Entry',
        systems: systems,
        genres: genres
    });
};

module.exports.newEntryForm = function (req,res){
    var requestOptions;
    var path;
    var systems =[];
    var genres = [];
    path='/api/systems';
    requestOptions = {
        url:apiOptions.server + path,
        method: "GET",
        json: {}
    };
    request(requestOptions, function(err,response,body){
        if (response.statusCode === 200 && body){
            systems=body;
            path='/api/genres';
            requestOptions = {
                url:apiOptions.server + path,
                method: "GET",
                json: {}
            };
            request(requestOptions, function(err,response,body) {
                if (response.statusCode === 200 && body) {
                    genres = body;
                    console.log(genres);
                    renderNewEntryForm(req, res, systems, genres);
                } else {
                    _showError(req, res, response.statusCode);
                }
            });
            //renderNewEntryForm(req,res,body);
        } else {
            _showError(req,res,response.statusCode);
        }
    });
};

var _showError = function (req,res, status){
    var title, content;
    if(status === 404){
        title = "404, page not found";
        content = "Looks like there is no such a page. Sorry"
    } else {
        title = status + ", something has gone wrong";
        content = "Something somewhere is wrong"
    }
    res.status(status);
    res.render('api-error',{
        title:title,
        content:content
    });
};



