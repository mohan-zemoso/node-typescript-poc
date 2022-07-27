import Sequelize from "sequelize";
const sequelize = require("../util/database");

export type patientType = {
  id: number;
  name: string;
  gender: string;
  relation: string;
  destroy: () => any;
  save: () => any;
};

const Patient = sequelize.define("patient", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  gender: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  relation: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

module.exports = Patient;
