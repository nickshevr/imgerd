const Joi = require('joi');
const { withPlayerId } = require('../players/schemas');

const withTournamentId = {
        tournamentId: Joi.number().integer().min(0).required(),
};

const withDeposit = {
        deposit: Joi.number().integer().min(0).required(),
};

const withBackers = {
        backerIds: Joi.array().items(Joi.number().integer().min(0))
};

exports.withBackers = withBackers;
exports.withDeposit = withDeposit;
exports.withTournamentId = withTournamentId;

exports.tournamentsAnnounceSchema =  { query: Object.assign({}, withDeposit, withTournamentId) };
exports.tournamentsJoinSchema =  { query: Object.assign({}, withPlayerId, withBackers, withTournamentId) };

