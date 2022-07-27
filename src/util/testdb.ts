const Sequelize = require("sequelize");

const sequelizeTest = new Sequelize("node-poc-test", "node", "Node@123", {
  dialect: "mysql",
  host: "localhost",
});

module.exports = sequelizeTest;
