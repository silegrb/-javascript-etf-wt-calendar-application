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
		//Checkbox vrijednost nam je potrebna iz zahtjeva, ali nije potrebna za pravu rezervaciju
		var checkboxChecked = zahtjev.checkboxChecked;
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
	//Prvi slucaj predstavlja provjeru/validaciju da li je pocetak zaista ispred kraja
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
	//Prvi slucaj predstavlja provjeru/validaciju da li je pocetak zaista ispred kraja
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
	//Prvi slucaj predstavlja provjeru/validaciju da li je pocetak zaista ispred kraja
	if( minutePocetakZahtjev >  minuteKrajZahtjev ) poklapanje = true;
	if( minuteKrajZahtjev <= minutePocetak ) poklapanje = true;
	if( minuteKraj <= minutePocetakZahtjev ) poklapanje = true;
	if( minutePocetakZahtjev < minutePocetak && minutePocetak < minuteKrajZahtjev ) poklapanje = true;
	if( minutePocetakZahtjev < minuteKraj && minuteKraj < minuteKrajZahtjev ) poklapanje = true;
	if( minutePocetak == minutePocetakZahtjev && minutePocetakZahtjev != minuteKrajZahtjev ) poklapanje = true;
	if( minuteKrajZahtjev == minuteKraj && minutePocetakZahtjev != minuteKrajZahtjev ) poklapanje = true;
	if( minutePocetakZahtjev <= minutePocetak && minuteKraj <= minuteKrajZahtjev ) poklapanje = true;
	if( minutePocetak <= minutePocetakZahtjev && minuteKrajZahtjev <= minuteKraj ) poklapanje = true;

	if( periodicnaRezervacija.dan == danUSedmici && periodicnaRezervacija.naziv == zahtjev.naziv && poklapanje ){
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
	fs.readdir("./Slike/", (err, files) => {
		var povratniInfo = { slike:[] };
		var brojac = 0;
		files.forEach(file => {
			brojac++;
			povratniInfo.slike.push(file);
			if( brojac == 3 ) return;
		});
		res.json(povratniInfo);
	});

});

app.get("/izmjenaSlika",function(req,res){   
	fs.readdir("./Slike/", (err, files) => {
		var sveSlike = { slike:[] };
		files.forEach(file => {
			sveSlike.slike.push(file);
		});
		var povratniInfo = {slike:[],disableNazad:'NE',disableDalje:'NE'};
		if( req.query.jesteDalje == 1 ){
			var indexDalje = -1;
			for( var i = 0; i < sveSlike.slike.length; i++ ){
				if( req.query.treca == sveSlike.slike[i] ){
					indexDalje = i + 1;
					break;
				}
			}
			if( indexDalje + 3 > sveSlike.slike.length - 1 ) povratniInfo.disableDalje = 'DA';
			for( var i = indexDalje; i < sveSlike.slike.length; i++ )
				povratniInfo.slike.push( sveSlike.slike[i] );
			res.json(povratniInfo);
		}
		else{
			var indexNazad = -1;
			for( var i = 0; i < sveSlike.slike.length; i++ ){
				if( req.query.prva == sveSlike.slike[i] ){
					indexNazad = i - 1;
					break;
				}
			}
			if( indexNazad == 2 ) povratniInfo.disableNazad = 'DA';
			for( var i = indexNazad - 2; i <= indexNazad; i++ )
				povratniInfo.slike.push( sveSlike.slike[i] );
			res.json(povratniInfo);			
		}
	});

});

app.listen(8080);