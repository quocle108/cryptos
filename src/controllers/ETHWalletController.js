const apiResponse = require("../common/helpers/apiResponse");
const { generateMasterKey, EthHdWallet } = require("../blockchain/ETH");
const { Wallet, ETHConfig, ETHSyncBlock, Withdraw } = require("../models");
const { isEmpty } = require("lodash");
const { constants } = require("../common/helpers/constants");
const { ETHSyncBlockInfo, web3 } = require("./ETHSyncBlockController");
const { decrypt, encrypt } = require("../common/helpers/utility");

var depositWallet = undefined;
var withdrawWallet = undefined;
var configETH = undefined;

async function initWallet(){

	if (isEmpty(configETH)) {
		configETH = await ETHConfig.findById(constants.eth.CONFIG_ID);
	}

	if (!isEmpty(configETH)) {
		const existedDepositWallet = await Wallet.findOne({ walletName: configETH.depositWalletName });
		if (!isEmpty(existedDepositWallet)) {
			const masterKey = decrypt(existedDepositWallet.encriptedKey, constants.eth.DEFAULT_WALLET_PASSWORD);
			depositWallet = new EthHdWallet(masterKey);
			depositWallet.generateAddresses(existedDepositWallet.addressesNum);

		}

		const existedWithdrawWallet = await Wallet.findOne({ walletName: configETH.withdrawWalletName });
		if (!isEmpty(existedDepositWallet)) {
			const masterKey = decrypt(existedWithdrawWallet.encriptedKey, constants.eth.DEFAULT_WALLET_PASSWORD);
			withdrawWallet = new EthHdWallet(masterKey);
			withdrawWallet.generateAddresses(existedWithdrawWallet.addressesNum);
		}
	}
	else {
		console.log("Please setup the Deposit/Withdraw Wallet");
	}
}

async function configWallet(req, res){
	const {
		depositWalletName,
		coldAddress,
		withdrawWalletName
	} = req.body;

	try {

		const existedDepositWallet = await Wallet.findOne({ walletName: depositWalletName });
		const existedWithdrawWallet = await Wallet.findOne({ walletName: withdrawWalletName });
		if (isEmpty(existedDepositWallet) || isEmpty(existedWithdrawWallet) || existedDepositWallet.walletType !== "deposit" || existedWithdrawWallet.walletType !== "withdraw" || isEmpty(existedWithdrawWallet.withdrawAddress)) {
			return apiResponse.ErrorResponse(res, "Invalid wallet");
		}

		const config = new ETHConfig({
			_id: constants.eth.CONFIG_ID,
			depositWalletName: depositWalletName,
			withdrawWalletName: withdrawWalletName,
			withdrawAddress: existedWithdrawWallet.withdrawAddress,
			coldAddress: coldAddress,
		});

		configETH = await ETHConfig.findOneAndUpdate({ _id: constants.eth.CONFIG_ID }, config, { upsert: true });
		await initWallet();

		const responseData = {
			configETH
		};

		return apiResponse.successResponseWithData(res, "Config Created", responseData);
	} catch (e) {
		console.log("reponse", e);
		return apiResponse.ErrorResponse(res, e.message);
	}
}

async function createWallet(req, res){
	const {
		walletName,
		walletType
	} = req.body;

	try {
		const masterKey = generateMasterKey();
		var withdrawAddress;
		if (walletType == "withdraw") {
			const wallet = new EthHdWallet(masterKey);
			withdrawAddress = wallet.generateAddresses(1);
		}

		const encriptedKey = encrypt(masterKey, constants.eth.DEFAULT_WALLET_PASSWORD);

		const existedWallet = await Wallet.findOne({ walletName: walletName });

		if (!isEmpty(existedWallet)) {
			return apiResponse.ErrorResponse(res, "The wallet name already exist");
		}

		const wallet = new Wallet({
			walletName: walletName,
			currency: "ETH",
			walletType: walletType,
			encriptedKey: encriptedKey,
			withdrawAddress: isEmpty(withdrawAddress) ? "" : withdrawAddress[0],
			addressesNum: isEmpty(withdrawAddress) ? 0 : 1
		});

		const response = await Wallet.create(wallet);

		const responseData = {
			walletName: response.walletName,
			walletType: response.walletType,
			masterKey: masterKey,
		};

		if (!isEmpty(withdrawAddress)) {
			responseData.withdrawAddress = withdrawAddress[0];
		}

		return apiResponse.successResponseWithData(res, "Wallet Created. Please backup master key safe", responseData);
	} catch (e) {
		console.log("reponse", e);
		return apiResponse.ErrorResponse(res, e.message);
	}
}

async function genarateAddress(req, res){

	try {
		if (isEmpty(depositWallet)) {
			return apiResponse.ErrorResponse(res, "There are no exist deposit wallet");
		}

		const address = depositWallet.generateAddresses(1);
		await Wallet.findOneAndUpdate({ walletName: configETH.depositWalletName }, { addressesNum: depositWallet.getAddressCount() });

		const ethSyncBlockInfo = await ETHSyncBlock.findOneAndUpdate({ _id: constants.eth.SYNC_BLOCK_INFO_ID }, { "$push": { "listenAddresses": address } }, { upsert: true });
		if (!isEmpty(ethSyncBlockInfo)) ETHSyncBlockInfo.update(ethSyncBlockInfo);

		const responseData = {
			address: address,
		};
		return apiResponse.successResponseWithData(res, "Address Created", responseData);
	} catch (e) {
		console.log("reponse", e);
		return apiResponse.ErrorResponse(res, e.message);
	}
}


async function withdraw(req, res){
	const {
		to,
		amount
	} = req.body;

	try {
		if (isEmpty(withdrawWallet)) {
			return apiResponse.ErrorResponse(res, "There are no exist withdraw wallet");
		}

		const withdrawOrder = new Withdraw({
			currency: "ETH",
			to: to,
			value: amount,
			status: "inqueue"
		});

		const response = await Withdraw.create(withdrawOrder);
		return apiResponse.successResponseWithData(res, "The withdraw order in queue", response);

	} catch (e) {
		console.log("reponse", e);
		return apiResponse.ErrorResponse(res, e.message);
	}
}

async function withdrawQueue(){

	try {
		if (isEmpty(withdrawWallet)) {
			throw new Error("There are no exist withdraw wallet");
		}
		const withdrawOrders = await Withdraw.find({ currency: "ETH", status: "inqueue" });
		var currentNonce = await web3.eth.getTransactionCount(configETH.withdrawAddress, "pending");
		const currentGasPrice = await web3.eth.getGasPrice();
		const chainID = await web3.eth.net.getId();

		for (let withdrawOrder of withdrawOrders) {

			console.log("withdrawOrder", withdrawOrder);

			const withdrawAmount = web3.utils.numberToHex(web3.utils.toWei(withdrawOrder.value, "ether"));
			const signedTransaction = withdrawWallet.signTransaction({
				from: configETH.withdrawAddress,
				to: withdrawOrder.to,
				value: withdrawAmount,
				nonce: web3.utils.numberToHex(currentNonce),
				gasPrice: web3.utils.numberToHex(currentGasPrice),
				gasLimit: web3.utils.toHex(21000),
				chainId: web3.utils.numberToHex(chainID)
			});
			const transaction = await web3.eth.sendSignedTransaction(signedTransaction);
			await Withdraw.findOneAndUpdate({ _id: withdrawOrder._id }, { status: "transfered", transactionId: transaction.transactionHash });
			currentNonce++;
		}

	} catch (e) {
		console.log("reponse", e);
	}
}

(function () {
	initWallet();
	setTimeout(withdrawQueue, 5 * 60 * 1000); // call after 5 minutes
})();

module.exports = {
	initWallet,
	configWallet,
	createWallet,
	genarateAddress,
	withdraw
};