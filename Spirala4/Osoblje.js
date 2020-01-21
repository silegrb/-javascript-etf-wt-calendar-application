const Sequelize = require("sequelize");
const sequelize = require("./db.js");


module.exports = function (sequelize, DataTypes) {
  const Osoblje = sequelize.define('Osoblje', {
   id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
   },
   ime: {
      type: Sequelize.STRING
   },
   prezime: {
      type: Sequelize.STRING
   },
   uloga: {
      type: Sequelize.STRING
   }
}, {
   timestamps: false,
   freezeTableName: true
});
   return Osoblje;
}