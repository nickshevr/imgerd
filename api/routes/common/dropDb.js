const Sequelize = require('sequelize');
const { Router } = require('express');
const logger = require('winston');
const sequelizeInstance = require('../../../db/adapter');

const newRouter = new Router();

newRouter.get('/reset',
    async (req, res, next) => {
        const tables = await dropAllTables();

        res.json({
            droppedTables: tables
        });
    });

async function dropAllTables() {
    try {
        const tables = await sequelizeInstance.queryInterface.showAllTables();

        await sequelizeInstance.queryInterface.dropAllTables();
        logger.info("DROPPED TABLES", tables);

        return tables;
    } catch(e) {
        logger.error(e);
    }
}

module.exports = newRouter;
