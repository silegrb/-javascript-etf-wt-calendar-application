
//SEKCIJA ---GLOBALNE VARIJABLE---
var trenutniMjesec = (new Date()).getMonth() + 1;
var pocniBojiti = false;
var naziviMjeseca = ["Januar","Februar","Mart","April","Maj","Juni","Juli","August","Septembar","Oktobar","Novembar","Decembar"];
var mjeseci = [31,28,31,30,31,30,31,31,30,31,30,31,30,31];

//SEKCIJA ---KREIRANJE HARDCODED PODATAKA---
var periodicne = [];
var vanredne = [];

//redovnaRezervacija je neispravna zbog pocetka u 12:60 (da je 12:00, utorak ljetnjeg semestra bi trebao biti popunjen, ali nece jer je ignorisan zbog nevalidnosti)
var redovnaRezervacija1 = { dan: 1, semestar: "ljetnji", pocetak: "12:60", kraj: "13:30", naziv: "0-01", predavac: "Vensada Okanovic" };
var redovnaRezervacija2 = { dan: 4, semestar: "zimski", pocetak: "19:20", kraj: "19:55", naziv: "1-01", predavac: "Haris Supic" };
var redovnaRezervacija3 = { dan: 0, semestar: "ljetnji", pocetak: "12:00", kraj: "13:00", naziv: "0-01", predavac: "Vedran Ljubovic" };
//vanrednaRezervacija3 je nevalidna jer ne postoji 31. juni... (juni ima 30 dana)
//vanrednaRezervacija4 je nevalidna jer ne postoji sala 7-01
var vanrednaRezervacija1 = { datum: "19.10.2019", pocetak: "15:00", kraj: "16:45", naziv: "1-01", predavac: "Dzenana Djonko" };
var vanrednaRezervacija2 = { datum: "19.10.2019", pocetak: "19:25", kraj: "20:00", naziv: "1-01", predavac: "Vensada Okanovic" };
var vanrednaRezervacija3 = { datum: "31.6.2019", pocetak: "13:00", kraj: "13:30", naziv: "0-01", predavac: "Vensada Okanovic" };
var vanrednaRezervacija4 = { datum: "13.04.2019", pocetak: "12:00", kraj: "13:30", naziv: "7-01", predavac: "Vensada Okanovic" };
var vanrednaRezervacija5 = { datum: "13.03.2019", pocetak: "11:00", kraj: "13:30", naziv: "2-01", predavac: "Vensada Okanovic" };

periodicne.push(redovnaRezervacija1);
periodicne.push(redovnaRezervacija2);
periodicne.push(redovnaRezervacija3);
vanredne.push(vanrednaRezervacija1);
vanredne.push(vanrednaRezervacija2);
vanredne.push(vanrednaRezervacija3);
vanredne.push(vanrednaRezervacija4);
vanredne.push(vanrednaRezervacija5);

//IMPLEMENTACIJA "Kalendar"
let Kalendar = (function(){

	var nizPeriodicnihRezervacija = [];
	var nizVandrednihRezervacija = [];

	function obojiZauzecaImpl(kalendarRef, mjesec, sala, pocetak, kraj){
		var noMatch = true;
		for( var i = 0; i < nizPeriodicnihRezervacija.length; i++ ){
		//Poklapaju li se informacije sa forme?
		var trenutniSemestar = "raspust";
		if( (trenutniMjesec >= 10 && trenutniMjesec <= 12) || trenutniMjesec == 1 ) trenutniSemestar = "zimski";
		if( trenutniMjesec >= 2 && trenutniMjesec <= 6 ) trenutniSemestar = "ljetnji";
		if( poklapanjeForma( nizPeriodicnihRezervacija[i].naziv, nizPeriodicnihRezervacija[i].pocetak, nizPeriodicnihRezervacija[i].kraj ) && trenutniSemestar == nizPeriodicnihRezervacija[i].semestar ){
			noMatch = false;
			//Da li se trenutni mjesec nalazi u semestru ove rezervacije?
			
			
				//Tek sad bojimo tabelu na osnovu dana
				for (var j = 2, row; row = kalendarRef.rows[j]; j++) {
					for (var k = 0, col; col = row.cells[k]; k++) {
						if( col.innerHTML != "" && k == nizPeriodicnihRezervacija[i].dan ){
							col.classList.remove("slobodno");
							col.classList.add("zauzeto");
						}
					}  
				}

			}
		}

		if( noMatch ){
			iscrtajKalendarImpl(document.getElementById("kalendar"),trenutniMjesec);
		}

		var newNoMatch = true;
		for( var i = 0; i < nizVandrednihRezervacija.length; i++ ){
		//Poklapaju li se informacije sa forme?
		var splitDatuma = nizVandrednihRezervacija[i].datum.split(".");
		var dan = splitDatuma[0];
		var mjesec = parseInt(splitDatuma[1]);
		if( poklapanjeForma( nizVandrednihRezervacija[i].naziv, nizVandrednihRezervacija[i].pocetak, nizVandrednihRezervacija[i].kraj ) && mjesec == trenutniMjesec ){
			noMatch = false;
			newNoMatch = false;
			//Da li se trenutni mjesec nalazi u semestru ove rezervacije?
				//Tek sad bojimo tabelu na osnovu dana
				for (var j = 2, row; row = kalendarRef.rows[j]; j++) {
					for (var k = 0, col; col = row.cells[k]; k++) {
						if( col.innerHTML == dan){
							col.classList.remove("slobodno");
							col.classList.add("zauzeto");
						}
					}  
				}
				
			}
		}

		if( noMatch ){
			iscrtajKalendarImpl(document.getElementById("kalendar"),trenutniMjesec);
		}

		if( newNoMatch ){
			iscrtajKalendarImpl(document.getElementById("kalendar"),trenutniMjesec);
			for( var i = 0; i < nizPeriodicnihRezervacija.length; i++ ){
		//Poklapaju li se informacije sa forme?
		var trenutniSemestar = "raspust";
		if( (trenutniMjesec >= 10 && trenutniMjesec <= 12) || trenutniMjesec == 1 ) trenutniSemestar = "zimski";
		if( trenutniMjesec >= 2 && trenutniMjesec <= 6 ) trenutniSemestar = "ljetnji";
		if( poklapanjeForma( nizPeriodicnihRezervacija[i].naziv, nizPeriodicnihRezervacija[i].pocetak, nizPeriodicnihRezervacija[i].kraj ) && trenutniSemestar == nizPeriodicnihRezervacija[i].semestar ){
			noMatch = false;
			//Da li se trenutni mjesec nalazi u semestru ove rezervacije?
			
			
				//Tek sad bojimo tabelu na osnovu dana
				for (var j = 2, row; row = kalendarRef.rows[j]; j++) {
					for (var k = 0, col; col = row.cells[k]; k++) {
						if( col.innerHTML != "" && k == nizPeriodicnihRezervacija[i].dan ){
							col.classList.remove("slobodno");
							col.classList.add("zauzeto");
						}
					}  
				}

			}
		}

		if( noMatch ){
			iscrtajKalendarImpl(document.getElementById("kalendar"),trenutniMjesec);
		}
	}
}

function ucitajPodatkeImpl(redovna, vanredna){

	nizPeriodicnihRezervacija = [];
	nizVandrednihRezervacija = [];

	for( var i = 0; i < redovna.length; i++ ){
		var sale = document.getElementById('listaSala');
		var salaNadjena = false;
			for(var j = 0; j < sale.length; j++) {
				if( sale[j].value == redovna[i].naziv )
					salaNadjena = true;
			}

		if( salaNadjena && redovna[i].pocetak.match(/^(0[0-9]|1[0-9]|2[0-3]|[0-9]):[0-5][0-9]$/) && redovna[i].kraj.match(/^(0[0-9]|1[0-9]|2[0-3]|[0-9]):[0-5][0-9]$/) )
			nizPeriodicnihRezervacija.push( redovna[i] );
	}
	for( var i = 0; i < vanredna.length; i++ ){
		var sale = document.getElementById('listaSala');
		var salaNadjena = false;
			for(var j = 0; j < sale.length; j++) 
				if( sale[j].value == vanredna[i].naziv )
					salaNadjena = true;

		if( salaNadjena && vanredna[i].datum.match(/^([0-9]|[0-2][0-9]|3[0-1])\.(0[0-9]|[0-9]|1[0-2])\.(\d{4})$/) && vanredna[i].pocetak.match(/^(0[0-9]|1[0-9]|2[0-3]|[0-9]):[0-5][0-9]$/) && vanredna[i].kraj.match(/^(0[0-9]|1[0-9]|2[0-3]|[0-9]):[0-5][0-9]$/)  ){
			var datumSplit = vanredna[i].datum.split(".");
			if( datumSplit[0] <= mjeseci[datumSplit[1] - 1]  )
				nizVandrednihRezervacija.push( vanredna[i] );
		}
	}

}

function iscrtajKalendarImpl(kalendarRef, mjesec){

	var nazivMjeseca = document.getElementById("nazivMjeseca");
	nazivMjeseca.innerHTML = naziviMjeseca[trenutniMjesec-1];
	if( trenutniMjesec == 1 ) document.getElementById("prethodni").disabled = true;
	if( trenutniMjesec == 12 ) document.getElementById("sljedeci").disabled = true;

	for(var i = kalendarRef.rows.length - 1; i > 0; i--)
	{
		kalendarRef.deleteRow(i);
	}
	
	var d = new Date(2019,mjesec-1,1);
	var danSedmice = d.getDay();
	var start = 1;
	var dani = ["PON","UTO","SRI","ČET","PET","SUB","NED"];
	var red = kalendarRef.insertRow( kalendarRef.rows.length );
	for( var i = 0; i < 7; i++ ){
		var celija = red.insertCell(i);
		celija.innerHTML = dani[i];
		celija.classList.add("dani");
	}
	if( danSedmice == 0 ) danSedmice += 7;
	while( true ){
		var i = 0
		var noviRed = kalendarRef.insertRow( kalendarRef.rows.length );
		if( start == 1 ){
			while( i < danSedmice - 1){
				var novaCelija = noviRed.insertCell(i++);
				novaCelija.innerHTML = "";
			}
		} 
		var flagIzlazi = false;
		for( ;i < 7; i++ ){
			var novaCelija = noviRed.insertCell(i);

			novaCelija.innerHTML = start++;
			novaCelija.classList.add("slobodno");
			if( start > mjeseci[mjesec-1] ){
				flagIzlazi = true;
				break;
			}
		}
		if(flagIzlazi) break;
	}
}

return {
	obojiZauzeca: obojiZauzecaImpl,
	ucitajPodatke: ucitajPodatkeImpl,
	iscrtajKalendar: iscrtajKalendarImpl
}

}());

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


window.onload = Kalendar.ucitajPodatke(periodicne,vanredne);
window.onload = Kalendar.iscrtajKalendar(document.getElementById("kalendar"),trenutniMjesec);

function clickSljedeci(){
	var nazivMjeseca = document.getElementById("nazivMjeseca");

	if( trenutniMjesec != 12){
		if( trenutniMjesec == 1 ) document.getElementById("prethodni").disabled = false;
		trenutniMjesec++;
		if( trenutniMjesec == 12 ) document.getElementById("sljedeci").disabled = true;
		nazivMjeseca.innerHTML = naziviMjeseca[trenutniMjesec-1];
		Kalendar.iscrtajKalendar(document.getElementById("kalendar"),trenutniMjesec);
		provjeriFormu();
		if( pocniBojiti ){
			Kalendar.iscrtajKalendar( document.getElementById("kalendar"), trenutniMjesec );
			Kalendar.obojiZauzeca( document.getElementById("kalendar"), trenutniMjesec, document.getElementById("listaSala").value, document.getElementById("pocetak").value, document.getElementById("kraj").value );
		}
	}
	else{
		document.getElementById("sljedeci").disabled = true;
	}
}

function clickPrethodni(){
	if( trenutniMjesec != 1 ){
		if( trenutniMjesec == 12 ) document.getElementById("sljedeci").disabled = false;
		trenutniMjesec--;
		if( trenutniMjesec == 1 ) document.getElementById("prethodni").disabled = true;
		nazivMjeseca.innerHTML = naziviMjeseca[trenutniMjesec-1];
		Kalendar.iscrtajKalendar(document.getElementById("kalendar"),trenutniMjesec);
		provjeriFormu();
		if( pocniBojiti ){ 
			Kalendar.iscrtajKalendar( document.getElementById("kalendar"), trenutniMjesec );
			Kalendar.obojiZauzeca( document.getElementById("kalendar"), trenutniMjesec, document.getElementById("listaSala").value, document.getElementById("pocetak").value, document.getElementById("kraj").value );

		}
	}
	else{
		document.getElementById("prethodni").disabled = true;
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
