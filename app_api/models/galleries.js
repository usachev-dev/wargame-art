var mongoose = require ('mongoose');

var imageSchema = new mongoose.Schema({
    filename: {type:String, required:true},
    alt: String,
    _id: false
});

var entriesSchema = new mongoose.Schema({
    slug: {type: String, required: true, unique:true},
    publicationDate: { type: Date, required: true, default: Date.now },
    title: {type: String, required: true},
    subtitle: String,
    level: {type: Number, "default":2, min: 0, max: 3},
    system: String,
    genre: String,
    mainImage: {type:imageSchema, required:true},
    images:[imageSchema]
});

var systemsSchema = new mongoose.Schema({
    system: {type:String, required:true, unique:true},
    genre: String
});

mongoose.model('galleriesModel', entriesSchema,'galleries');
mongoose.model('systemsModel', systemsSchema,'systems');
