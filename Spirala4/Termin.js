const Sequelize = require("sequelize");
const sequelize = require("./db.js");


module.exports = function (sequelize, DataTypes) {
  const Termin = sequelize.define('Termin', {
 
   redovni: {
      type: Sequelize.BOOLEAN
   },
   dan: {
      type: Sequelize.INTEGER
   },
   datum: {
      type: Sequelize.STRING
   },
   semestar: {
      type: Sequelize.STRING
   },
   pocetak: {
      type: Sequelize.TIME
   },
   kraj: {
      type: Sequelize.TIME
   }
}, {
   timestamps: false,
   freezeTableName: true
});
   return Termin;
}