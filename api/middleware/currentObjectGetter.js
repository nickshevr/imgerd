const models = require('db/models');
const createError = require('http-errors');

module.exports = (model, queryIdParam, shouldCreate = false) => {
    return async (req, res, next) => {
        const Model = models[model];
        const id = req.query[queryIdParam];

        let object = await Model.findOne({ where: { id }});

        if (!object && !shouldCreate) {
            return next(createError.NotFound(`Object with id: ${id} in model ${model}`));
        }

        if (!object && shouldCreate) {
            object = await Model.create({ id });
        }

        req[`${model}_currentObject`] = object;

        return next();
    }
};