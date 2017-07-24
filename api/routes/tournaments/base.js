const { Router } = require('express');
const models = require('db/models');
const { tournamentsSchema } = require('./schemas');
const validator = require('api/middleware/reqParamsValidator');
const sequelize = require('db/adapter');
const tournamentRouter = new Router();
const createError = require('http-errors');
const { queryWithoutPoints } = require('../players/schemas');

// GET /announceTournament?tournamentId=1&deposit=1000
tournamentRouter.get('/announceTournament',
    validator(tournamentsSchema),
    async (req, res, next) => {
        const tournamentId = req.query.tournamentId;
        const tournament = await models.Tournament.findOne({ where: { id: tournamentId } });
        const deposit = req.query.deposit;

        if (tournament) {
            return next(createError.NotAcceptable("Tournament was already created"));
        }

        const createdTournament = await models.Tournament.create({
            id: tournamentId,
            deposit,
            status: 'opened'
        });

        res.json(createdTournament);
    });

// GET /joinTournament?tournamentId=1&playerId=P1&backerId=P2&backerId=P3
// GET /joinTournament?tournamentId=1&playerId=P1&backerIds=[P2, P3]
tournamentRouter.get('/joinTournament',
    validator(Object.assign({}, tournamentsSchema, queryWithoutPoints)),
    async (req, res, next) => {
        try {
            const playerIds = [1, 2, 3];
            const balancesObj = await models.Balance.findAll({
                where: { playerId: { $in: playerIds }},
                group: ['balance.playerId'],
                attributes: [ 'playerId', [sequelize.fn('SUM', sequelize.col('amount')), 'balance'] ]
            });

            const tournament = await models.Tournament.findOne({ where: { id: req.query.tournamentId }});

            if (!tournament) {
                return next(createError.NotFound());
            }

            

            res.json(balancesObj);
        } catch(e) {
            return next(e);
        }
    });

// {"tournamentId": "1", "winners": [{"playerId": "P1", "prize": 500}]}
tournamentRouter.post('/resultTournament ',
    async (req, res, next) => {
        const playerId = req.query.playerId;
    });

module.exports = tournamentRouter;