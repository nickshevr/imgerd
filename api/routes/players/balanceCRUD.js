const { Router } = require('express');
const createError = require('http-errors');
const validate = require('express-validation');
const models = require('db/models');
const queryValidator = require('api/middleware/reqParamsValidator');
const currentObjectGetter = require('api/middleware/currentObjectGetter');
const { takeSchema, fundSchema, balanceSchema } = require('./schemas');

const playerRouter = new Router();

playerRouter.get('/take',
    validate(takeSchema),
    currentObjectGetter('Player', 'playerId', false),
    async (req, res, next) => {
        const player = req[`Player_currentObject`];

        try {
            await player.updateCurrentBalance(-req.query.points);
            await models.Balance.updatePlayerBalance(player.id, -req.query.points, 'api');
        } catch(e) {
            return next(createError.NotAcceptable(e));
        }

        res.json(player)
    });

playerRouter.get('/fund',
    validate(fundSchema),
    currentObjectGetter('Player', 'playerId', true),
    async (req, res, next) => {
        const player = req[`Player_currentObject`];

        try {
            await player.updateCurrentBalance(req.query.points);
            await models.Balance.updatePlayerBalance(player.id, req.query.points, 'api');
        } catch(e) {
            return next(createError.InternalServerError(JSON.stringify(e)));
        }

        res.json(player)
    });

playerRouter.get('/balance',
    validate(balanceSchema),
    currentObjectGetter('Player', 'playerId', false),
    async (req, res) => {
        res.json({
            playerId: req.query.playerId,
            balance: req[`Player_currentObject`].currentBalance
        })
    });

module.exports = playerRouter;