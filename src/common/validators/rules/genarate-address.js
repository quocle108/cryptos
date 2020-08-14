module.exports = {
	wallet_name: {
		in: ["body"],
		errorMessage: "\"wallet_name\" field is missing",
		exists: true
	},
	webhook_trigger: {
		in: ["body"],
		errorMessage: "\"webhook_trigger\" field is missing",
		exists: true        
	}
};
