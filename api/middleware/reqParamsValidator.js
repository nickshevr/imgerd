const revalidator = require('revalidator');
const createError = require('http-errors');

const _stringifyErrors = (array) => array.reduce((res, e) => `{$${e.property}}: ${e.message}; ${res}`, '');

module.exports = (validationSchema) => {
    return (req, res, next) => {
        const validation = revalidator.validate(req.query, validationSchema);

        return !validation.valid ? next(createError.NotAcceptable(_stringifyErrors(validation.errors))) : next();
    }
};