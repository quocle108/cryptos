var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var WalletSchema = new Schema({
	walletName: {type: String, unique : true, required: true, index: true},
	currency: {type: String, enum : ["ETH","BTC","LTC"], default: "ETH",required: true, index: true},
	walletType:{type: String, enum : ["deposit","withdraw"], default: "deposit", required: true},
	encriptedKey: {type: String, required: true},
	addressesNum: {type: Number, required: true},
	withdrawAddress: {type: String},
}, {timestamps: true});

module.exports = mongoose.model("Wallet", WalletSchema);