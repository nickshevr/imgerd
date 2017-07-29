const { Router } = require('express');
const validate = require('express-validation');
const createError = require('http-errors');
const validator = require('api/middleware/reqParamsValidator');
const models = require('db/models');
const sequelize = require('db/adapter');
const currentObjectGetter = require('api/middleware/currentObjectGetter');
const { tournamentsAnnounceSchema, tournamentsJoinSchema } = require('./schemas');

const tournamentRouter = new Router();

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
    });

// GET /joinTournament?tournamentId=1&playerId=P1&backerIds=[P2, P3]
tournamentRouter.get('/joinTournament',
    validate(tournamentsJoinSchema),
    currentObjectGetter('Tournament', 'tournamentId'),
    currentObjectGetter('Player', 'playerId'),
    async (req, res, next) => {
        try {
            const tournament = req['Tournament_currentObject'];
            const mainPlayer = req['Player_currentObject'];

            const backerIds = [1, 2, 3];
            const balancesObj = await models.Balance.findAll({
                where: { playerId: { $in: backerIds }},
                group: ['balance.playerId'],
                attributes: [ 'playerId', [sequelize.fn('SUM', sequelize.col('amount')), 'balance'] ]
            });

            // если некоторых людей поддержки нет в базе
            if (Object.keys(balancesObj).length < backerIds.length) {
                return next(createError.NotAcceptable());
            }

            // считаю, что это abuse и нужно запрещать
            if (backerIds.includes(mainPlayer.id)) {
                return next(createError.NotAcceptable());
            }

            const pointRequirement = Math.ceil(tournament.deposit / backerIds.length + 1);

            for (const backerId of backerIds) {
                if (balancesObj[backerId] < pointRequirement) {
                    return next(createError.NotAcceptable());
                }
            }

            if (player.balance < pointRequirement) {
                return next(createError.NotAcceptable());
            }

            //тут транзакция на убавление баланса и добавление записи в tournamentParticipants

            res.json(balancesObj);
        } catch(e) {
            return next(e);
        }
    });

// {"tournamentId": "1", "winners": [{"playerId": "P1", "prize": 500}]}
tournamentRouter.post('/resultTournament ',
    async (req, res, next) => {
        const playerId = req.query.playerId;
        //тут транзакция на добавление баланса по записи в tournamentParticipants
    });

module.exports = tournamentRouter;