const Sequelize = require("sequelize");
const sequelize = require("./db.js");


module.exports = function (sequelize, DataTypes) {
  const Sala = sequelize.define('Sala', {
   id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
   },
   naziv: {
      type: Sequelize.STRING
   }
}, {
   timestamps: false,
   freezeTableName: true
});
   return Sala;
}