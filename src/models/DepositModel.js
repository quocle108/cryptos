var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var DepositSchema = new Schema({
	transaction_id: {type: String, required: true, unique : true},
	currency: { type: String, required: true, index: true},
	to: {type: String, required: true, index: true},
	value: {type: Number, required: true},
	block_confirmation:{type: Number},
	status: {type: String, enum : ['unconfrim','done'], default: 'unconfrim', index: true},
	
}, {timestamps: true});

module.exports = mongoose.model("Deposit", DepositSchema);