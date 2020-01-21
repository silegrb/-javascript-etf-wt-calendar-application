const Sequelize = require("sequelize");
const sequelize = require("./db.js");


module.exports = function (sequelize, DataTypes) {
  const Rezervacija = sequelize.define('Rezervacija', {
   id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
   }
}, {
   timestamps: false,
   freezeTableName: true
});
   return Rezervacija;
}