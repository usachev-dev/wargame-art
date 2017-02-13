var request = require ('request');
var moment = require('moment');
var apiOptions;
apiOptions = {
    server: "http://localhost:3000"
};
if (process.env.NODE_ENV === 'production'){
    apiOptions.server = "https://wargame-art.herokuapp.com";
}

var renderGallery = function (req,res,responseBody){
    var message;
    if (!(responseBody instanceof Array)) {
        message = "API lookup error";
        responseBody = [];
    } else {
        if (!responseBody.length) {
            message = "No galleries to display";
        }
    }
    res.render('gallery', {
        title:'Wargame Art Gallery',
        pageHeader: {
            title:'Our painted miniatures',
            strapline: 'all of them in a gallery'
        },
        galleries:  responseBody,
        message: message
    });
};

var renderEntry = function (req,res,responseBody){
    var message;
    var description;
    var dateMoment;
    dateMoment = null;
    description = "";
    if (!responseBody) { message = "No images to display" }
    if (responseBody.description) {description = responseBody.description}
    if (responseBody.publicationDate) {
        dateMoment = moment(responseBody.publicationDate).format('DD-MM-YYYY');

    }
    res.render('entry', {
        message: message,
        title: responseBody.title,
        subtitle: responseBody.subtitle,
        system: responseBody.system,
        genre: responseBody.genre,
        level: responseBody.level,
        publicationDate: dateMoment,
        mainImage: responseBody.mainImage,
        images: responseBody.images,
        description: description
    });

};



module.exports.entry = function (req,res){
    var slug;
    var path;
    var requestOptions;
    slug = req.params.slug;
    path = '/api/gallery/'+slug;
    requestOptions = {
        url: apiOptions.server + path,
        method: "GET",
        json: {}
    };
    request(requestOptions, function (err, response, body){
        if (response.statusCode === 200 && body){
            renderEntry(req,res,body);
        } else {
            _showError(req,res,response.statusCode);
        }
    });
};

module.exports.gallery = function (req,res){
    var requestOptions;
    var path;
    path = '/api/gallery';
    requestOptions = {
        url: apiOptions.server + path,
        method: "GET",
        json: {}
    };
    request(requestOptions, function (err,response,body){
        if (response.statusCode === 200 && body) {
            renderGallery(req, res, body);
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
}






