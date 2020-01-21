
const Sequelize = require("sequelize");


const db = new Sequelize("DBWT19", "root", "root", {
   host: "localhost",
   dialect: "mysql",
    logging: false
});


const Osoblje = db.import(__dirname+"/Osoblje.js");
const Rezervacija = db.import(__dirname+"/Rezervacija.js");
const Termin = db.import(__dirname+"/Termin.js");
const Sala = db.import(__dirname+"/Sala.js");

Osoblje.hasMany(Rezervacija,{foreignKey: {
	name: 'osoba',
	type: Sequelize.INTEGER
}});


Termin.hasMany(Rezervacija,{foreignKey: {
	name: 'termin',
	type: Sequelize.INTEGER,
	unique: true
}});


Sala.hasMany(Rezervacija,{foreignKey: {
	name: 'sala',
	type: Sequelize.INTEGER
}});


Osoblje.hasMany(Sala,{foreignKey: {
	name: 'zaduzenaOsoba',
	type: Sequelize.INTEGER
}});
Sala.belongsTo(Osoblje,{foreignKey: 'zaduzenaOsoba'});

Rezervacija.belongsTo(Osoblje,{foreignKey: 'osoba'});
Rezervacija.belongsTo(Termin,{foreignKey: 'termin'});
Rezervacija.belongsTo(Sala,{foreignKey: 'sala'});


module.exports = db;
