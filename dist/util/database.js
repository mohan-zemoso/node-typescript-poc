"use strict";
const SequelizeDB = require("sequelize");
const sequelize = new SequelizeDB("node-poc", "node", "Node@123", {
    dialect: "mysql",
    host: "localhost",
});
module.exports = sequelize;
