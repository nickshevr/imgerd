const Joi = require('joi');

const withPlayerId = {
    playerId: Joi.number().integer().min(0).required(),
};

const withPoints = {
    points: Joi.number().integer().min(0).required()
};

exports.withPlayerId = withPlayerId;
exports.withPoints = withPoints;

exports.takeSchema = { query: Object.assign({}, withPoints, withPlayerId) };
exports.fundSchema = { query: Object.assign({}, withPoints, withPlayerId) };
exports.balanceSchema = { query: withPoints };