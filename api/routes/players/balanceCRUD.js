const { Router } = require('express');
const createError = require('http-errors');
const validate = require('express-validation');
const models = require('db/models');
const sequelize = require('db/adapter');
const queryValidator = require('api/middleware/reqParamsValidator');
const currentObjectGetter = require('api/middleware/currentObjectGetter');
const { takeSchema, fundSchema, balanceSchema } = require('./schemas');

const playerRouter = new Router();

const getPlayerBalance = async (playerId) => {
    const { dataValues } = await models.Balance.find({
        attributes: [
            [sequelize.fn('SUM', sequelize.col('amount')), 'balance']
        ],
        where: {
            playerId: playerId
        }
    });

    return dataValues.balance || 0;
};

playerRouter.get('/take',
    validate(takeSchema),
    currentObjectGetter('Player', 'playerId', false),
    async (req, res, next) => {
        const player = req[`Player_currentObject`];
        const currentBalance = await getPlayerBalance(player.id);

        if (currentBalance <= req.query.points) {
            return next(createError.NotAcceptable('Balance must be gte 0'));
        }

        try {
            await models.Balance.create({
                playerId: player.id,
                amount: -req.query.points,
                reason: 'api'
            });
        } catch(e) {
            return next(createError.InternalServerError(JSON.stringify(e)));
        }

        res.json(player)
    });

playerRouter.get('/fund',
    validate(fundSchema),
    currentObjectGetter('Player', 'playerId', true),
    async (req, res, next) => {
        const player = req[`Player_currentObject`];

        try {
            await models.Balance.create({
                playerId: player.id,
                amount: req.query.points,
                reason: 'api'
            });
        } catch(e) {
            return next(createError.InternalServerError(JSON.stringify(e)));
        }

        res.json(player)
    });

playerRouter.get('/balance',
    validate(balanceSchema),
    async (req, res) => {
        const balance = await getPlayerBalance(req.query.playerId);
        console.log(balance);

        res.json({
            playerId: req.query.playerId,
            balance
        })
    });

module.exports = playerRouter;