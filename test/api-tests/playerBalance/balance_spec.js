const request = require('supertest');
const app = require('api/app');
const qs = require('qs');
const user = request.agent(app);
const sequalizeInstace = require('db/adapter');

describe('#{GET} /balance', () => {
    before(async function() {
        await sequalizeInstace.sync({ force: true });
    });

    it(`Should return error if user doesn't exist`, async () => {

    });

    it(`Should return json with player balance`, async () => {

    });
});
