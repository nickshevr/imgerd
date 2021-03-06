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

const withWinners = {
        winners: Joi.array().items(
            Joi.object().keys({
                playerId: Joi.number().integer().min(0).required(),
                prize: Joi.number().integer().min(0).required()
            })
        )
};

exports.withBackers = withBackers;
exports.withDeposit = withDeposit;
exports.withTournamentId = withTournamentId;

exports.tournamentsAnnounceSchema =  { query: Object.assign({}, withDeposit, withTournamentId) };
exports.tournamentsJoinSchema =  { query: Object.assign({}, withPlayerId, withBackers, withTournamentId) };
exports.tournamentsResultSchema = { body: withWinners, query: withTournamentId };
