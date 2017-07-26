const models = require('db/models');
const createError = require('http-errors');

// Не стоит писать функций со сложной логикой, было бы неплохо разнести её на пару миддлварин
module.exports = (model, queryIdParam, shouldCreate = false, errorIfExist = false) => {
    return async (req, res, next) => {
        const Model = models[model];
        const id = req.query[queryIdParam];

        let object = await Model.findOne({ where: { id }});

        if (!object && !shouldCreate && !errorIfExist) {
            return next(createError.NotFound(`Object with id: ${id} in model ${model}`));
        }

        if (!object && shouldCreate) {
            object = await Model.create({ id });
        }

        if (object && errorIfExist) {
            return next(createError.NotAcceptable(`Object with id: ${id} in model ${model} already created`));
        }

        // TODO повнимательнее подумать
        if (object) {
            req[`${model}_currentObject`] = object;
        }

        return next();
    }
};