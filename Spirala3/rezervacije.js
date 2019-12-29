//SEKCIJA ---GLOBALNE VARIJABLE---
var trenutniMjesec = (new Date()).getMonth() + 1;
var trenutnaGodina = (new Date()).getYear() + 1900;
var pocniBojiti = false;
var naziviMjeseca = ["Januar","Februar","Mart","April","Maj","Juni","Juli","August","Septembar","Oktobar","Novembar","Decembar"];
var mjeseci = [31,28,31,30,31,30,31,31,30,31,30,31,30,31];
if( (trenutnaGodina % 4 == 0 && trenutnaGodina % 100 != 0) || (trenutnaGodina % 100 == 0 && trenutnaGodina % 400 == 0) || trenutnaGodina % 400 == 0 ) mjeseci[1]++;
window.onload = Pozivi.dobaviZauzeca();

//SEKCIJA ---POMOCNE FUNKCIJE---
function unosPocetak(){
	provjeriFormu();
	if( pocniBojiti ){
		Kalendar.obojiZauzeca( document.getElementById("kalendar"), trenutniMjesec, document.getElementById("listaSala").value, document.getElementById("pocetak").value, document.getElementById("kraj").value );
	}
}

function unosKraj(){
	provjeriFormu();
	if( pocniBojiti ){
		Kalendar.obojiZauzeca( document.getElementById("kalendar"), trenutniMjesec, document.getElementById("listaSala").value, document.getElementById("pocetak").value, document.getElementById("kraj").value );
	}
}

function unosSala(){
	provjeriFormu();
	if( pocniBojiti ){
		Kalendar.obojiZauzeca( document.getElementById("kalendar"), trenutniMjesec, document.getElementById("listaSala").value, document.getElementById("pocetak").value, document.getElementById("kraj").value );
	}
}




function clickSljedeci(){
	var nazivMjeseca = document.getElementById("nazivMjeseca");
	trenutniMjesec++;
	if( trenutniMjesec == 13 ) {
		trenutnaGodina++;
		mjeseci = [31,28,31,30,31,30,31,31,30,31,30,31,30,31];
		if( (trenutnaGodina % 4 == 0 && trenutnaGodina % 100 != 0) || (trenutnaGodina % 100 == 0 && trenutnaGodina % 400 == 0) || trenutnaGodina % 400 == 0 ) mjeseci[1]++;
		trenutniMjesec = 1;
	}
	nazivMjeseca.innerHTML = naziviMjeseca[trenutniMjesec-1] + " " + trenutnaGodina;
	Kalendar.iscrtajKalendar(document.getElementById("kalendar"),trenutniMjesec);
	provjeriFormu();
	if( pocniBojiti ){
		Kalendar.iscrtajKalendar( document.getElementById("kalendar"), trenutniMjesec );
		Kalendar.obojiZauzeca( document.getElementById("kalendar"), trenutniMjesec, document.getElementById("listaSala").value, document.getElementById("pocetak").value, document.getElementById("kraj").value );
	}
}

function clickPrethodni(){
	var nazivMjeseca = document.getElementById("nazivMjeseca");
	trenutniMjesec--;
	if( trenutniMjesec == 0 ) {
		trenutnaGodina--;
		mjeseci = [31,28,31,30,31,30,31,31,30,31,30,31,30,31];
		if( (trenutnaGodina % 4 == 0 && trenutnaGodina % 100 != 0) || (trenutnaGodina % 100 == 0 && trenutnaGodina % 400 == 0) || trenutnaGodina % 400 == 0 ) mjeseci[1]++;
		trenutniMjesec = 12;

	}
	nazivMjeseca.innerHTML = naziviMjeseca[trenutniMjesec-1] + " " + trenutnaGodina;
	Kalendar.iscrtajKalendar(document.getElementById("kalendar"),trenutniMjesec);
	provjeriFormu();
	if( pocniBojiti ){ 
		Kalendar.iscrtajKalendar( document.getElementById("kalendar"), trenutniMjesec );
		Kalendar.obojiZauzeca( document.getElementById("kalendar"), trenutniMjesec, document.getElementById("listaSala").value, document.getElementById("pocetak").value, document.getElementById("kraj").value );

	}
}

function provjeriFormu(){
	var pocetak = document.getElementById("pocetak");
	var kraj = document.getElementById("kraj");
	if(  pocetak.value != "" && kraj.value != "" && pocetak.value.match(/[0-9]{1,2}:[0-9]{1,2}/) && kraj.value.match(/[0-9]{1,2}:[0-9]{1,2}/) ) pocniBojiti = true; 
	else pocniBojiti = false;
}

function poklapanjeForma(sala,pocetak,kraj){
	var poklapanje = true;
	var salaForma = document.getElementById("listaSala").value;
	var pocetakForma = document.getElementById("pocetak").value;
	var krajForma = document.getElementById("kraj").value;
	var minutePocetakForma, minutePocetak, minuteKrajForma, minuteKraj;
	var pomocniString = pocetakForma.split(":");

	minutePocetakForma = parseInt(pomocniString[0])*60 + parseInt(pomocniString[1]);

	pomocniString = pocetak.split(":");
	minutePocetak = parseInt(pomocniString[0])*60 + parseInt(pomocniString[1]);

	pomocniString = krajForma.split(":");
	minuteKrajForma = parseInt(pomocniString[0])*60 + parseInt(pomocniString[1]);

	pomocniString = kraj.split(":");
	minuteKraj = parseInt(pomocniString[0])*60 + parseInt(pomocniString[1]);

	// Redom moguci slucajevi - testiranje presjeka dva vremenska intervala
	//Prvi slucaj predstavlja provjeru/validaciju da li je pocetak zaista ispred kraja
	if( minutePocetakForma >  minuteKrajForma ) return false;
	if( minuteKrajForma <= minutePocetak ) return false;
	if( minuteKraj <= minutePocetakForma ) return false;
	if( minutePocetakForma < minutePocetak && minutePocetak < minuteKrajForma ) return (sala == salaForma);
	if( minutePocetakForma < minuteKraj && minuteKraj < minuteKrajForma ) return (sala == salaForma);
	if( minutePocetak == minutePocetakForma && minutePocetakForma != minuteKrajForma ) return (sala == salaForma);
	if( minuteKrajForma == minuteKraj && minutePocetakForma != minuteKrajForma ) return (sala == salaForma);
	if( minutePocetakForma <= minutePocetak && minuteKraj <= minuteKrajForma ) return (sala == salaForma);
	if( minutePocetak <= minutePocetakForma && minuteKrajForma <= minuteKraj ) return (sala == salaForma);
}

function getval(celija) {
	//Prvo provjeravamo da li je odabrano pocetno i krajnje vrijeme
	var pocetakInput = document.getElementById("pocetak").value;
	var krajInput = document.getElementById("kraj").value;
	var datum = celija.innerHTML + "/" + trenutniMjesec + "/" + trenutnaGodina;
	var dropDownSale = document.getElementById("listaSala");
	var odabranaSala = dropDownSale.options[dropDownSale.selectedIndex].value;
	var checkboxVrijednost = document.getElementById("periodicnaRezervacija").checked;
	if( pocetakInput == "" || !pocetakInput.match(/[0-9]{1,2}:[0-9]{1,2}/) || krajInput == "" || !krajInput.match(/[0-9]{1,2}:[0-9]{1,2}/) )
		alert("---GREŠKA---\n\nOdaberite početno i krajnje vrijeme");
	else{
		//Provjeravamo da li je korisnik pritisnuo na crvenu celiju
		if( celija.classList.contains("zauzeto") ){
			if( checkboxVrijednost ){
				var dani = ["Ponedjeljak","Utorak","Srijeda","Četvrtak","Petak","Subota","Nedjelja"];
				var danUSedmici = (new Date(trenutnaGodina,trenutniMjesec-1,celija.innerHTML)).getDay();
				if( danUSedmici == 0 ) danUSedmici += 7;
				danUSedmici--;
				alert( "Nije moguće rezervisati salu " + odabranaSala + " za navedeni dan " + dani[danUSedmici] +" i termin od " + pocetakInput + " do " + krajInput +"!" );
			}
			else
				alert( "Nije moguće rezervisati salu " + odabranaSala + " za navedeni datum " + datum +" i termin od " + pocetakInput + " do " + krajInput +"!" );
		}
		else{
			datum = celija.innerHTML + "." + trenutniMjesec + "." + trenutnaGodina;
			if( checkboxVrijednost ){
				var dani = ["Ponedjeljak","Utorak","Srijeda","Četvrtak","Petak","Subota","Nedjelja"];
				var danUSedmici = (new Date(trenutnaGodina,trenutniMjesec-1,celija.innerHTML)).getDay();
				if( danUSedmici == 0 ) danUSedmici += 7;
				danUSedmici--;
				var potvrdaRezervacije = confirm("Odabrali ste sljedeći termin:\n\nTip rezervacije: Periodična rezervacija\nSala: " + odabranaSala + "\nPočetak: " + pocetakInput + "\nKraj: " + krajInput + "\nDan: " + dani[danUSedmici] + "\n\nDa li žeite rezervisati?");
				if( potvrdaRezervacije ){ 
				//Ovdje je korisnik odabrao OK, što znači da je potvrdio rezervaciju, te sada počinjemo rad sa serverom.
				Pozivi.rezervisiTermin(odabranaSala, pocetakInput, krajInput, datum, checkboxVrijednost);
			}
		}
		else{
			var potvrdaRezervacije = confirm("Odabrali ste sljedeći termin:\n\nTip rezervacije: Vanredna rezervacija\nSala: " + odabranaSala + "\nPočetak: " + pocetakInput + "\nKraj: " + krajInput + "\nDatum: " + datum + "\n\nDa li žeite rezervisati?");
			if( potvrdaRezervacije ){ 
				//Ovdje je korisnik odabrao OK, što znači da je potvrdio rezervaciju, te sada počinjemo rad sa serverom.
				Pozivi.rezervisiTermin(odabranaSala, pocetakInput, krajInput, datum, checkboxVrijednost);
			}

		}
	}
}
}