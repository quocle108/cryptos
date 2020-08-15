const {
	checkSchema,
	validationResult
} = require("express-validator");
const rules = require("./rules");
const apiResponse = require("../helpers/apiResponse");

const prepareCustomErrorMessage = (errors) => {
	const errorDetails = errors.map(({ param, msg }) => {
		return { param, msg };
	});
	return {
		name: "ValidationError",
		message: errorDetails
	};
};

const validate = async (req, res, next) => {
	const errorResult = validationResult(req).array();
	if (errorResult.length > 0) {
		const errors = prepareCustomErrorMessage(errorResult);
		return apiResponse.validationErrorWithData(res, errors.name, errors.message);
	} else {
		next();
	}
};

const validateCreateWallet = [checkSchema(rules.createwallet), validate];
const validateWithdraw = [checkSchema(rules.withdraw), validate];
const validateConfigWallet = [checkSchema(rules.configWallet), validate];
module.exports = {
	validateCreateWallet,
	validateWithdraw,
	validateConfigWallet
};
