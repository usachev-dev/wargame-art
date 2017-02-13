var request = require ('request');
var moment = require('moment');
var Storage, storage, bucket;

var apiOptions;
apiOptions = {
    server: "http://localhost:3000"
};
if (process.env.NODE_ENV === 'production'){
    apiOptions.server = "https://wargame-art.herokuapp.com";
}


module.exports.newEntrySubmit = function(req,res) {
    /* console.log(req.body);
     console.log(req.files.mainImage.length);*/
    console.log(req.files.mainImage[0].originalname);
    /* console.log(Storage);
     console.log(bucket);*/
    var path, requestOptions, newSlug, postData;
    newSlug = req.body.slug;
    path = '/api/gallery';
    postData = {
        slug: req.body.slug,
        title: req.body.title,
        subtitle: req.body.subtitle,
        level: req.body.level,
        system: req.body.system.system,
        genre: req.body.system.genre,
        mainImage: "placeholder filename for mainImage",
        images: "placeholder filename for image 1,placeholder filename for image 2"
    };
    requestOptions = {
        url: apiOptions.server + path,
        method: "POST",
        json: postData
    };
    request(requestOptions, function (err, response, body) {
        if (response.statusCode === 201) {
            res.redirect('/gallery/' + newSlug)
        } else {
            _showError(req, res, response.statusCode);
        }
    });
}



var renderNewEntryForm = function(req,res,responseBody){
    res.render('newEntry',{
        title: 'Enter new gallery Entry',
        systems: responseBody
    });
};

module.exports.newEntryForm = function (req,res){
    var requestOptions;
    var path;
    path='/api/systems';
    requestOptions = {
        url:apiOptions.server + path,
        method: "GET",
        json: {}
    };
    request(requestOptions, function(err,response,body){
        if (response.statusCode === 200 && body){
            renderNewEntryForm(req,res,body);
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



