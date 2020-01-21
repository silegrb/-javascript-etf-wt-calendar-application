//IMPLEMENTACIJA "Kalendar"
let Kalendar = (function(){

	var nizPeriodicnihRezervacija = [];
	var nizVandrednihRezervacija = [];

	function obojiZauzecaImpl(kalendarRef, mjesec, sala, pocetak, kraj){
		iscrtajKalendarImpl(document.getElementById("kalendar"),trenutniMjesec);
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
		var dan = parseInt(splitDatuma[0]);
		var mjesec = parseInt(splitDatuma[1]);
		var godina = parseInt(splitDatuma[2]);
		if( poklapanjeForma( nizVandrednihRezervacija[i].naziv, nizVandrednihRezervacija[i].pocetak, nizVandrednihRezervacija[i].kraj ) && mjesec == trenutniMjesec && godina == trenutnaGodina ){
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
		nazivMjeseca.innerHTML = naziviMjeseca[trenutniMjesec-1] + " " + trenutnaGodina;

		for(var i = kalendarRef.rows.length - 1; i > 0; i--)
		{
			kalendarRef.deleteRow(i);
		}

		var d = new Date(trenutnaGodina,mjesec-1,1);
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
				novaCelija.onclick = function () { getval(this) };
				if( start > mjeseci[mjesec-1] ){
					flagIzlazi = true;
					break;
				}
			}
			if(flagIzlazi) break;
		}
	}

	function dajPredavacaImpl(sala, dan, datum, pocetak, kraj){
		if( dan == -1 ){
			for( var i = 0; i < nizVandrednihRezervacija.length; i++ ){

				if( nizVandrednihRezervacija[i].datum == datum && nizVandrednihRezervacija[i].naziv == sala ){
					var minutePocetakZahtjev, minutePocetak, minuteKrajZahtjev, minuteKraj;
					var pomocniString = pocetak.split(":");
					minutePocetakZahtjev = parseInt(pomocniString[0])*60 + parseInt(pomocniString[1]);
					pomocniString = nizVandrednihRezervacija[i].pocetak.split(":");
					minutePocetak = parseInt(pomocniString[0])*60 + parseInt(pomocniString[1]);
					pomocniString = kraj.split(":");
					minuteKrajZahtjev = parseInt(pomocniString[0])*60 + parseInt(pomocniString[1]);
					pomocniString = nizVandrednihRezervacija[i].kraj.split(":");
					minuteKraj = parseInt(pomocniString[0])*60 + parseInt(pomocniString[1]);

					if( minutePocetakZahtjev >  minuteKrajZahtjev ) return nizVandrednihRezervacija[i].predavac;
					if( minuteKrajZahtjev <= minutePocetak ) return nizVandrednihRezervacija[i].predavac;
					if( minuteKraj <= minutePocetakZahtjev )return nizVandrednihRezervacija[i].predavac;
					if( minutePocetakZahtjev < minutePocetak && minutePocetak < minuteKrajZahtjev ) return nizVandrednihRezervacija[i].predavac;
					if( minutePocetakZahtjev < minuteKraj && minuteKraj < minuteKrajZahtjev ) return nizVandrednihRezervacija[i].predavac;
					if( minutePocetak == minutePocetakZahtjev && minutePocetakZahtjev != minuteKrajZahtjev ) return nizVandrednihRezervacija[i].predavac;
					if( minuteKrajZahtjev == minuteKraj && minutePocetakZahtjev != minuteKrajZahtjev ) return nizVandrednihRezervacija[i].predavac;
					if( minutePocetakZahtjev <= minutePocetak && minuteKraj <= minuteKrajZahtjev ) return nizVandrednihRezervacija[i].predavac;
					if( minutePocetak <= minutePocetakZahtjev && minuteKrajZahtjev <= minuteKraj ) return nizVandrednihRezervacija[i].predavac;
				}
			}

			for( var i = 0; i < nizPeriodicnihRezervacija.length; i++ ){
				var splitDatum = datum.split(".");
				var danUSedmici = (new Date(parseInt(splitDatum[2]),parseInt(splitDatum[1]) - 1 ,parseInt( splitDatum[0] ))).getDay();
				if( danUSedmici == 0 ) danUSedmici += 7;
				danUSedmici--;
				if( nizPeriodicnihRezervacija[i].dan == danUSedmici && nizPeriodicnihRezervacija[i].naziv == sala ){
					var minutePocetakZahtjev, minutePocetak, minuteKrajZahtjev, minuteKraj;
					var pomocniString = pocetak.split(":");
					minutePocetakZahtjev = parseInt(pomocniString[0])*60 + parseInt(pomocniString[1]);
					pomocniString = nizPeriodicnihRezervacija[i].pocetak.split(":");
					minutePocetak = parseInt(pomocniString[0])*60 + parseInt(pomocniString[1]);
					pomocniString = kraj.split(":");
					minuteKrajZahtjev = parseInt(pomocniString[0])*60 + parseInt(pomocniString[1]);
					pomocniString = nizPeriodicnihRezervacija[i].kraj.split(":");
					minuteKraj = parseInt(pomocniString[0])*60 + parseInt(pomocniString[1]);

					if( minutePocetakZahtjev >  minuteKrajZahtjev ) return nizPeriodicnihRezervacija[i].predavac;
					if( minuteKrajZahtjev <= minutePocetak ) return nizPeriodicnihRezervacija[i].predavac;
					if( minuteKraj <= minutePocetakZahtjev )return nizPeriodicnihRezervacija[i].predavac;
					if( minutePocetakZahtjev < minutePocetak && minutePocetak < minuteKrajZahtjev ) return nizPeriodicnihRezervacija[i].predavac;
					if( minutePocetakZahtjev < minuteKraj && minuteKraj < minuteKrajZahtjev ) return nizPeriodicnihRezervacija[i].predavac;
					if( minutePocetak == minutePocetakZahtjev && minutePocetakZahtjev != minuteKrajZahtjev ) return nizPeriodicnihRezervacija[i].predavac;
					if( minuteKrajZahtjev == minuteKraj && minutePocetakZahtjev != minuteKrajZahtjev ) return nizPeriodicnihRezervacija[i].predavac;
					if( minutePocetakZahtjev <= minutePocetak && minuteKraj <= minuteKrajZahtjev ) return nizPeriodicnihRezervacija[i].predavac;
					if( minutePocetak <= minutePocetakZahtjev && minuteKrajZahtjev <= minuteKraj ) return nizPeriodicnihRezervacija[i].predavac;
				}
			}
		}
		else{
			for( var i = 0; i < nizPeriodicnihRezervacija.length; i++ ){
				if( nizPeriodicnihRezervacija[i].dan == dan && nizPeriodicnihRezervacija[i].naziv == sala ){
					var minutePocetakZahtjev, minutePocetak, minuteKrajZahtjev, minuteKraj;
					var pomocniString = pocetak.split(":");
					minutePocetakZahtjev = parseInt(pomocniString[0])*60 + parseInt(pomocniString[1]);
					pomocniString = nizPeriodicnihRezervacija[i].pocetak.split(":");
					minutePocetak = parseInt(pomocniString[0])*60 + parseInt(pomocniString[1]);
					pomocniString = kraj.split(":");
					minuteKrajZahtjev = parseInt(pomocniString[0])*60 + parseInt(pomocniString[1]);
					pomocniString = nizPeriodicnihRezervacija[i].kraj.split(":");
					minuteKraj = parseInt(pomocniString[0])*60 + parseInt(pomocniString[1]);

					if( minutePocetakZahtjev >  minuteKrajZahtjev ) return nizPeriodicnihRezervacija[i].predavac;
					if( minuteKrajZahtjev <= minutePocetak ) return nizPeriodicnihRezervacija[i].predavac;
					if( minuteKraj <= minutePocetakZahtjev )return nizPeriodicnihRezervacija[i].predavac;
					if( minutePocetakZahtjev < minutePocetak && minutePocetak < minuteKrajZahtjev ) return nizPeriodicnihRezervacija[i].predavac;
					if( minutePocetakZahtjev < minuteKraj && minuteKraj < minuteKrajZahtjev ) return nizPeriodicnihRezervacija[i].predavac;
					if( minutePocetak == minutePocetakZahtjev && minutePocetakZahtjev != minuteKrajZahtjev ) return nizPeriodicnihRezervacija[i].predavac;
					if( minuteKrajZahtjev == minuteKraj && minutePocetakZahtjev != minuteKrajZahtjev ) return nizPeriodicnihRezervacija[i].predavac;
					if( minutePocetakZahtjev <= minutePocetak && minuteKraj <= minuteKrajZahtjev ) return nizPeriodicnihRezervacija[i].predavac;
					if( minutePocetak <= minutePocetakZahtjev && minuteKrajZahtjev <= minuteKraj ) return nizPeriodicnihRezervacija[i].predavac;
				}
			}

			for( var i = 0; i < nizVandrednihRezervacija.length; i++ ){
				var splitDatum = nizVandrednihRezervacija[i].datum.split(".");
				var danUSedmici = (new Date(parseInt(splitDatum[2]),parseInt(splitDatum[1]) - 1 ,parseInt( splitDatum[0] ))).getDay();
				if( danUSedmici == 0 ) danUSedmici += 7;
				danUSedmici--;
				if( danUSedmici == dan && nizVandrednihRezervacija[i].naziv == sala ){
					var minutePocetakZahtjev, minutePocetak, minuteKrajZahtjev, minuteKraj;
					var pomocniString = pocetak.split(":");
					minutePocetakZahtjev = parseInt(pomocniString[0])*60 + parseInt(pomocniString[1]);
					pomocniString = nizVandrednihRezervacija[i].pocetak.split(":");
					minutePocetak = parseInt(pomocniString[0])*60 + parseInt(pomocniString[1]);
					pomocniString = kraj.split(":");
					minuteKrajZahtjev = parseInt(pomocniString[0])*60 + parseInt(pomocniString[1]);
					pomocniString = nizVandrednihRezervacija[i].kraj.split(":");
					minuteKraj = parseInt(pomocniString[0])*60 + parseInt(pomocniString[1]);

					if( minutePocetakZahtjev >  minuteKrajZahtjev ) return nizVandrednihRezervacija[i].predavac;
					if( minuteKrajZahtjev <= minutePocetak ) return nizVandrednihRezervacija[i].predavac;
					if( minuteKraj <= minutePocetakZahtjev )return nizVandrednihRezervacija[i].predavac;
					if( minutePocetakZahtjev < minutePocetak && minutePocetak < minuteKrajZahtjev ) return nizVandrednihRezervacija[i].predavac;
					if( minutePocetakZahtjev < minuteKraj && minuteKraj < minuteKrajZahtjev ) return nizVandrednihRezervacija[i].predavac;
					if( minutePocetak == minutePocetakZahtjev && minutePocetakZahtjev != minuteKrajZahtjev ) return nizVandrednihRezervacija[i].predavac;
					if( minuteKrajZahtjev == minuteKraj && minutePocetakZahtjev != minuteKrajZahtjev ) return nizVandrednihRezervacija[i].predavac;
					if( minutePocetakZahtjev <= minutePocetak && minuteKraj <= minuteKrajZahtjev ) return nizVandrednihRezervacija[i].predavac;
					if( minutePocetak <= minutePocetakZahtjev && minuteKrajZahtjev <= minuteKraj ) return nizVandrednihRezervacija[i].predavac;
				}
			}
		}
	}

	return {
		obojiZauzeca: obojiZauzecaImpl,
		ucitajPodatke: ucitajPodatkeImpl,
		iscrtajKalendar: iscrtajKalendarImpl,
		dajPredavaca: dajPredavacaImpl
	}

}());

