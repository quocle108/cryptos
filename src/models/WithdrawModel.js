var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var WithdrawSchema = new Schema({
	currency: { type: String, required: true, index: true},
	to: {type: String, required: true, index: true},
	value: {type: String, required: true},
	memo:{type: String},
	status: {type: String, enum : ["inqueue", "transfered", "success"], default: "inqueue", index: true},
	errorMsg: {type: String},
	transactionId: {type: String},
	
}, {timestamps: true});

module.exports = mongoose.model("Withdraw", WithdrawSchema);