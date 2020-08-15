var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var TransferSchema = new Schema({
	to: {type: String, required: true},
	amount: {type: String, required: true},
	memo: {type: String},
	status: {type: String, required: true},
}, {timestamps: true});

module.exports = mongoose.model("Transfer", TransferSchema);