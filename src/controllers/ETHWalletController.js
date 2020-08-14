const apiResponse = require("../common/helpers/apiResponse");
const { generateMasterKey, EthHdWallet } = require("../common/blockchain/ETH");
const { Wallet, ETHConfig, ETHSyncBlock } = require("../models");
const { isEmpty } = require("lodash");
const {
	decrypt,
	encrypt
} = require("../common/helpers/utility");

const { start_syncing_blocks } = require("./ETHSyncBlockController");

const ETH_CONFIG_DB_ID = 0;
const ETH_SYNC_BLOCK_DB_ID = 1;
const DEFAULT_WALLET_PASSWORD = "passworddsd";

global.depositWallet = undefined;
global.withdrawWallet = undefined;
global.configETH = undefined;

initWallet = async () => {
	if (isEmpty(configETH)) {
		configETH = await ETHConfig.findById(ETH_CONFIG_DB_ID);

	}

	if (!isEmpty(configETH)) {
		const existedDepositWallet = await Wallet.findOne({ wallet_name: configETH.deposit_wallet_name });
		if (!isEmpty(existedDepositWallet)) {
			const masterKey = decrypt(existedDepositWallet.encripted_key, DEFAULT_WALLET_PASSWORD);
			depositWallet = new EthHdWallet(masterKey);
			depositWallet.generateAddresses(existedDepositWallet.addresses_num);

		}

		const existedWithdrawWallet = await Wallet.findOne({ wallet_name: configETH.withdraw_wallet_name });
		if (!isEmpty(existedDepositWallet)) {
			const masterKey = decrypt(existedWithdrawWallet.encripted_key, DEFAULT_WALLET_PASSWORD);
			withdrawWallet = new EthHdWallet(masterKey);
			withdrawWallet.generateAddresses(1);
		}
	} 
	// else {
	//     throw Error("There is an issue in wallet configuration")
	// }
};

(function () {
	initWallet();
})();

configWallet = async (req, res) => {
	const {
		deposit_wallet_name,
		cold_address,
		withdraw_wallet_name
	} = req.body;

	try {

		const existedDepositWallet = await Wallet.findOne({ wallet_name: deposit_wallet_name });
		const existedWithdrawWallet = await Wallet.findOne({ wallet_name: withdraw_wallet_name });
		if (isEmpty(existedDepositWallet) || isEmpty(existedWithdrawWallet)) {
			return apiResponse.ErrorResponse(res, "The wallet does not exsit");
		}


		const config = new ETHConfig({
			_id: ETH_CONFIG_DB_ID,
			deposit_wallet_name: deposit_wallet_name,
			cold_address: cold_address,
			withdraw_wallet_name: withdraw_wallet_name,
			withdraw_addesss: "",
		});

		configETH = await ETHConfig.findOneAndUpdate({ _id: ETH_CONFIG_DB_ID }, config, { upsert: true });
		await initWallet();

		response_data = {
			configETH
		};

		return apiResponse.successResponseWithData(res, "Config Created. Please keep master key safe", response_data);
	} catch (e) {
		console.log("reponse", e);
		return apiResponse.ErrorResponse(res, e.message);
	}
	return apiResponse.ErrorResponse(res, "Unxpected error");
};

createWallet = async (req, res) => {
	const {
		wallet_name
	} = req.body;

	try {
		const masterKey = generateMasterKey();
		const encriptedKey = encrypt(masterKey, DEFAULT_WALLET_PASSWORD);

		const existedWallet = await Wallet.findOne({ wallet_name: wallet_name });

		if (!isEmpty(existedWallet)) {
			return apiResponse.ErrorResponse(res, "The wallet name already exist");
		}

		const wallet = new Wallet({
			wallet_name: wallet_name,
			crypto_cyrrency: "ETH",
			encripted_key: encriptedKey,
			addresses_num: 0
		});

		const dp_reponse = await Wallet.create(wallet);

		response_data = {
			wallet_name: dp_reponse.wallet_name,
			master_key: masterKey,
		};

		return apiResponse.successResponseWithData(res, "Wallet Created. Please backup master key safe", response_data);
	} catch (e) {
		console.log("reponse", e);
		return apiResponse.ErrorResponse(res, e.message);
	}
	return apiResponse.ErrorResponse(res, "Unxpected error");
};

genarateAddress = async (req, res) => {

	try {
		if (isEmpty(depositWallet)) {
			return apiResponse.ErrorResponse(res, "There are no exist deposit wallet");
		}

		const address = depositWallet.generateAddresses(1);
		if (listenAddresses.indexOf(address) != -1) {
			return apiResponse.ErrorResponse(res, "Somthing Wrong. Address already exist");
		}
		listenAddresses.push(address);
		await Wallet.findOneAndUpdate({ wallet_name: configETH.deposit_wallet_name }, { addresses_num: depositWallet.getAddressCount() });
		await ETHSyncBlock.findOneAndUpdate({ _id: ETH_SYNC_BLOCK_DB_ID }, { listen_addresses: listenAddresses }, { upsert: true });

		response_data = {
			address: address,
		};
		return apiResponse.successResponseWithData(res, "Address Created", response_data);
	} catch (e) {
		console.log("reponse", e);
		return apiResponse.ErrorResponse(res, e.message);
	}

	return apiResponse.ErrorResponse(res, "Unxpected error");
};


transfer = async (req, res) => {
	const {
		currency,
		network,
		wallet_name,
		password
	} = req.body;

	try {
		const wallet = new EthHdWallet(masterKey);


	} catch (e) {
		console.log("reponse", e);
		return apiResponse.ErrorResponse(res, e.message);
	}

	return apiResponse.successResponseWithData(res, "Operation success", newAddress);
};

module.exports = {
	initWallet,
	configWallet,
	createWallet,
	genarateAddress,
	transfer
};