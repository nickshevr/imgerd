const { Router } = require('express');
const validate = require('express-validation');
const createError = require('http-errors');
const validator = require('api/middleware/reqParamsValidator');
const models = require('db/models');
const sequelize = require('db/adapter');
const currentObjectGetter = require('api/middleware/currentObjectGetter');
const { tournamentsAnnounceSchema, tournamentsJoinSchema, tournamentsResultSchema } = require('./schemas');

const tournamentRouter = new Router({ mergeParams: true });

// GET /announceTournament?tournamentId=1&deposit=1000
tournamentRouter.get('/announceTournament',
    validate(tournamentsAnnounceSchema),
    currentObjectGetter('Tournament', 'tournamentId', false, true),
    async (req, res, next) => {
        const tournamentId = req.query.tournamentId;
        const deposit = req.query.deposit;

        const createdTournament = await models.Tournament.create({
            id: tournamentId,
            deposit,
            status: 'opened'
        });

        res.json(createdTournament);
    }
);

// GET /joinTournament?tournamentId=1&playerId=P1&backerIds=[P2, P3]
tournamentRouter.get('/joinTournament',
    validate(tournamentsJoinSchema),
    currentObjectGetter('Tournament', 'tournamentId'),
    currentObjectGetter('Player', 'playerId'),
    async (req, res, next) => {
        try {
            const tournament = req['Tournament_currentObject'];
            const mainPlayer = req['Player_currentObject'];
            const backerIds = req.query.backerIds;

            await tournament.joinTournament(mainPlayer, Array.isArray(backerIds) ? backerIds : []);

            res.json(mainPlayer);
        } catch(e) {
            return next(e);
        }
    }
);

// {"tournamentId": "1", "winners": [{"playerId": "P1", "prize": 500}]}
tournamentRouter.post('/resultTournament',
    validate(tournamentsResultSchema),
    currentObjectGetter('Tournament', 'tournamentId'),
    async (req, res, next) => {
        try {
            await req['Tournament_currentObject'].resolveTournament(req.body.winners);

            res.json({
                status: 200
            });
        } catch(e) {
            return next(e);
        }
    }
);

module.exports = tournamentRouter;