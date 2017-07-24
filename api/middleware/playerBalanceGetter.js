const revalidator = require('revalidator');
const createError = require('http-errors');

module.exports = (playerId) => {
    return (req, res, next) => {
        const validation = revalidator.validate(req.query, validationSchema);

        return !validation.valid ? next(createError.NotAcceptable(_stringifyErrors(validation.errors))) : next();
    }
};