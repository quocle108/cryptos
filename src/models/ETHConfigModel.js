var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var ETHConfigSchema = new Schema({
	_id :{type: Number},
	deposit_wallet_name: {type: String, unique : true, required: true, index: true},
	cold_address: {type: String, required: true},
	withdraw_wallet_name: {type: String, required: true},
	withdraw_addesss: {type: String, required: true},
}, {timestamps: true});

module.exports = mongoose.model("ETHConfig", ETHConfigSchema);