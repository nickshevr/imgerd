const should = require('should');

exports = module.exports = should;

should.Assertion.add(
    'objectWithAtTimespamp',
    function () {
        this.params = { operator: 'to have createdAt, updatedAt props' };

        const dbObject = this.obj;
        should.exists(dbObject);
        dbObject.should.be.an.Object;
        dbObject.should.have.properties(['createdAt', 'updatedAt']);
    },
    true
);

should.Assertion.add(
    'User',

    function () {
        this.params = { operator: 'to be a valid user' };

        const user = this.obj;
        should.exists(user);
        user.should.be.an.Object;
        user.should.be.a.objectWithAtTimespamp();
        user.should.have.properties(['id', 'username', 'createdAt', 'updatedAt']);
    },
    true
);

should.Assertion.add(
    'Tournament',

    function () {
        this.params = { operator: 'to be a valid tournament' };

        const user = this.obj;
        should.exists(user);
        user.should.be.an.Object;
        user.should.be.a.objectWithAtTimespamp();
        user.should.have.properties(['id', 'deposit', 'status', 'createdAt', 'updatedAt']);
    },
    true
);