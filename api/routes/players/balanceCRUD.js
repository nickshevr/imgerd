const { Router } = require('express');
const models = require('db/models');
const { balanceCRUDSchema: schema } = require('./schemas');
const validator = require('api/middleware/reqParamsValidator');

const playerRouter = new Router();

// GET /take?playerId=P1&points=300

playerRouter.get('/take',
    validator(schema(true)),
    async (req, res, next) => {
        const playerId = req.query.playerId;

        const player = await models.Player.findOne({ id: playerId });

        if (!player) {
            await models.Player.create({ id: playerId });
        }

        res.json({ status: 200 })
    });

// GET /fund?playerId=P1&points=300

playerRouter.get('/fund', async (req, res, next) => {
        const playerId = req.query.playerId;
    });

// GET /balance?playerId=P1

playerRouter.get('/balance', async (req, res, next) => {
        const playerId = req.query.playerId;
    });

module.exports = playerRouter;