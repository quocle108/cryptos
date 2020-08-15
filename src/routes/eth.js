var express = require("express");
const EthWalletController = require("../controllers/ETHWalletController");
var router = express.Router();

const {
	validateCreateWallet,
	validateWithdraw,
	validateConfigWallet
} = require("../common/validators");

router.post("/createWallet", validateCreateWallet, EthWalletController.createWallet);
router.post("/configWallet", validateConfigWallet, EthWalletController.configWallet);
router.post("/genarateAddress", EthWalletController.genarateAddress);
router.post("/withdraw", validateWithdraw, EthWalletController.withdraw);

module.exports = router;