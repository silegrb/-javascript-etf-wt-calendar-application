const Sequelize = require("sequelize");
const sequelize = new Sequelize("DBWT19","root","root",{host:"localhost",dialect:"mysql",logging:false});
const db={};

db.Sequelize = Sequelize;  
db.sequelize = sequelize;



db.Osoblje = sequelize.import(__dirname+"/Osoblje.js");
db.Rezervacija = sequelize.import(__dirname+"/Rezervacija.js");
db.Termin = sequelize.import(__dirname+"/Termin.js");
db.Sala = sequelize.import(__dirname+"/Sala.js");

db.Osoblje.hasMany(db.Rezervacija,{foreignKey: {
	name: 'osoba',
	type: Sequelize.INTEGER
}});


db.Termin.hasMany(db.Rezervacija,{foreignKey: {
	name: 'termin',
	type: Sequelize.INTEGER,
	unique: true
}});


db.Sala.hasMany(db.Rezervacija,{foreignKey: {
	name: 'sala',
	type: Sequelize.INTEGER
}});


db.Osoblje.hasOne(db.Sala,{foreignKey: {
	name: 'zaduzenaOsoba',
	type: Sequelize.INTEGER
}});
db.Sala.belongsTo(db.Osoblje,{foreignKey: 'zaduzenaOsoba'});

db.Rezervacija.belongsTo(db.Osoblje,{foreignKey: 'osoba'});
db.Rezervacija.belongsTo(db.Termin,{foreignKey: 'termin'});
db.Rezervacija.belongsTo(db.Sala,{foreignKey: 'sala'});

function inicializacija(){
	var osoba1,osoba2,osoba3;
	var osobeListaPromisea=[];
	var saleListaPormisea=[];
	var terminiListaPromisea=[];
	var rezervacijeListaPromisea=[];
	return new Promise(function(resolve,reject){
		osobeListaPromisea.push(db.Osoblje.create({id:1, ime:'Neko',prezime: 'Nekić', uloga: 'profesor'},{ignoreDuplicates: true}));
		osobeListaPromisea.push(db.Osoblje.create({id:2, ime:'Drugi',prezime: 'Neko', uloga: 'asistent'},{ignoreDuplicates: true}));
		osobeListaPromisea.push(db.Osoblje.create({id:3, ime:'Test',prezime: 'Test', uloga: 'asistent'},{ignoreDuplicates: true}));
		Promise.all(osobeListaPromisea).then(function(osobe){

			saleListaPormisea.push(
				db.Sala.create({id:1, naziv:'1-11', zaduzenaOsoba:1},{ignoreDuplicates: true}).then(function(k){
					return new Promise(function(resolve,reject){resolve(k);});
				})
				);
			saleListaPormisea.push(
				db.Sala.create({id:2, naziv:'1-15', zaduzenaOsoba:2},{ignoreDuplicates: true}).then(function(k){
					return new Promise(function(resolve,reject){resolve(k);});
				})
				);

			Promise.all(saleListaPormisea).then(function(knjige){
				terminiListaPromisea.push(
					db.Termin.create({
						id: 1,
						redovni: false,
						dan: Sequelize.NULL,
						datum: '01.01.2020',
						semestar: Sequelize.NULL,
						pocetak: '12:00',
						kraj: '13:00'
					},{ignoreDuplicates: true}).then(function(k){
						return new Promise(function(resolve,reject){resolve(k);});
					})
					);
				terminiListaPromisea.push(
					db.Termin.create({
						id: 2,
						redovni: true,
						dan: 0,
						datum: Sequelize.NULL,
						semestar: 'zimski',
						pocetak: '13:00',
						kraj: '14:00'
					},{ignoreDuplicates: true}).then(function(k){
						return new Promise(function(resolve,reject){resolve(k);});
					})
					);			
				Promise.all(terminiListaPromisea).then(function(b){
					rezervacijeListaPromisea.push(
						db.Rezervacija.create({
							id: 1,
							osoba: 1,
							termin: 1,
							sala: 1
						},{ignoreDuplicates: true}).then(function(k){
							return new Promise(function(resolve,reject){resolve(k);});
						})
						);	

					rezervacijeListaPromisea.push(
						db.Rezervacija.create({
							id: 2,
							osoba: 3,
							termin: 2,
							sala: 1
						},{ignoreDuplicates: true}).then(function(k){
							return new Promise(function(resolve,reject){resolve(k);});
						})
						);

					Promise.all(rezervacijeListaPromisea).then(function(x){resolve(x);}).catch(function(err){console.log("Biblioteke greska "+err);});
				}).catch(function(err){console.log("Biblioteke greska "+err);});
			}).catch(function(err){console.log("Knjige greska "+err);});
		}).catch(function(err){console.log("Autori greska "+err);});   
	});
}


function waitDb(callback){
	db.sequelize.sync().then(function(){
		inicializacija().then(function(){
			callback();
		});
	});
}

db.waitDb = waitDb;

module.exports = db;
