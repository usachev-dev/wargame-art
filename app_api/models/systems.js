var mongoose = require ('mongoose');
var systemsSchema = new mongoose.Schema({
    name: {type:String, required:true, unique:true},
});
mongoose.model('systemsModel', systemsSchema,'systems');
