var mongoose = require ('mongoose');
var genresSchema = new mongoose.Schema({
    name: {type:String, required:true, unique:true},
});
mongoose.model('genresModel', genresSchema,'genres');
