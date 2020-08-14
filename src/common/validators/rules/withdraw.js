module.exports = {
	to: {
		in: ["body"],
		errorMessage: "\"to\" field is missing",
		exists: true
	},
	amount: {
		in: ["body"],
		errorMessage: "\"amount\" field is missing",
		exists: true
	},
	memo: {
		in: ["body"],
		errorMessage: "\"memo\" field is missing",
		exists: true
	}
};
