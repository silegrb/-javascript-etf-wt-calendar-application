const supertest = require("supertest");
const assert = require('assert');
const app = require("../index");
const Sequelize = require('sequelize');
const db = require('../db.js');

describe("\n---TESTIRANJE SERVERSKIH FUNKCIONALNOSTI---\n",function(){
	describe("\na) Testiranje GET /osoblje", function() {
		it("Uvijek se dobavljaju tri ili više osoba (inicijalni podaci)", function(done) {
			supertest(app)
			.get("/osoblje")
			.expect(200)
			.end(function(err, res){
				if (err) done(err);
				var brojOsoba = res.body.length;
				assert(brojOsoba >= 3,"Broj osoba mora biti minimalno 3, zbog inicijalnih podataka u postavci!");
				done();
			});
		});

		it("Dodavanje osobe poveća broj osoba dobavljenih zahtjevom GET /osoblje", function(done) {
			supertest(app)
			.get("/osoblje")
			.expect(200)
			.end(function(err, res){
				if (err) done(err);
				var brojOsobaPrijeDodavanja = res.body.length;
				db.Osoblje.create({
					id: 1987,
					ime: 'hesoyam',
					prezime: 'kjkszpj',
					uloga: 'aezakmi'
				});
				supertest(app)
				.get("/osoblje")
				.expect(200)
				.end(function(err1, res1){
					if (err) done(err);
					var brojOsobaPoslijeDodavanja = res1.body.length;
					assert(brojOsobaPrijeDodavanja + 1 == brojOsobaPoslijeDodavanja,"Dodavanja osobe nije registrovano!");
					db.Osoblje.destroy({
						where:{
							id: 1987
						}
					});
					done();
				});
			});
		});

	});

	describe("\nb) Testiranje GET /zauzeca", function() {
		it("Uvijek se dobavljaju dva ili više zauzeća (inicijalni podaci)", function(done) {
			supertest(app)
			.get("/zauzeca")
			.expect(200)
			.end(function(err, res){
				if (err) done(err);
				var brojZauzeca = res.body.periodicna.length + res.body.vanredna.length;
				assert(brojZauzeca >= 2,"Broj zauzeća mora biti minimalno 2, zbog inicijalnih podataka u postavci!");
				done();
			});
		});

		it("Dodavanje zauzeća poveća broj zauzeća dobavljenih zahtjevom GET /zauzeca", function(done) {
			supertest(app)
			.get("/zauzeca")
			.expect(200)
			.end(function(err, res){
				if (err) done(err);
				var brojZauzecaPrijeDodavanja = res.body.bazaRezervacije.length;
				db.Termin.create({
					id: 1987,
					redovni: true,
					dan: 1,
					datum: Sequelize.NULL,
					semestar: 'zimski',
					pocetak: '19:00',
					kraj: '19:01'
				}).then(function(ok){
					db.Rezervacija.create({
						id: 1987,
						osoba: 1,
						termin: 1987,
						sala: 1
					}).then(function(ok){
						supertest(app)
						.get("/zauzeca")
						.expect(200)
						.end(function(err1, res1){
							if (err) done(err);

							var brojZauzecaPoslijeDodavanja = res1.body.bazaRezervacije.length;
							assert(brojZauzecaPrijeDodavanja + 1 == brojZauzecaPoslijeDodavanja,"Dodavanja zauzeća nije registrovano!");
							db.Rezervacija.destroy({
								where:{
									id: 1987
								}
							}).then(function(ok){
								db.Termin.destroy({
									where:{
										id: 1987
									}
								});
								done();
							});


						});
					});


				});


			});
		});

		it("Brisanje zauzeća smanji broj zauzeća dobavljenih zahtjevom GET /zauzeca", function(done) {
			supertest(app)
			.get("/zauzeca")
			.expect(200)
			.end(function(err, res){
				if (err) done(err);
				var brojZauzecaPrijeBrisanja = res.body.bazaRezervacije.length;
				db.Rezervacija.destroy({
					where: {
						id: 1
					}
				}).then(function(ok){
					db.Termin.destroy({
						where: {
							id: 1
						}
					}).then(function(ok){
						supertest(app)
						.get("/zauzeca")
						.expect(200)
						.end(function(err1, res1){
							if (err) done(err);

							var brojZauzecaPoslijeBrisanja = res1.body.bazaRezervacije.length;
							assert(brojZauzecaPrijeBrisanja == brojZauzecaPoslijeBrisanja + 1,"Brisanje zauzeća nije registrovano!");
							db.Termin.create({
								id: 1,
								redovni: false,
								dan: Sequelize.NULL,
								datum: '01.01.2020',
								semestar: Sequelize.NULL,
								pocetak: '12:00',
								kraj: '13:00'
							}).then(function(ok){
								db.Rezervacija.create({
									id: 1,
									osoba: 1,
									termin: 1,
									sala: 1
								});
								done();
							});


						});
					});


				});


			});
		});
	});

	describe("\nc) Testiranje GET /sale", function() {
		it("Uvijek se dobavljaju dvije ili više sala (inicijalni podaci)", function(done) {
			supertest(app)
			.get("/sale")
			.expect(200)
			.end(function(err, res){
				if (err) done(err);
				var brojSala = res.body.length;
				assert(brojSala >= 2,"Broj sala mora biti minimalno 2, zbog inicijalnih podataka u postavci!");
				done();
			});
		});

		it("Dodavanje sale poveća broj sala dobavljenih zahtjevom GET /sale", function(done) {
			supertest(app)
			.get("/sale")
			.expect(200)
			.end(function(err, res){
				if (err) done(err);
				var brojSalaPrijeDodavanja = res.body.length;
				db.Osoblje.create({
					id: 1987,
					ime: 'hesoyam',
					prezime: 'kjkszpj',
					uloga: 'aezakmi'
				}).then(function(ok){
					db.Sala.create({
						id: 1987,
						naziv: '1-19',
						zaduzenaOsoba: 1987
					}).then(function(ok){
						supertest(app)
						.get("/sale")
						.expect(200)
						.end(function(err1, res1){
							if (err) done(err);
							var brojSalaPoslijeDodavanja = res1.body.length;
							assert(brojSalaPrijeDodavanja + 1 == brojSalaPoslijeDodavanja,"Dodavanja sale nije registrovano!");
							db.Sala.destroy({
								where:{
									id: 1987
								}
							}).then(function(ok){
								db.Osoblje.destroy({
									where: {
										id: 1987
									}
								});
								done();
							});
						});
					});
				});
				
			});
		});
	});

	describe("\nd) Testiranje POST /rezervacije", function() {
		it("Slanje POST /rezervacije bez podataka rezultira odgovorom \"---GREŠKA---\"", function(done){
			supertest(app)
			.post("/rezervacije")
			.send({})
			.expect(200)
			.end(function(err, res){
				assert( res.body.message == "---GREŠKA---" );
				done();
			});

		});

		it("Slanje POST /rezervacije sa pogrešnim formatom početka rezultira odgovorom \"---GREŠKA---\"", function(done){
			supertest(app)
			.post("/rezervacije")
			.send({
				datum: '01.01.2020',
				pocetak: '13:60',
				kraj: '14:00',
				naziv: '3-19',
				predavac: 'John Doe',
				checkboxChecked: 'false'
			})
			.expect(200)
			.end(function(err, res){
				assert( res.body.message == "---GREŠKA---" );
				done();
			});
		});

		it("Slanje POST /rezervacije sa pogrešnim formatom naziva sale rezultira odgovorom \"---GREŠKA---\"", function(done){
			supertest(app)
			.post("/rezervacije")
			.send({
				datum: '01.01.2020',
				pocetak: '13:30',
				kraj: '14:00',
				naziv: '04-9',
				predavac: 'John Doe',
				checkboxChecked: 'false'
			})
			.expect(200)
			.end(function(err, res){
				assert( res.body.message == "---GREŠKA---" );
				done();
			});
		});

		it("Slanje POST /rezervacije sa krajem ispred početka odgovorom \"---GREŠKA---\"", function(done){
			supertest(app)
			.post("/rezervacije")
			.send({
				datum: '01.01.2020',
				pocetak: '14:30',
				kraj: '14:00',
				naziv: '3-19',
				predavac: 'John Doe',
				checkboxChecked: 'false'
			})
			.expect(200)
			.end(function(err, res){
				assert( res.body.message == "---GREŠKA---" );
				done();
			});
		});

		it("Slanje POST /rezervacije sa ispravnim podacima rezulira odgovorom koji ne sadrži alertPoruka", function(done){
			supertest(app)
			.post("/rezervacije")
			.send({
				datum: '01.01.2077',
				pocetak: '13:30',
				kraj: '14:00',
				naziv: '1-15',
				predavac: 'Neko Nekić',
				checkboxChecked: 'false',
				obrisiZbogTestiranja: 'nebitanString'
			})
			.expect(200)
			.end(function(err, res){
				assert( !res.body.alertPoruka );
				done();
			});
		});

		it("Slanje POST /rezervacije sa inicijalnim podacima rezultira alertPoruka zbog duplanja termina", function(done){
			supertest(app)
			.post("/rezervacije")
			.send({
				datum: '01.01.2020',
				pocetak: '12:00',
				kraj: '13:00',
				naziv: '1-11',
				predavac: 'Neko Nekić',
				checkboxChecked: 'false',
				obrisiZbogTestiranja: 'nebitanString'
			})
			.expect(200)
			.end(function(err, res){
				assert( res.body.alertPoruka && res.body.alertPoruka == "Nije moguće rezervisati salu 1-11 za navedeni datum 01.01.2020 i termin od 12:00 do 13:00! Termin je rezervisao Neko Nekić." );
				done();
			});
		});
	});
});
