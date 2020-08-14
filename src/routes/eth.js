var express = require("express");
const EthWalletController = require("../controllers/ETHWalletController");
var router = express.Router();

const {
	validateCreateWallet
} = require("../common/validators");

router.post("/configWallet", EthWalletController.configWallet);
router.post("/createWallet", validateCreateWallet, EthWalletController.createWallet);
router.post("/genarateAddress", EthWalletController.genarateAddress);
module.exports = router;