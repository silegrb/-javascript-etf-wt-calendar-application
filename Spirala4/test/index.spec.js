const supertest = require("supertest");
const assert = require('assert');
const app = require("../index");
const Sequelize = require('sequelize');
const db = require('../db.js');
const Osoblje = db.import("../Osoblje.js");
const Rezervacija = db.import("../Rezervacija.js");
const Termin = db.import("../Termin.js");
const Sala = db.import("../Sala.js");

describe("\n---TESTIRANJE SERVERSKIH FUNKCIONALNOSTI---\n",function(){
	describe("\nTestiranje GET /osoblje", function() {
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

		it("Dodavanje osobe povećava broj osoba dobavljenih zahtjevom GET /osoblje", function(done) {
			supertest(app)
			.get("/osoblje")
			.expect(200)
			.end(function(err, res){
				if (err) done(err);
				var brojOsobaPrijeDodavanja = res.body.length;
				Osoblje.create({
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
					assert(brojOsobaPrijeDodavanja + 1 == brojOsobaPoslijeDodavanja,"Broj osoba mora biti minimalno 3, zbog inicijalnih podataka u postavci!");
					Osoblje.destroy({
						where:{
							ime: 'hesoyam',
							prezime: 'kjkszpj',
							uloga: 'aezakmi'
						}
					});
					done();
				});
			});
		});
	});
});