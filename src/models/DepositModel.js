var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var DepositSchema = new Schema({
	transactionId: {type: String, required: true, unique : true},
	currency: { type: String, required: true, index: true},
	to: {type: String, required: true, index: true},
	value: {type: Number, required: true},
	blockConfirmation:{type: Number},
	status: {type: String, enum : ["unconfirm", "forwarded", "done"], default: "unconfirm", index: true},
	
}, {timestamps: true});

module.exports = mongoose.model("Deposit", DepositSchema);