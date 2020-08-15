var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var ETHSyncBlockSchema = new Schema({
	_id :{type: Number},
	lastSyncedBlock: {type: Number, required: true},
	listenAddresses: {type: Array},
	listenTransactions: {type: Array},
}, {timestamps: true});

module.exports = mongoose.model("ETHSyncBlock", ETHSyncBlockSchema);