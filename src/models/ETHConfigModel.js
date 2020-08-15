var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var ETHConfigSchema = new Schema({
	_id :{type: Number},
	depositWalletName: {type: String, required: true},
	withdrawWalletName: {type: String, required: true},
	withdrawAddress: {type: String, required: true},
	coldAddress: {type: String, required: true},
}, {timestamps: true});

module.exports = mongoose.model("ETHConfig", ETHConfigSchema);