module.exports = {
	walletName: {
		in: ["body"],
		errorMessage: "\"walletName\" field is missing",
		exists: true
	},
	walletType: {
		in: ["body"],
		matches: {
			options: [/\b(?:deposit|withdraw)\b/],
			errorMessage: "Invalid wallet type. The support type: deposit|withdraw "
		}
	}
};
