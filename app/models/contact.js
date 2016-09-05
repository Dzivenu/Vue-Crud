var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
var Schema = mongoose.Schema;

var ContactSchema = new Schema({
	name: String,
	title: String,
	email: String,
	phone: String,
	address: String,
	company: String
});
ContactSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('Contact',ContactSchema);