module.exports = {
	wallet_name: {
		in: ["body"],
		errorMessage: "\"wallet_name\" field is missing",
		exists: true
	},
	wallet_type:{
		in: ["body"],
		matches: {
			options: [/\b(?:deposit|withdraw)\b/],
			errorMessage: "Invalid wallet type. The support type: deposit|withdraw "
		  }
	}
};
