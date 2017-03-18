var request = require ('request');
var moment = require('moment');
var apiOptions;
apiOptions = {
    server: "http://localhost:3000"
};
if (process.env.NODE_ENV === 'production'){
    apiOptions.server = "https://wargame-art.herokuapp.com";
}

var renderGallery = function (req,res,galleries,systems,genres){
    var message;
    if (!(galleries instanceof Array)) {
        message = "API lookup error";
        responseBody = [];
    } else {
        if (!galleries.length) {
            message = "No galleries to display";
        }
    }
    res.render('gallery', {
        title:'Wargame Art Gallery',
        pageHeader: {
            title:'Our painted miniatures',
            strapline: 'all of them in a gallery'
        },
        galleries:  galleries,
        systems: systems,
        genres: genres,
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
        slug:  responseBody.slug,
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

module.exports.galleryAngular = function(req,res){
    res.render("gallery");
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
    var requestOptions1,requestOptions2, requestOptions3;
    var path1, path2, path3;
    var galleries, systems, genres;
    path1='/api/gallery';
    path2='/api/systems';
    path3='/api/genres';

    requestOptions1 = {
        url: apiOptions.server + path1,
        method: "GET",
        json: {}
    };
    requestOptions2 = {
        url: apiOptions.server + path2,
        method: "GET",
        json: {}
    };
    requestOptions3 = {
        url: apiOptions.server + path3,
        method: "GET",
        json: {}
    };

    var queue = function (){
        request(requestOptions1, function (err,response,body){
            if (response.statusCode === 200 && body) {
                galleries = body;
                request(requestOptions2, function (err,response,body){
                    if (response.statusCode === 200 && body) {
                        systems = body;
                        request(requestOptions3, function (err,response,body){
                            if (response.statusCode === 200 && body) {
                                genres = body;
                                renderGallery(req, res, galleries, systems, genres);
                            } else {
                                _showError(req,res,response.statusCode);
                            }});
                    } else {
                        _showError(req,res,response.statusCode);
                    }});
            } else {
                _showError(req,res,response.statusCode);
            }});
    };

    queue();
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






