module.exports = {
	depositWalletName: {
		in: ["body"],
		errorMessage: "\"depositWalletName\" field is missing",
		exists: true
	},
	coldAddress:{
		in: ["body"],
		errorMessage: "\"coldAddress\" field is missing",
		exists: true
	},
	withdrawWalletName:{
		in: ["body"],
		errorMessage: "\"withdrawWalletName\" field is missing",
		exists: true
	}
};
