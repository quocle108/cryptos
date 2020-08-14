var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var WalletSchema = new Schema({
	wallet_name: {type: String, unique : true, required: true, index: true},
	crypto_cyrrency: {type: String, required: true, index: true},
	encripted_key: {type: String, required: true},
	addresses_num: {type: Number, required: true},
}, {timestamps: true});

module.exports = mongoose.model("Wallet", WalletSchema);