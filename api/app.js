const express = require('express');
const config = require('config');
const bodyParser = require('body-parser');
const logger = require('winston');
const morgan = require('morgan');
const ev = require('express-validation');

const sequalizeInstace = require('db/adapter');
const models = require('db/models');

const playerRoutes = require('./routes').playerRoutes.balanceCRUD;
const commonRoutes = require('./routes').commonRoutes.dropDb;
const tournamentRoutes = require('./routes').tournamentRoutes.tournamentsBase;

const app = express();

app.use(morgan('combined'));
app.use(bodyParser.json(config.get('bodyParser').json));
app.use(bodyParser.urlencoded(config.get('bodyParser').urlencoded));

app.use(commonRoutes);
app.use(playerRoutes);
app.use(tournamentRoutes);

app.post('/ha', (req, res, next) => {
    res.json({ ha: 'ha'});
});

app.use((req, res) => {
    res.status(404).json({ error: 404, message: 'route not found' });
});

app.use(function (err, req, res, next) {
    if (err instanceof ev.ValidationError) return res.status(err.status).json(err);

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
});

const port = config.get('server').port;
const host = config.get('server').host;

sequalizeInstace.sync(process.env.NODE_ENV === 'test' ? {} : { force: true })
    .then(res => {
        app.listen(port, host, () => {
            logger.info(`[Server]: Start server on port: ${port}`);
            logger.info(`under environment: ${process.env.NODE_ENV || 'default'}`);
            logger.info(`used db: ${config.get('db').name}`);
        });
    })
    .catch(err => logger.error(err));

module.exports = app;
