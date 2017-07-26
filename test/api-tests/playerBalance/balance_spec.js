const request = require('supertest');
const app = require('api/app');
const qs = require('qs');
const user = request.agent(app);
const sequalizeInstace = require('db/adapter');

describe('#{GET} /take', () => {
    before(async function() {
        // await sequalizeInstace.sync({ force: true });
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

    describe(`Should return error point param is not valid`, () => {
        it(`Point is't valid int`, async () => {
            const query = qs.stringify({ playerId: 'somePlayerId' });
            const res = await user.get(`/take?${query}`);

            res.body.errors[0].field.should.be.equal('playerId');
            res.status.should.be.equal(400);
        });

        it(`Point isn't gt 0`, async () => {
            const query = qs.stringify({ playerId: -10 });
            const res = await user.get(`/take?${query}`);

            res.body.errors[0].field.should.be.equal('playerId');
            res.status.should.be.equal(400);
        });
    });

    it(`Should return error if user balance become lt 0`, async () => {
        const query = qs.stringify({ playerId: 1, points: 300 });
        const res = await user.get(`/take?${query}`);
    });

    it(`Should degree player balance by point param amount`, async () => {
        const query = qs.stringify({ playerId: 1, points: 300 });
        const res = await user.get(`/take?${query}`);
    });
});
