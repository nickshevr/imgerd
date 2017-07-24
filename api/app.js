const express = require('express');
const config = require('config');
const bodyParser = require('body-parser');
const sequalizeInstace = require('../db/adapter');
const logger = require('winston');
const playerRoutes = require('./routes').playerRoutes.balanceCRUD;
const commonRoutes = require('./routes').commonRoutes.dropDb;
const tournamentRoutes = require('./routes').tournamentRoutes.tournamentsBase;
const models = require('../db/models');
const app = express();

app.use(bodyParser.json(config.get('bodyParser.json')));
app.use(bodyParser.urlencoded(config.get('bodyParser.urlencoded')));

app.use(commonRoutes);
app.use(playerRoutes);
app.use(tournamentRoutes);

app.use((req, res) => {
    res.status(404).json({ error: 404, message: 'route not found' });
});

app.use(function (err, req, res, next) {
    const errStatus = err.status ? err.status : err.statusCode;

    const response = {
        statusCode: errStatus,
        name: err.name,
        message: err.message
    };

    if (req.query.stack !== undefined) {
        response.stack = err.stack;
    }

    res.status(err.status || err.statusCode || 500).json(response);
    next();
});

const port = config.get('server').port;
const host = config.get('server').host;
// { force: true }
sequalizeInstace.sync().then((res) => {
    app.listen(port, host, function () {
        logger.info(`[Server]: Start server on port: ${port}`);
        logger.info(`under environment: ${process.env.NODE_ENV || 'default'}`);
        logger.info(`used db: ${config.get('db').name}`);
    });
});
