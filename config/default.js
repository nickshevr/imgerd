module.exports = {
    bodyParser: {
        json: {
            limit: '3mb'
        },
        urlencoded: {
            extended: false,
            limit: '10mb',
            parameterLimit: 10000
        }
    },
    server: {
        host: '127.0.0.1',
        port: 3040
    },
    db: {
        name: 'hello',
        user: 'test',
        password: 'test',
        host: '127.0.0.1'
    }
};
