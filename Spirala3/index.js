const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();

//Sekcija ---HTML---
const pocetna_HTML = "/pocetna.html";
const sale_HTML = "/sale.html";
const unos_HTML = "/unos.html";
const rezervacije_HTML = "/rezervacije.html";

//Sekcija ---CSS---
const pocetna_CSS = "/pocetna.css";
const sale_CSS = "/sale.css";
const unos_CSS = "/unos.css";
const rezervacije_CSS = "/rezervacije.css";

//Sekcija ---JS---
const kalendar_JS = "/kalendar.js";
const rezervacije_JS = "/rezervacije.js";
const pozivi_JS = "/pozivi.js";
const pocetna_JS = "/pocetna.js";


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//U public se nalaze samo slike koji trebaju za Zadatak3
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


//Sekcija ---SLIKE ZAHTJEVI---

app.get("/logolav.jpg",function(req,res){        
	res.sendFile(__dirname + "/logolav.jpg" );
});


//---ZADATAK 1---
app.get("/zauzeca",function(req,res){        
	res.sendFile(__dirname + "/zauzeca.json" );
});


//---ZADATAK 2---
app.post("/rezervacije",function(req,res){        
	let zahtjev = req.body;
	fs.readFile('zauzeca.json', (err, data) => {
		if (err) throw err;
		var rezervacije = JSON.parse(data);

		//Provjera parametara za POSTMAN!!!
		var regexPocetak = zahtjev.pocetak.match(/^(0[0-9]|1[0-9]|2[0-3]|[0-9]):[0-5][0-9]$/);
		var regexKraj = zahtjev.kraj.match(/^(0[0-9]|1[0-9]|2[0-3]|[0-9]):[0-5][0-9]$/);
		var regexDatumWrong = (zahtjev.datum && !zahtjev.datum.match(/^([0-9]|[0-2][0-9]|3[0-1])\.(0[0-9]|[0-9]|1[0-2])\.(\d{4})$/));
		var regexDanWrong = (zahtjev.dan && !zahtjev.dan.toString().match(/^[0-6]$/));
		var checkboxWrong = (zahtjev.checkboxChecked != "true" && zahtjev.checkboxChecked != "false");
		var regexSala = zahtjev.naziv.match(/^[0-3]-0[0-9]$/);
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
		 res.send("---GREŠKA---");
		 return;
		}
		
		//Checkbox vrijednost nam je potrebna iz zahtjeva, ali nije potrebna za pravu rezervaciju
		var checkboxChecked = (zahtjev.checkboxChecked == "true");
		var rezervacija = {};
		if( checkboxChecked ){
			for (var i = 0; i < rezervacije.periodicna.length; i++) {
				var periodicnaRezervacija = rezervacije.periodicna[i];
				var poklapanje = false;
				var pocetak = periodicnaRezervacija.pocetak;
				var kraj = periodicnaRezervacija.kraj;
				var pocetakZahtjev = zahtjev.pocetak;
				var krajZahtjev = zahtjev.kraj;
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
	
	if( periodicnaRezervacija.dan == zahtjev.dan && periodicnaRezervacija.semestar == zahtjev.semestar && periodicnaRezervacija.naziv == zahtjev.naziv && poklapanje ){
		var dani = ["Ponedjeljak","Utorak","Srijeda","Četvrtak","Petak","Subota","Nedjelja"];
		var alertText = "Nije moguće rezervisati salu " + zahtjev.naziv + " za navedeni dan " + dani[zahtjev.dan] +" i termin od " + zahtjev.pocetak + " do " + zahtjev.kraj +"!";
		fs.writeFile('zauzeca.json', JSON.stringify(rezervacije), function(err){
			if(err) throw err;
		});
		rezervacije.alertPoruka = alertText;

		res.json(rezervacije);
		return;
	}
}

for (var i = 0; i < rezervacije.vanredna.length; i++) {
	var vanrednaRezervacija = rezervacije.vanredna[i];
	var poklapanje = false;
	var pocetak = vanrednaRezervacija.pocetak;
	var kraj = vanrednaRezervacija.kraj;
	var pocetakZahtjev = zahtjev.pocetak;
	var krajZahtjev = zahtjev.kraj;
	var minutePocetakZahtjev, minutePocetak, minuteKrajZahtjev, minuteKraj;
	var pomocniString = pocetakZahtjev.split(":");
	var pomocniDatum = vanrednaRezervacija.datum.split(".");
	var dan = parseInt( pomocniDatum[0] ), mjesec = parseInt(pomocniDatum[1]), godina = parseInt(pomocniDatum[2]);
	var danUSedmici = (new Date(godina,mjesec-1,dan)).getDay();
	if( danUSedmici == 0 ) danUSedmici += 7;
	var poklapanjeSaFormom = false;
	if( zahtjev.trenutniMjesec == mjesec && zahtjev.trenutnaGodina == godina ) poklapanjeSaFormom = true;
	danUSedmici--;
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
	
	if( danUSedmici == zahtjev.dan && poklapanjeSaFormom && vanrednaRezervacija.naziv == zahtjev.naziv && poklapanje ){
		var dani = ["Ponedjeljak","Utorak","Srijeda","Četvrtak","Petak","Subota","Nedjelja"];

		var alertText = "Nije moguće rezervisati salu " + zahtjev.naziv + " za navedeni dan " + dani[zahtjev.dan] +" i termin od " + zahtjev.pocetak + " do " + zahtjev.kraj +"!";
		fs.writeFile('zauzeca.json', JSON.stringify(rezervacije), function(err){
			if(err) throw err;
		});
		rezervacije.alertPoruka = alertText;

		res.json(rezervacije);
		return;
	}
}
rezervacije.periodicna.push({
	dan: zahtjev.dan,
	semestar: zahtjev.semestar,
	pocetak: zahtjev.pocetak,
	kraj: zahtjev.kraj,
	naziv: zahtjev.naziv,
	predavac: zahtjev.predavac
});
fs.writeFile('zauzeca.json', JSON.stringify(rezervacije), function(err){
	if(err) throw err;
});
res.json(rezervacije);
return;
}
else{
			//Prvo provjeravamo poklapanje sa vanrednom rezervacijom
			for (var i = 0; i < rezervacije.vanredna.length; i++) {
				var vanrednaRezervacija = rezervacije.vanredna[i];
				var poklapanje = false;
				var pocetak = vanrednaRezervacija.pocetak;
				var kraj = vanrednaRezervacija.kraj;
				var pocetakZahtjev = zahtjev.pocetak;
				var krajZahtjev = zahtjev.kraj;
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

	if( vanrednaRezervacija.datum == zahtjev.datum && poklapanje && vanrednaRezervacija.naziv == zahtjev.naziv  ){
		var alertText = "Nije moguće rezervisati salu " + zahtjev.naziv + " za navedeni datum " + zahtjev.datum +" i termin od " + zahtjev.pocetak + " do " + zahtjev.kraj +"!";
		fs.writeFile('zauzeca.json', JSON.stringify(rezervacije), function(err){
			if(err) throw err;
		});
		rezervacije.alertPoruka = alertText;
		res.json(rezervacije);
		return;
	}
}
			//Provjeravmo da li je pokusao napraviti vanrednu rezervaciju u terminu periodicne rezervacije koja je napravljena u medjuvremenu
			for (var i = 0; i < rezervacije.periodicna.length; i++) {
				var periodicnaRezervacija = rezervacije.periodicna[i];
				var parsiraniDatum = zahtjev.datum.split(".");
				var dan = parsiraniDatum[0], mjesec = parsiraniDatum[1], godina = parsiraniDatum[2];
				var danUSedmici = (new Date(godina,mjesec-1,dan)).getDay();
				if( danUSedmici == 0 ) danUSedmici += 7;
				danUSedmici--;
				var pravilanSemestar = false;
				if( periodicnaRezervacija.semestar == "ljetnji" && mjesec >= 2 && mjesec <= 6 ) pravilanSemestar = true;
				if( periodicnaRezervacija.semestar == "zimski" && (mjesec >= 10 && mjesec <= 12) || mjesec == 1 ) pravilanSemestar = true;

				var poklapanje = false;
				var pocetak = periodicnaRezervacija.pocetak;
				var kraj = periodicnaRezervacija.kraj;
				var pocetakZahtjev = zahtjev.pocetak;
				var krajZahtjev = zahtjev.kraj;
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

	if( periodicnaRezervacija.dan == danUSedmici && pravilanSemestar && periodicnaRezervacija.naziv == zahtjev.naziv && poklapanje ){
		var alertText = "Nije moguće rezervisati salu " + zahtjev.naziv + " za navedeni datum " + zahtjev.datum +" i termin od " + zahtjev.pocetak + " do " + zahtjev.kraj +"!";
		fs.writeFile('zauzeca.json', JSON.stringify(rezervacije), function(err){
			if(err) throw err;
		});
		rezervacije.alertPoruka = alertText;
		res.json(rezervacije);
		return;
	}
}
rezervacije.vanredna.push({
	datum: zahtjev.datum,
	pocetak: zahtjev.pocetak,
	kraj: zahtjev.kraj,
	naziv: zahtjev.naziv,
	predavac: zahtjev.predavac
});
fs.writeFile('zauzeca.json', JSON.stringify(rezervacije), function(err){
	if(err) throw err;
});
res.json(rezervacije);
}
});
});


//---ZADATAK 3---
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

app.listen(8080);