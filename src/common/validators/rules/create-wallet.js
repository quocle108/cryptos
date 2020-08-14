module.exports = {
	wallet_name: {
		in: ["body"],
		errorMessage: "\"wallet_name\" field is missing",
		exists: true
	}
};
