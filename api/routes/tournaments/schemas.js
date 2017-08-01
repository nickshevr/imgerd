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
//[{"playerId": "P1", "prize": 2000}]}
const withWinners = {
        winners: Joi.array().items()
};

exports.withBackers = withBackers;
exports.withDeposit = withDeposit;
exports.withTournamentId = withTournamentId;

exports.tournamentsAnnounceSchema =  { query: Object.assign({}, withDeposit, withTournamentId) };
exports.tournamentsJoinSchema =  { query: Object.assign({}, withPlayerId, withBackers, withTournamentId) };
exports.tournamentsResultSchema = { body: withWinners, query: withTournamentId };
