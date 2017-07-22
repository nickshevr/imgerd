const { router } = require('express');
const revalidator = require('revalidator');

const tournamentRouter = new router();

// GET /announceTournament?tournamentId=1&deposit=1000
tournamentRouter.path('/take')
    .get(async (req, res, next) => {
        const playerId = req.query.playerId;
    });

// GET /joinTournament?tournamentId=1&playerId=P1&backerId=P2&backerId=P3
tournamentRouter.path('/fund')
    .get(async (req, res, next) => {
        const playerId = req.query.playerId;
    });

// {"tournamentId": "1", "winners": [{"playerId": "P1", "prize": 500}]}
tournamentRouter.path('/resultTournament ')
    .post(async (req, res, next) => {
        const playerId = req.query.playerId;
    });