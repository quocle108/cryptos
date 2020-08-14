const { generateMasterKey, EthHdWallet } = require("./HDWallet");
const { sync_blocks } = require("./sync_blocks");
module.exports = {
	generateMasterKey,
	EthHdWallet,
	sync_blocks
};
