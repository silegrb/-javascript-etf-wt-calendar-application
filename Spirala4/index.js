const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();

const Sequelize = require('sequelize');
const db = require('./db.js');
db.waitDb(
	() => {
		app.listen(8080);
	}
	);

//Sekcija ---HTML---
const pocetna_HTML = "/pocetna.html";
const sale_HTML = "/sale.html";
const unos_HTML = "/unos.html";
const rezervacije_HTML = "/rezervacije.html";
const osobe_HTML = "/osobe.html";

//Sekcija ---CSS---
const pocetna_CSS = "/pocetna.css";
const sale_CSS = "/sale.css";
const unos_CSS = "/unos.css";
const rezervacije_CSS = "/rezervacije.css";
const osobe_CSS = "/osobe.css";

//Sekcija ---JS---
const kalendar_JS = "/kalendar.js";
const rezervacije_JS = "/rezervacije.js";
const osobe_JS = "/osobe.js";
const pozivi_JS = "/pozivi.js";
const pocetna_JS = "/pocetna.js";


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//U public se nalaze samo slike
app.use(express.static('public'));


//Sekcija ---HTML ZAHTJEVI---
app.get("/",function(req,res){        
	res.sendFile(__dirname + pocetna_HTML );
});

app.get(pocetna_HTML,function(req,res){        
	res.sendFile(__dirname + pocetna_HTML );
});

app.get(sale_HTML,function(req,res){        
	res.sendFile(__dirname + sale_HTML );
});

app.get(unos_HTML,function(req,res){        
	res.sendFile(__dirname + unos_HTML );
});

app.get(rezervacije_HTML,function(req,res){        
	res.sendFile(__dirname + rezervacije_HTML );
});

app.get(osobe_HTML,function(req,res){        
	res.sendFile(__dirname + osobe_HTML );
});



//Sekcija ---CSS ZAHTJEVI---
app.get(pocetna_CSS,function(req,res){        
	res.sendFile(__dirname + pocetna_CSS );
});

app.get(sale_CSS,function(req,res){        
	res.sendFile(__dirname + sale_CSS );
});

app.get(unos_CSS,function(req,res){        
	res.sendFile(__dirname + unos_CSS );
});

app.get(rezervacije_CSS,function(req,res){        
	res.sendFile(__dirname + rezervacije_CSS );
});

app.get(osobe_CSS,function(req,res){        
	res.sendFile(__dirname + osobe_CSS );
});


//Sekcija ---JS ZAHTJEVI---
app.get(pozivi_JS,function(req,res){        
	res.sendFile(__dirname + pozivi_JS );
});

app.get(pocetna_JS,function(req,res){        
	res.sendFile(__dirname + pocetna_JS );
});


app.get(kalendar_JS,function(req,res){        
	res.sendFile(__dirname + kalendar_JS );
});

app.get(rezervacije_JS,function(req,res){        
	res.sendFile(__dirname + rezervacije_JS );
});

app.get(osobe_JS,function(req,res){        
	res.sendFile(__dirname + osobe_JS );
});


//Sekcija ---SLIKE ZAHTJEVI---
app.get("/logolav.jpg",function(req,res){        
	res.sendFile(__dirname + "/logolav.jpg" );
});


app.get("/zauzeca",function(req,res){   
	db.Rezervacija.findAll().then(function(results){
		var REZERVACIJE = {
			bazaRezervacije: [],
			periodicna:[],
			vanredna:[]
		};
		for( var i = 0; i < results.length; i++ ){
			REZERVACIJE.bazaRezervacije.push({
				termin: results[i].termin,
				sala: results[i].sala,
				osoba: results[i].osoba,

			});
		}

		db.Osoblje.findAll().then(function(resultsOsoblje){
			for( var i = 0; i < resultsOsoblje.length; i++ ){
				for( var j = 0; j < REZERVACIJE.bazaRezervacije.length; j++ )
					if( resultsOsoblje[i].id == REZERVACIJE.bazaRezervacije[j].osoba )
						REZERVACIJE.bazaRezervacije[j].osoba = resultsOsoblje[i].ime + " " + resultsOsoblje[i].prezime;
				}
			});

		db.Sala.findAll().then(function(resultsSala){
			for( var i = 0; i < resultsSala.length; i++ ){
				for( var j = 0; j < REZERVACIJE.bazaRezervacije.length; j++ )
					if( resultsSala[i].id == REZERVACIJE.bazaRezervacije[j].sala )
						REZERVACIJE.bazaRezervacije[j].sala = resultsSala[i].naziv;
				}
			});

		db.Termin.findAll().then(function(resultsTermin){
			for( var i = 0; i < resultsTermin.length; i++ ){
				for( var j = 0; j < REZERVACIJE.bazaRezervacije.length; j++ )
					if( resultsTermin[i].id == REZERVACIJE.bazaRezervacije[j].termin ){
						if( resultsTermin[i].redovni){
							var pocetakHelp = resultsTermin[i].pocetak.split(":");
							var formatiraniPocetak = pocetakHelp[0] + ":" + pocetakHelp[1];
							var krajHelp = resultsTermin[i].kraj.split(":");
							var formatiraniKraj = krajHelp[0] + ":" + krajHelp[1];
							REZERVACIJE.periodicna.push({
								dan: resultsTermin[i].dan,
								semestar: resultsTermin[i].semestar,
								pocetak: formatiraniPocetak,
								kraj: formatiraniKraj,
								naziv: REZERVACIJE.bazaRezervacije[j].sala,
								predavac: REZERVACIJE.bazaRezervacije[j].osoba
							});
						}
						else{
							var pocetakHelp = resultsTermin[i].pocetak.split(":");
							var formatiraniPocetak = pocetakHelp[0] + ":" + pocetakHelp[1];
							var krajHelp = resultsTermin[i].kraj.split(":");
							var formatiraniKraj = krajHelp[0] + ":" + krajHelp[1];
							REZERVACIJE.vanredna.push({
								datum: resultsTermin[i].datum,
								pocetak: formatiraniPocetak,
								kraj: formatiraniKraj,
								naziv: REZERVACIJE.bazaRezervacije[j].sala,
								predavac: REZERVACIJE.bazaRezervacije[j].osoba
							});
						}
					}
				}
				res.json(REZERVACIJE);
			});
		
	});
});


app.post("/rezervacije",function(req,res){        
	db.Rezervacija.findAll().then(function(results){
		var REZERVACIJE = {
			bazaRezervacije: [],
			periodicna:[],
			vanredna:[]
		};
		for( var i = 0; i < results.length; i++ ){
			REZERVACIJE.bazaRezervacije.push({
				termin: results[i].termin,
				sala: results[i].sala,
				osoba: results[i].osoba,

			});
		}

		db.Osoblje.findAll().then(function(resultsOsoblje){
			for( var i = 0; i < resultsOsoblje.length; i++ ){
				for( var j = 0; j < REZERVACIJE.bazaRezervacije.length; j++ )
					if( resultsOsoblje[i].id == REZERVACIJE.bazaRezervacije[j].osoba )
						REZERVACIJE.bazaRezervacije[j].osoba = resultsOsoblje[i].ime + " " + resultsOsoblje[i].prezime;
				}
			});

		db.Sala.findAll().then(function(resultsSala){
			for( var i = 0; i < resultsSala.length; i++ ){
				for( var j = 0; j < REZERVACIJE.bazaRezervacije.length; j++ )
					if( resultsSala[i].id == REZERVACIJE.bazaRezervacije[j].sala )
						REZERVACIJE.bazaRezervacije[j].sala = resultsSala[i].naziv;
				}
			});

		db.Termin.findAll().then(function(resultsTermin){
			for( var i = 0; i < resultsTermin.length; i++ ){
				for( var j = 0; j < REZERVACIJE.bazaRezervacije.length; j++ )
					if( resultsTermin[i].id == REZERVACIJE.bazaRezervacije[j].termin ){
						if( resultsTermin[i].redovni){
							var pocetakHelp = resultsTermin[i].pocetak.split(":");
							var formatiraniPocetak = pocetakHelp[0] + ":" + pocetakHelp[1];
							var krajHelp = resultsTermin[i].kraj.split(":");
							var formatiraniKraj = krajHelp[0] + ":" + krajHelp[1];
							REZERVACIJE.periodicna.push({
								dan: resultsTermin[i].dan,
								semestar: resultsTermin[i].semestar,
								pocetak: formatiraniPocetak,
								kraj: formatiraniKraj,
								naziv: REZERVACIJE.bazaRezervacije[j].sala,
								predavac: REZERVACIJE.bazaRezervacije[j].osoba
							});
						}
						else{
							var pocetakHelp = resultsTermin[i].pocetak.split(":");
							var formatiraniPocetak = pocetakHelp[0] + ":" + pocetakHelp[1];
							var krajHelp = resultsTermin[i].kraj.split(":");
							var formatiraniKraj = krajHelp[0] + ":" + krajHelp[1];
							REZERVACIJE.vanredna.push({
								datum: resultsTermin[i].datum,
								pocetak: formatiraniPocetak,
								kraj: formatiraniKraj,
								naziv: REZERVACIJE.bazaRezervacije[j].sala,
								predavac: REZERVACIJE.bazaRezervacije[j].osoba
							});
						}
					}
				}
				let zahtjev = req.body;
				//Provjera parametara za POSTMAN!!!
				if( zahtjev.pocetak && zahtjev.kraj && ((zahtjev.dan && zahtjev.semestar && zahtjev.trenutnaGodina && zahtjev.trenutniMjesec) || zahtjev.datum) && zahtjev.checkboxChecked && zahtjev.naziv ){

					var regexPocetak = zahtjev.pocetak.match(/^(0[0-9]|1[0-9]|2[0-3]|[0-9]):[0-5][0-9]$/);
					var regexKraj = zahtjev.kraj.match(/^(0[0-9]|1[0-9]|2[0-3]|[0-9]):[0-5][0-9]$/);
					var regexDatumWrong = (zahtjev.datum && !zahtjev.datum.match(/^([0-9]|[0-2][0-9]|3[0-1])\.(0[0-9]|[0-9]|1[0-2])\.(\d{4})$/));
					var regexDanWrong = (zahtjev.dan && !zahtjev.dan.toString().match(/^[0-6]$/));
					var checkboxWrong = (zahtjev.checkboxChecked != "true" && zahtjev.checkboxChecked != "false");
					var regexSala = zahtjev.naziv.match(/^[0-3]-[0-9]{1,2}$/);
					var semestarWrong = ( zahtjev.semestar && ( zahtjev.semestar != "ljetnji" && zahtjev.semestar != "zimski" ) );
					var trenutniMjesecWrong = ( zahtjev.trenutniMjesec && !zahtjev.trenutniMjesec.toString().match(/^(0?[1-9]|1[012])$/) );
					var trenutnaGodinaWrong = ( zahtjev.trenutnaGodina && !zahtjev.trenutnaGodina.toString().match(/^[0-9]{1,4}$/) );
					var pocetakIspredKraja = true;
					if( regexPocetak && regexKraj ){
						var pomocniPocetak = zahtjev.pocetak.split(":");
						var pomocniKraj = zahtjev.kraj.split(":");
						var pocetakSat = parseInt(pomocniPocetak[0]), krajSat = parseInt(pomocniKraj[0]), pocetakMinute = parseInt(pomocniPocetak[1]), krajMinute = parseInt(pomocniKraj[1]);
						if( pocetakSat > krajSat ) pocetakIspredKraja = false;
						if( pocetakSat == krajSat && pocetakMinute >= krajMinute ) pocetakIspredKraja = false;
					}
					if( !regexSala || regexDanWrong  || regexDatumWrong || checkboxWrong  || !regexPocetak || !regexKraj || semestarWrong || trenutniMjesecWrong || trenutnaGodinaWrong || !pocetakIspredKraja ){
						res.send({message: "---GREŠKA---"});
						return;
					}
				}
				else{
					res.send({message: "---GREŠKA---"});
					return;
				}

					//Checkbox vrijednost nam je potrebna iz zahtjeva, ali nije potrebna za pravu rezervaciju
					var checkboxChecked = (zahtjev.checkboxChecked == "true");
					var rezervacija = {};
					if( checkboxChecked ){
						for (var i = 0; i < REZERVACIJE.periodicna.length; i++) {
							var periodicnaRezervacija = REZERVACIJE.periodicna[i];
							var poklapanje = ispitajPoklapanjeVremenskihIntervala(periodicnaRezervacija.pocetak, periodicnaRezervacija.kraj, zahtjev.pocetak, zahtjev.kraj);

							if( periodicnaRezervacija.dan == zahtjev.dan && periodicnaRezervacija.semestar == zahtjev.semestar && periodicnaRezervacija.naziv == zahtjev.naziv && poklapanje ){
								var dani = ["Ponedjeljak","Utorak","Srijeda","Četvrtak","Petak","Subota","Nedjelja"];
								var alertText = "Nije moguće rezervisati salu " + zahtjev.naziv + " za navedeni dan " + dani[zahtjev.dan] +" i termin od " + zahtjev.pocetak + " do " + zahtjev.kraj +"! Termin je rezervisao " + zahtjev.predavac + ".";
								REZERVACIJE.alertPoruka = alertText;
								res.json(REZERVACIJE);
								return;
							}
						}

						for (var i = 0; i < REZERVACIJE.vanredna.length; i++) {
							var vanrednaRezervacija = REZERVACIJE.vanredna[i];
							var poklapanje = ispitajPoklapanjeVremenskihIntervala(vanrednaRezervacija.pocetak, vanrednaRezervacija.kraj, zahtjev.pocetak, zahtjev.kraj);
							var pomocniDatum = vanrednaRezervacija.datum.split(".");
							var dan = parseInt( pomocniDatum[0] ), mjesec = parseInt(pomocniDatum[1]), godina = parseInt(pomocniDatum[2]);
							var danUSedmici = (new Date(godina,mjesec-1,dan)).getDay();
							if( danUSedmici == 0 ) danUSedmici += 7;
							var poklapanjeSaFormom = false;
							if( zahtjev.trenutniMjesec == mjesec && zahtjev.trenutnaGodina == godina ) poklapanjeSaFormom = true;
							danUSedmici--;


							if( danUSedmici == zahtjev.dan && poklapanjeSaFormom && vanrednaRezervacija.naziv == zahtjev.naziv && poklapanje ){
								var dani = ["Ponedjeljak","Utorak","Srijeda","Četvrtak","Petak","Subota","Nedjelja"];

								var alertText = "Nije moguće rezervisati salu " + zahtjev.naziv + " za navedeni dan " + dani[zahtjev.dan] +" i termin od " + zahtjev.pocetak + " do " + zahtjev.kraj + "! Termin je rezervisao " + vanrednaRezervacija.predavac + ".";
								REZERVACIJE.alertPoruka = alertText;
								res.json(REZERVACIJE);
								return;
							}
						}
						REZERVACIJE.periodicna.push({
							dan: zahtjev.dan,
							semestar: zahtjev.semestar,
							pocetak: zahtjev.pocetak,
							kraj: zahtjev.kraj,
							naziv: zahtjev.naziv,
							predavac: zahtjev.predavac
						});
						
						//#################################
						//### DODAVANJE PODATAKA U BAZU ###
						//#################################

						db.Termin.create({
							redovni: true,
							dan: zahtjev.dan,
							datum: Sequelize.NULL,
							semestar: zahtjev.semestar,
							pocetak: zahtjev.pocetak,
							kraj: zahtjev.kraj
						}).then(function (ok) {
							db.Termin.findAll().then(function(resultsTermini){
								var terminFk = resultsTermini[resultsTermini.length-1].id;
								db.Sala.findAll().then(function (pronadjeneSale){
									var salaFk;
									for( var i = 0; i < pronadjeneSale.length; i++ )
										if( pronadjeneSale[i].naziv == zahtjev.naziv )
											salaFk = pronadjeneSale[i].id;
										var helpString = zahtjev.predavac.split(" ");
										db.Osoblje.findAll().then(function(pronadjeneOsobe){
											var osobaFk;
											for( var i = 0; i < pronadjeneOsobe.length; i++ )
												if( pronadjeneOsobe[i].ime == helpString[0] && pronadjeneOsobe[i].prezime == helpString[1] )
													osobaFk = pronadjeneOsobe[i].id;
												db.Rezervacija.create({
													sala: salaFk,
													osoba: osobaFk,
													termin: terminFk
												}).then(function (ok){
													if( zahtjev.obrisiZbogTestiranja ){
														db.Rezervacija.destroy({
															where:{
																sala: salaFk,
																osoba: osobaFk,
																termin: terminFk
															}
														}).then(function(ok){
															db.Termin.destroy({
																where:{
																	redovni: true,
																	dan: zahtjev.dan,
																	semestar: zahtjev.semestar,
																	pocetak: zahtjev.pocetak,
																	kraj: zahtjev.kraj
																}
															});
														});
													}
												});
											});
									});
							});
						});

						//#################################
						//### DODAVANJE PODATAKA U BAZU ###
						//#################################


						res.json(REZERVACIJE);
						return;
					}	
					else{
		//Prvo provjeravamo poklapanje sa vanrednom rezervacijom
		for (var i = 0; i < REZERVACIJE.vanredna.length; i++) {
			var vanrednaRezervacija = REZERVACIJE.vanredna[i];
			var poklapanje = ispitajPoklapanjeVremenskihIntervala(vanrednaRezervacija.pocetak, vanrednaRezervacija.kraj, zahtjev.pocetak, zahtjev.kraj);
			var pomocniString = zahtjev.datum.split(".");
			var datumVanrednaFormatiran = "";
			if( pomocniString[0].length == 1 ) datumVanrednaFormatiran += "0";
			datumVanrednaFormatiran += pomocniString[0] + ".";
			if( pomocniString[1].length == 1 ) datumVanrednaFormatiran += "0";
			datumVanrednaFormatiran += pomocniString[1] + "." + pomocniString[2];
			if( vanrednaRezervacija.datum == datumVanrednaFormatiran && poklapanje && vanrednaRezervacija.naziv == zahtjev.naziv  ){
				var alertText = "Nije moguće rezervisati salu " + zahtjev.naziv + " za navedeni datum " + zahtjev.datum +" i termin od " + zahtjev.pocetak + " do " + zahtjev.kraj + "! Termin je rezervisao " + vanrednaRezervacija.predavac + ".";
				REZERVACIJE.alertPoruka = alertText;
				res.json(REZERVACIJE);
				return;
			}
		}
		//Provjeravmo da li je pokusao napraviti vanrednu rezervaciju u terminu periodicne rezervacije koja je napravljena u medjuvremenu
		for (var i = 0; i < REZERVACIJE.periodicna.length; i++) {
			var periodicnaRezervacija = REZERVACIJE.periodicna[i];
			var parsiraniDatum = zahtjev.datum.split(".");
			var dan = parsiraniDatum[0], mjesec = parsiraniDatum[1], godina = parsiraniDatum[2];
			var danUSedmici = (new Date(godina,mjesec-1,dan)).getDay();
			if( danUSedmici == 0 ) danUSedmici += 7;
			danUSedmici--;
			var pravilanSemestar = false;
			if( periodicnaRezervacija.semestar == "ljetnji" && mjesec >= 2 && mjesec <= 6 ) pravilanSemestar = true;
			if( periodicnaRezervacija.semestar == "zimski" && (mjesec >= 10 && mjesec <= 12) || mjesec == 1 ) pravilanSemestar = true;

			var poklapanje = ispitajPoklapanjeVremenskihIntervala(periodicnaRezervacija.pocetak, periodicnaRezervacija.kraj, zahtjev.pocetak, zahtjev.kraj);
			
			if( periodicnaRezervacija.dan == danUSedmici && pravilanSemestar && periodicnaRezervacija.naziv == zahtjev.naziv && poklapanje ){
				var alertText = "Nije moguće rezervisati salu " + zahtjev.naziv + " za navedeni datum " + zahtjev.datum +" i termin od " + zahtjev.pocetak + " do " + zahtjev.kraj + "! Termin je rezervisao " + periodicnaRezervacija.predavac + ".";
				REZERVACIJE.alertPoruka = alertText;
				res.json(REZERVACIJE);
				return;
			}
		}
		REZERVACIJE.vanredna.push({
			datum: zahtjev.datum,
			pocetak: zahtjev.pocetak,
			kraj: zahtjev.kraj,
			naziv: zahtjev.naziv,
			predavac: zahtjev.predavac
		});
						//#################################
						//### DODAVANJE PODATAKA U BAZU ###
						//#################################

						var helpDatum = zahtjev.datum.split(".");
						var formatiraniDatum = "";
						if( helpDatum[0].length == 1 ) formatiraniDatum += "0";
						formatiraniDatum += helpDatum[0] + ".";
						if( helpDatum[1].length == 1 ) formatiraniDatum += "0";
						formatiraniDatum += helpDatum[1] + "." + helpDatum[2];

						db.Termin.create({
							redovni: false,
							dan: Sequelize.NULL,
							datum: formatiraniDatum,
							semestar: Sequelize.NULL,
							pocetak: zahtjev.pocetak,
							kraj: zahtjev.kraj
						}).then(function (ok) {
							db.Termin.findAll().then(function(resultsTermini){
								var terminFk = resultsTermini[resultsTermini.length-1].id;
								db.Sala.findAll().then(function (pronadjeneSale){
									var salaFk;
									for( var i = 0; i < pronadjeneSale.length; i++ )
										if( pronadjeneSale[i].naziv == zahtjev.naziv )
											salaFk = pronadjeneSale[i].id;
										var helpString = zahtjev.predavac.split(" ");
										db.Osoblje.findAll().then(function(pronadjeneOsobe){
											var osobaFk;
											for( var i = 0; i < pronadjeneOsobe.length; i++ )
												if( pronadjeneOsobe[i].ime == helpString[0] && pronadjeneOsobe[i].prezime == helpString[1] )
													osobaFk = pronadjeneOsobe[i].id;
												db.Rezervacija.create({
													sala: salaFk,
													osoba: osobaFk,
													termin: terminFk
												}).then(function (ok){
													if( zahtjev.obrisiZbogTestiranja ){
														db.Rezervacija.destroy({
															where:{
																sala: salaFk,
																osoba: osobaFk,
																termin: terminFk
															}
														}).then(function(ok){
															db.Termin.destroy({
																where:{
																	redovni: false,
																	datum: formatiraniDatum,
																	pocetak: zahtjev.pocetak,
																	kraj: zahtjev.kraj
																}
															});
														});
													}
												});
											});
									});
							});
						});

						//#################################
						//### DODAVANJE PODATAKA U BAZU ###
						//#################################

						res.json(REZERVACIJE);
					}


				});

});
});


app.get("/inicijalneSlike",function(req,res){   
	fs.readdir("./public/", (err, files) => {
		var povratniInfo = { slike:[], neZovemVise: 'DA' };
		var brojac = 0;
		files.forEach(file => {
			brojac++;
			if( brojac > 3 ){
				povratniInfo.neZovemVise = 'NE'
				return;
			} 
			povratniInfo.slike.push(file);
		});
		res.json(povratniInfo);
	});

});

app.get("/izmjenaSlika",function(req,res){   
	fs.readdir("./public/", (err, files) => {
		var zahtjev = req.query;
		var sveSlike = {slike:[]};
		files.forEach(file => {
			sveSlike.slike.push(file);
		});
		var povratniInfo = {slike:[],disableNazad:'NE',disableDalje:'NE', neZovemVise: 'NE'};
		var indexDalje = -1;
		for( var i = 0; i < sveSlike.slike.length; i++ ){
			if( zahtjev.treca == sveSlike.slike[i] ){
				indexDalje = i + 1;
				break;
			}
		}
		if( indexDalje + 3 > sveSlike.slike.length - 1 ) povratniInfo.disableDalje = 'DA';
		var brojac = 0;
		for( var i = indexDalje; i < sveSlike.slike.length; i++ ){
			brojac++;
			povratniInfo.slike.push( sveSlike.slike[i] );
			if( brojac == 3 ) break;
		}
		if( povratniInfo.slike.length < 3 || (povratniInfo.slike.length == 3 && povratniInfo.disableDalje == 'DA') )
			povratniInfo.neZovemVise = 'DA';
		res.json(povratniInfo);
	});


});


app.get("/osoblje",function(req,res){        
	db.Osoblje.findAll().then(function(results){
		res.send(results);
	});
});

app.get("/tabelaOsoblja",function(req,res){        
	db.Osoblje.findAll().then(function(results){
		db.Rezervacija.findAll().then(function(resultsRezervacije){
			var nizOsoba = {osobe:[ ]};
			for( var i = 0; i < results.length; i++ )
				nizOsoba.osobe.push({
					id: results[i].id,
					ime: results[i].ime,
					prezime: results[i].prezime,
					uloga: results[i].uloga,
					moguceSale: [],
					trenutneSale: [],
					moguciTermini: []
				});

			for( var i = 0; i < nizOsoba.osobe.length; i++ )
				for( var j = 0; j < resultsRezervacije.length; j++ )
					if( nizOsoba.osobe[i].id == resultsRezervacije[j].osoba ){
						nizOsoba.osobe[i].moguciTermini.push( resultsRezervacije[j].termin );
						nizOsoba.osobe[i].moguceSale.push( resultsRezervacije[j].sala );
					}
					
					db.Termin.findAll().then(function(resultsTermini){
						for( var i = 0; i < nizOsoba.osobe.length; i++ )
							for( var j = 0; j < resultsTermini.length; j++ )
								for( var k = 0; k < nizOsoba.osobe[i].moguciTermini.length; k++ )
									if( nizOsoba.osobe[i].moguciTermini[k] == resultsTermini[j].id ){
										var trenutniDatum = new Date();
										var trenutnoMinuta = trenutniDatum.getHours()*60 + trenutniDatum.getMinutes();
										var helpString = resultsTermini[j].pocetak.split(":");
										var pocetakMinuta = parseInt(helpString[0]) * 60 + parseInt(helpString[1]);
										helpString = resultsTermini[j].kraj.split(":");
										var krajMinuta = parseInt(helpString[0]) * 60 + parseInt(helpString[1]);
										if( trenutnoMinuta >= pocetakMinuta && trenutnoMinuta <= krajMinuta ){
											var insert = 0;
											if( resultsTermini[j].datum ){
												var helpDatum = resultsTermini[j].datum.split(".");
												if( trenutniDatum.getDate() == parseInt(helpDatum[0]) && trenutniDatum.getMonth() + 1 == parseInt(helpDatum[1]) && trenutniDatum.getYear() + 1900  == parseInt(helpDatum[2]) )
													insert = 1;
											}
											else{
												var danUSedmici = trenutniDatum.getDay();
												if( danUSedmici == 0 ) danUSedmici += 7;
												danUSedmici--;

												if( danUSedmici == resultsTermini[j].dan && resultsTermini[j].semestar == 'zimski' && ((trenutniDatum.getMonth() + 1 >= 10 && trenutniDatum.getMonth() + 1 <= 12) || trenutniDatum.getMonth() + 1 == 1)  )
													insert = 1;
												else if( danUSedmici == resultsTermini[j].dan && resultsTermini[j].semetar == 'ljetnji' && (trenutniDatum.getMonth() + 1 >= 2 && trenutniDatum.getMonth() + 1 <= 6) )
													insert = 1;
											}
											if( insert ) nizOsoba.osobe[i].trenutneSale.push( nizOsoba.osobe[i].moguceSale[k] );
										}
									}
									db.Sala.findAll().then(function(resultsSale){
										for( var i = 0; i < nizOsoba.osobe.length; i++ )
											for( var j = 0; j < resultsSale.length; j++ )
												for( var k = 0; k < nizOsoba.osobe[i].trenutneSale.length; k++ )
													if( nizOsoba.osobe[i].trenutneSale && nizOsoba.osobe[i].trenutneSale[k] == resultsSale[j].id )
														nizOsoba.osobe[i].trenutneSale[k] = resultsSale[j].naziv;
													res.send(nizOsoba);
												});

								});
				}); 
	}); 
});

app.get("/sale",function(req,res){        
	db.Sala.findAll().then(function(results){
		res.send(results);
	});
});

function ispitajPoklapanjeVremenskihIntervala( pocetak, kraj, pocetakZahtjev, krajZahtjev ){
	var poklapanje = false;
	var minutePocetakZahtjev, minutePocetak, minuteKrajZahtjev, minuteKraj;
	var pomocniString = pocetakZahtjev.split(":");
	minutePocetakZahtjev = parseInt(pomocniString[0])*60 + parseInt(pomocniString[1]);
	pomocniString = pocetak.split(":");
	minutePocetak = parseInt(pomocniString[0])*60 + parseInt(pomocniString[1]);
	pomocniString = krajZahtjev.split(":");
	minuteKrajZahtjev = parseInt(pomocniString[0])*60 + parseInt(pomocniString[1]);
	pomocniString = kraj.split(":");
	minuteKraj = parseInt(pomocniString[0])*60 + parseInt(pomocniString[1]);

// Redom moguci slucajevi - testiranje presjeka dva vremenska intervala
if( minutePocetakZahtjev >  minuteKrajZahtjev ) poklapanje = true;
if( minuteKrajZahtjev <= minutePocetak ) poklapanje = true;
if( minuteKraj <= minutePocetakZahtjev ) poklapanje = true;
if( minutePocetakZahtjev < minutePocetak && minutePocetak < minuteKrajZahtjev ) poklapanje = true;
if( minutePocetakZahtjev < minuteKraj && minuteKraj < minuteKrajZahtjev ) poklapanje = true;
if( minutePocetak == minutePocetakZahtjev && minutePocetakZahtjev != minuteKrajZahtjev ) poklapanje = true;
if( minuteKrajZahtjev == minuteKraj && minutePocetakZahtjev != minuteKrajZahtjev ) poklapanje = true;
if( minutePocetakZahtjev <= minutePocetak && minuteKraj <= minuteKrajZahtjev ) poklapanje = true;
if( minutePocetak <= minutePocetakZahtjev && minuteKrajZahtjev <= minuteKraj ) poklapanje = true;
return poklapanje;
}


module.exports = app;