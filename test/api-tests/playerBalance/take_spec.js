const request = require('supertest');
const app = require('api/app');
const qs = require('qs');
const user = request.agent(app);

describe('#{GET} /take', () => {
    before(async function() {
        await user.get('/reset');
    });

    describe('Wrong query params', () => {
        it(`Should return error query without playerId`, async () => {
            const query = qs.stringify({ point: 300 });
            const res = await user.get(`/take?${query}`);

            //console.log(res);
        });

        it(`Should return error query without point`, async () => {
            const query = qs.stringify({ playerId: 1 });
            const res = await user.get(`/take?${query}`);

            //console.log(res.body);
        });
    });

    it(`Should return error user doesn't exist`, async () => {
        const query = qs.stringify({ playerId: 1, point: 300 });
        const res = await user.get(`/take?${query}`);
    });

    describe(`Should return error point param is not valid`, () => {
        it(`Point is't valid int`, async () => {
        });

        it(`Point isn't gt 0`, async () => {
        });
    });

    it(`Should return error if user balance become lt 0`, async () => {
        const query = qs.stringify({ playerId: 1, point: 300 });
        const res = await user.get(`/take?${query}`);
    });

    it(`Should degree player balance by point param amount`, async () => {
        const query = qs.stringify({ playerId: 1, point: 300 });
        const res = await user.get(`/take?${query}`);
    });
});
