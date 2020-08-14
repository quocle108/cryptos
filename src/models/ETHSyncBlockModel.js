var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var ETHSyncBlockSchema = new Schema({
	_id :{type: Number},
	last_block: {type: Number, required: true},
	listen_addresses: {type: Array},
	listen_transaction: {type: Array},
}, {timestamps: true});

module.exports = mongoose.model("ETHSyncBlock", ETHSyncBlockSchema);