const request = require('supertest');
const app = require('api/app');
const qs = require('qs');
const user = request.agent(app);
const sequalizeInstace = require('db/adapter');
const should = require('should');

describe('#{GET} /balance', () => {
    before(async function() {
        await sequalizeInstace.sync({ force: true });
    });

    it(`Should return error if user doesn't exist`, async () => {
        const query = qs.stringify({ playerId: 300 });
        const res = await user.get(`/balance?${query}`);

        res.status.should.be.equal(404);
    });

    it(`Should return json with player balance`, async () => {
        const query = qs.stringify({ playerId: 1, points: 300 });
        const res = await user.get(`/fund?${query}`);

        res.status.should.be.equal(200);
        res.body.should.be.a.Player();
        res.body.currentBalance.should.be.equal(300);
    });
});
