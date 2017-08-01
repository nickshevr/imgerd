const request = require('supertest');
const app = require('api/app');
const qs = require('qs');
const user = request.agent(app);
const Player = require('db/models').Player;
const sequalizeInstace = require('db/adapter');

describe('#{GET} /take', () => {
    before(async function() {
        await sequalizeInstace.sync({ force: true });
    });

    describe('Wrong query params', () => {
        it(`Should return error query without playerId`, async () => {
            const query = qs.stringify({ points: 300 });
            const res = await user.get(`/take?${query}`);

            res.status.should.be.equal(400);
            res.body.errors[0].field.should.be.equal('playerId');
        });

        it(`Should return error query without point`, async () => {
            const query = qs.stringify({ playerId: 1 });
            const res = await user.get(`/take?${query}`);

            res.status.should.be.equal(400);
            res.body.errors[0].field.should.be.equal('points');
        });
    });

    it(`Should return error user doesn't exist`, async () => {
        const query = qs.stringify({ playerId: 1, points: 300 });
        const res = await user.get(`/take?${query}`);

        res.status.should.be.equal(404);
        res.body.should.be.deepEqual({
            statusCode: 404,
            name: 'NotFoundError',
            message: 'Object with id: 1 in model Player'
        });
    });

    describe(`Should return error playerId param is not valid`, () => {
        it(`Point is't valid int`, async () => {
            const query = qs.stringify({ playerId: 'somePlayerId', points: 100 });
            const res = await user.get(`/take?${query}`);

            res.body.errors[0].field.should.be.equal('playerId');
            res.status.should.be.equal(400);
        });

        it(`Point isn't gt 0`, async () => {
            const query = qs.stringify({ playerId: -10, points: 100 });
            const res = await user.get(`/take?${query}`);

            res.body.errors[0].field.should.be.equal('playerId');
            res.status.should.be.equal(400);
        });
    });

    describe(`Should return error playerId param is not valid`, () => {
        it(`Point is't valid int`, async () => {
            const query = qs.stringify({ playerId: 'somePlayerId', points: 100 });
            const res = await user.get(`/take?${query}`);

            res.body.errors[0].field.should.be.equal('playerId');
            res.status.should.be.equal(400);
        });

        it(`Point isn't gt 0`, async () => {
            const query = qs.stringify({ playerId: -10, points: 100 });
            const res = await user.get(`/take?${query}`);

            res.body.errors[0].field.should.be.equal('playerId');
            res.status.should.be.equal(400);
        });
    });

    describe('DB part logic', () => {
        before(async () => {
            const query = qs.stringify({ playerId: 1, points: 200 });
            await user.get(`/fund?${query}`);
        });

        it(`Should return error if user balance become lt 0`, async () => {
            const query = qs.stringify({ playerId: 1, points: 300 });
            const res = await user.get(`/take?${query}`);

            res.status.should.be.equal(406);
            /*res.body.should.be.deepEqual({
                statusCode: 406,
                name: "NotAcceptableError",
                message: "Balance must be gte 0"
            });*/
        });

        it(`Should degree player balance by point param amount`, async () => {
            const playerBefore = await Player.findOne({ where: { id: 1 }});

            const query = qs.stringify({ playerId: 1, points: 150 });
            const res = await user.get(`/take?${query}`);

            const updatedPlayer = await Player.findOne({ where: { id: 1 }});
            updatedPlayer.currentBalance.should.be.equal(playerBefore.currentBalance - 150);
        });
    });
});
