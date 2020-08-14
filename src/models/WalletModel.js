var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var WalletSchema = new Schema({
	wallet_name: {type: String, unique : true, required: true, index: true},
	crypto_cyrrency: {type: String, enum : ['ETH','BTC','LTC'], default: 'ETH',required: true, index: true},
	wallet_type:{type: String, enum : ['deposit','withdraw'], default: 'deposit', required: true},
	encripted_key: {type: String, required: true},
	addresses_num: {type: Number, required: true},
	withdraw_address: {type: String},
}, {timestamps: true});

module.exports = mongoose.model("Wallet", WalletSchema);