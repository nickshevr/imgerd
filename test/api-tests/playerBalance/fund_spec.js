const request = require('supertest');
const app = require('api/app');
const qs = require('qs');
const user = request.agent(app);
const Player = require('db/models').Player;
const sequalizeInstace = require('db/adapter');

describe('#{GET} /fund', () => {
    before(async function() {
        await sequalizeInstace.sync({ force: true });
    });

    describe('Wrong query params', () => {
        it(`Should return error query without playerId`, async () => {
            const query = qs.stringify({ points: 300 });
            const res = await user.get(`/fund?${query}`);

            res.status.should.be.equal(400);
            res.body.errors[0].field.should.be.equal('playerId');
        });

        it(`Should return error query without point`, async () => {
            const query = qs.stringify({ playerId: 1 });
            const res = await user.get(`/fund?${query}`);

            res.status.should.be.equal(400);
            res.body.errors[0].field.should.be.equal('points');
        });
    });

    describe(`Should return error playerId param is not valid`, () => {
        it(`Point is't valid int`, async () => {
            const query = qs.stringify({ playerId: 'somePlayerId', points: 100 });
            const res = await user.get(`/fund?${query}`);

            res.body.errors[0].field.should.be.equal('playerId');
            res.status.should.be.equal(400);
        });

        it(`Point isn't gt 0`, async () => {
            const query = qs.stringify({ playerId: -10, points: 100 });
            const res = await user.get(`/fund?${query}`);

            res.body.errors[0].field.should.be.equal('playerId');
            res.status.should.be.equal(400);
        });
    });

    it(`Should create user if it wasn't exist`, async () => {
        const query = qs.stringify({ playerId: 1, points: 300 });
        const res = await user.get(`/fund?${query}`);

        res.status.should.be.equal(200);
        const createdPlayer = await Player.findOne({ where: { id: 1 }});

        createdPlayer.should.have.property('dataValues');
        createdPlayer.dataValues.should.have.properties([ 'id', 'username', 'createdAt', 'updatedAt' ]);
    });

    it(`Should increment player balance by point param amount`, async () => {
        const query = qs.stringify({ playerId: 1, points: 300 });
        const res = await user.get(`/fund?${query}`);
    });
});
