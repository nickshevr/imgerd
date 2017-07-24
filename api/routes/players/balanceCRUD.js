const { Router } = require('express');
const models = require('db/models');
const { queryWithoutPoints, queryWithPoints } = require('./schemas');
const queryValidator = require('api/middleware/reqParamsValidator');
const sequelize = require('db/adapter');

const playerRouter = new Router();

const getPlayerBalance = async (playerId) => {
    return (await models.Balance.findOne({
        attributes: [
            [sequelize.fn('SUM', sequelize.col('amount')), 'balance']
        ],
        where: {
            playerId: playerId
        }
    })).balance || 0;
};

playerRouter.get('/take',
    queryValidator(queryWithPoints),
    async (req, res, next) => {
        const playerId = req.query.playerId;

        const player = await models.Player.findOne({ id: playerId });

        if (!player) {
            await models.Player.create({ id: playerId });
        }

        res.json({ status: 200 })
    });

playerRouter.get('/fund',
    queryValidator(queryWithPoints),
    async (req, res, next) => {
        const playerId = req.query.playerId;

        const currentBalance = await getPlayerBalance(playerId);

        console.log(`PlayerId: ${playerId}, current Balance ${currentBalance}`);

        const player = await models.Player.findOne({ id: playerId });

        if (!player) {
            await models.Player.create({ id: playerId });
        }

        await models.Balance.create({
            playerId,
            amount: req.query.points,
            reason: 'api'
        });

        res.json({
            status: 200
        })
    });

playerRouter.get('/balance',
    queryValidator(queryWithoutPoints),
    async (req, res) => {
        const balance = await getPlayerBalance(req.query.playerId);

        res.json({
            playerId: req.query.playerId,
            balance
        })
    });

module.exports = playerRouter;