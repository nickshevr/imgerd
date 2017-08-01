const sequalizeInstace = require('db/adapter');
const Player = require('db/models').Player;

describe('Player model', () => {
    before(async function() {
        await sequalizeInstace.sync({ force: true });
    });

    describe(`updatePlayerBalance`, async () => {
        before(async () => {
            await Player.create({
                id: 1
            })
        })

        it(`Should return json with player balance`, async () => {
            const player = await Player.findOne({ where: { id: 1 }});

            const res = await player.updateCurrentBalance(-200);


            const updatedPlayer = await Player.findOne({ where: { id: 1 }});
            updatedPlayer.currentBalance.should.be.equal(200);
        });
    });
});
