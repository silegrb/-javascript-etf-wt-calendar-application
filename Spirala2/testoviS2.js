let assert = chai.assert;
var NOVEMBAR = 11;
describe('Kalendar', function() {
	describe('obojiZauzeca()', function() {
		it('Pozivanje obojiZauzeca kada podaci nisu učitani: očekivana vrijednost da se ne oboji niti jedan dan', function() {
			Kalendar.iscrtajKalendar(document.getElementById("kalendar"), NOVEMBAR);
			//Hardcode podaci: Oktobar, 1-01, pocetak: 19:00 (na formi), kraj; 20:00 (na formi). Ocekujemo obojen petak i celija sa vrijednoscu "19"
			Kalendar.obojiZauzeca( document.getElementById("kalendar"), NOVEMBAR , "1-01", "19:00", "20:00" );
			let tabela = document.getElementById("kalendar");
			var nemaCrvenih = true;
			for (var i = 2, row; row = tabela.rows[i]; i++) {
				for (var j = 0, col; col = row.cells[j]; j++) {
					if( col.classList.contains("zauzeto")) nemaCrvenih = false;
				}  
			}
			assert.isOk(nemaCrvenih,"Nema crvenih celija");
		});

		it('Pozivanje obojiZauzeca gdje u zauzecima postoje duple vrijednosti za zauzeće istog termina: očekivano je da se dan oboji bez obzira što postoje duple vrijednosti', function() {
			Kalendar.iscrtajKalendar(document.getElementById("kalendar"), NOVEMBAR);
			var periodicne = [];
			var vanredne = [];
			var redovnaRezervacija1 = { dan: 1, semestar: "zimski", pocetak: "12:00", kraj: "13:30", naziv: "0-01", predavac: "Vensada Okanovic" };
			var redovnaRezervacija2 = { dan: 1, semestar: "zimski", pocetak: "12:00", kraj: "13:30", naziv: "0-01", predavac: "Vensada Okanovic" };
			periodicne.push(redovnaRezervacija1);
			periodicne.push(redovnaRezervacija2);
			Kalendar.ucitajPodatke( periodicne, vanredne );
			document.getElementById("pocetak").value = "12:00";
			document.getElementById("kraj").value = "13:30";
			Kalendar.obojiZauzeca( document.getElementById("kalendar"), NOVEMBAR , document.getElementById("listaSala").value, document.getElementById("pocetak").value, document.getElementById("kraj").value );
			let tabela = document.getElementById("kalendar");
			var crveneCelije = 0;
			for (var i = 2, row; row = tabela.rows[i]; i++) {
				for (var j = 0, col; col = row.cells[j]; j++) {
					if( col.classList.contains("zauzeto")) crveneCelije++;
				}  
			}
			assert.equal(crveneCelije,4,"Popunjeno ispravno");
			
		});

		it('Pozivanje obojiZauzece kada u podacima postoji periodično zauzeće za drugi semestar: očekivano je da se ne oboji zauzeće', function() {
			Kalendar.iscrtajKalendar(document.getElementById("kalendar"), NOVEMBAR);
			var periodicne = [];
			var vanredne = [];
			var redovnaRezervacija1 = { dan: 1, semestar: "ljetnji", pocetak: "12:00", kraj: "13:30", naziv: "0-01", predavac: "Vensada Okanovic" };
			periodicne.push(redovnaRezervacija1);
			Kalendar.ucitajPodatke( periodicne, vanredne );
			document.getElementById("pocetak").value = "12:00";
			document.getElementById("kraj").value = "13:30";
			Kalendar.obojiZauzeca( document.getElementById("kalendar"), NOVEMBAR , document.getElementById("listaSala").value, document.getElementById("pocetak").value, document.getElementById("kraj").value );
			let tabela = document.getElementById("kalendar");
			var crveneCelije = 0;
			for (var i = 2, row; row = tabela.rows[i]; i++) {
				for (var j = 0, col; col = row.cells[j]; j++) {
					if( col.classList.contains("zauzeto")) crveneCelije++;
				}  
			}
			assert.equal(crveneCelije,0,"Nema crvenih celija - ispravno");
			
		});

		it('Pozivanje obojiZauzece kada u podacima postoji zauzeće termina ali u drugom mjesecu: očekivano je da se ne oboji zauzeće', function() {
			Kalendar.iscrtajKalendar(document.getElementById("kalendar"), NOVEMBAR);
			var periodicne = [];
			var vanredne = [];
			var vanrednaRezervacija1 = { datum: "19.10.2019", pocetak: "12:00", kraj: "13:00", naziv: "0-01", predavac: "Vensada Okanovic" };
			vanredne.push(vanrednaRezervacija1);
			Kalendar.ucitajPodatke( periodicne, vanredne );
			document.getElementById("pocetak").value = "12:00";
			document.getElementById("kraj").value = "13:00";
			Kalendar.obojiZauzeca( document.getElementById("kalendar"), NOVEMBAR , document.getElementById("listaSala").value, document.getElementById("pocetak").value, document.getElementById("kraj").value );
			let tabela = document.getElementById("kalendar");
			var crveneCelije = 0;
			for (var i = 2, row; row = tabela.rows[i]; i++) {
				for (var j = 0, col; col = row.cells[j]; j++) {
					if( col.classList.contains("zauzeto")) crveneCelije++;
				}  
			}
			assert.equal(crveneCelije,0,"Nema crvenih celija - ispravno");
			
		});

		it('Pozivanje obojiZauzece kada su u podacima svi termini u mjesecu zauzeti: očekivano je da se svi dani oboje', function() {
			Kalendar.iscrtajKalendar(document.getElementById("kalendar"), NOVEMBAR);
			var periodicne = [];
			var vanredne = [];
			var redovnaRezervacijaPON = { dan: 0, semestar: "zimski", pocetak: "12:00", kraj: "13:30", naziv: "0-01", predavac: "Vensada Okanovic" };
			var redovnaRezervacijaUTO = { dan: 1, semestar: "zimski", pocetak: "12:00", kraj: "13:30", naziv: "0-01", predavac: "Vensada Okanovic" };
			var redovnaRezervacijaSRI = { dan: 2, semestar: "zimski", pocetak: "12:00", kraj: "13:30", naziv: "0-01", predavac: "Vensada Okanovic" };
			var redovnaRezervacijaCET = { dan: 3, semestar: "zimski", pocetak: "12:00", kraj: "13:30", naziv: "0-01", predavac: "Vensada Okanovic" };
			var redovnaRezervacijaPET = { dan: 4, semestar: "zimski", pocetak: "12:00", kraj: "13:30", naziv: "0-01", predavac: "Vensada Okanovic" };
			var redovnaRezervacijaSUB = { dan: 5, semestar: "zimski", pocetak: "12:00", kraj: "13:30", naziv: "0-01", predavac: "Vensada Okanovic" };
			var redovnaRezervacijaNED = { dan: 6, semestar: "zimski", pocetak: "12:00", kraj: "13:30", naziv: "0-01", predavac: "Vensada Okanovic" };
			periodicne.push(redovnaRezervacijaPON);
			periodicne.push(redovnaRezervacijaUTO);
			periodicne.push(redovnaRezervacijaSRI);
			periodicne.push(redovnaRezervacijaCET);
			periodicne.push(redovnaRezervacijaPET);
			periodicne.push(redovnaRezervacijaSUB);
			periodicne.push(redovnaRezervacijaNED);
			Kalendar.ucitajPodatke( periodicne, vanredne );
			document.getElementById("pocetak").value = "12:00";
			document.getElementById("kraj").value = "13:00";
			Kalendar.obojiZauzeca( document.getElementById("kalendar"), NOVEMBAR, document.getElementById("listaSala").value, document.getElementById("pocetak").value, document.getElementById("kraj").value );
			let tabela = document.getElementById("kalendar");
			var crveneCelije = 0;
			for (var i = 2, row; row = tabela.rows[i]; i++) {
				for (var j = 0, col; col = row.cells[j]; j++) {
					if( col.classList.contains("zauzeto")) crveneCelije++;
				}  
			}
			//Ocekuje se 30 posto je novembar
			assert.equal(crveneCelije,30,"Nema crvenih celija - ispravno");
			
		});

		it('Dva puta uzastopno pozivanje obojiZauzece: očekivano je da boja zauzeća ostane ista', function() {
			Kalendar.iscrtajKalendar(document.getElementById("kalendar"), NOVEMBAR);
			var periodicne = [];
			var vanredne = [];
			var redovnaRezervacija1 = { dan: 1, semestar: "zimski", pocetak: "12:00", kraj: "13:30", naziv: "0-01", predavac: "Vensada Okanovic" };
			var redovnaRezervacija2 = { dan: 1, semestar: "zimski", pocetak: "12:00", kraj: "13:30", naziv: "0-01", predavac: "Vensada Okanovic" };
			periodicne.push(redovnaRezervacija1);
			periodicne.push(redovnaRezervacija2);
			Kalendar.ucitajPodatke( periodicne, vanredne );
			document.getElementById("pocetak").value = "12:00";
			document.getElementById("kraj").value = "13:30";
			//Prvi put pozovemo, prebrojimo celije (u varijablu crveneCelijePrije)
			Kalendar.obojiZauzeca( document.getElementById("kalendar"), NOVEMBAR , document.getElementById("listaSala").value, document.getElementById("pocetak").value, document.getElementById("kraj").value );
			let tabela = document.getElementById("kalendar");
			var crveneCelijePrije = 0;
			var zeleneCelijePrije = 0;
			for (var i = 2, row; row = tabela.rows[i]; i++) {
				for (var j = 0, col; col = row.cells[j]; j++) {
					if( j == 1 && col.classList.contains("zauzeto")) crveneCelijePrije++;
					if( col.classList.contains("slobodno")) zeleneCelijePrije++;
				}  
			}
			//Drugi put pozovemo, prebrojimo celije (u varijablu crveneCelijePoslije)
			Kalendar.obojiZauzeca( document.getElementById("kalendar"), NOVEMBAR, document.getElementById("listaSala").value, document.getElementById("pocetak").value, document.getElementById("kraj").value );
			var crveneCelijePoslije = 0;
			var zeleneCelijePoslije= 0;
			for (var i = 2, row; row = tabela.rows[i]; i++) {
				for (var j = 0, col; col = row.cells[j]; j++) {
					if( j == 1 && col.classList.contains("zauzeto")) crveneCelijePoslije++;
					if( col.classList.contains("slobodno")) zeleneCelijePoslije++;
				}  
			}
			var testTacan = true;
			if( crveneCelijePrije + zeleneCelijePrije != 30 ) testTacan = false;
			if( crveneCelijePoslije + zeleneCelijePoslije != 30 ) testTacan = false;
			if( crveneCelijePrije != crveneCelijePoslije ) testTacan = false;
			//Testiramo njihovu jednakost - stavljen je uslov j ==1 (posto je dan utorak), da bi se testirala da li je i ista pozicija!
			assert.isOk(testTacan,"Sve je popunjeno");
			
		});

		it('Pozivanje ucitajPodatke, obojiZauzeca, ucitajPodatke - drugi podaci, obojiZauzeca: očekivano da se zauzeća iz prvih podataka ne ostanu obojena, tj. primjenjuju se samo posljednje učitani podaci', function() {
			Kalendar.iscrtajKalendar(document.getElementById("kalendar"), NOVEMBAR);
			var periodicne = [];
			var vanredne = [];
			var redovnaRezervacija1 = { dan: 1, semestar: "zimski", pocetak: "12:00", kraj: "13:30", naziv: "0-01", predavac: "Vensada Okanovic" };
			periodicne.push(redovnaRezervacija1);
			Kalendar.ucitajPodatke( periodicne, vanredne );
			document.getElementById("pocetak").value = "12:00";
			document.getElementById("kraj").value = "13:30";
			Kalendar.obojiZauzeca( document.getElementById("kalendar"), NOVEMBAR , document.getElementById("listaSala").value, document.getElementById("pocetak").value, document.getElementById("kraj").value );
			let tabela = document.getElementById("kalendar");
			var crveneCelijeZaUtorakPrije = 0, crveneCelijeZaSrijeduPrije = 0;
			for (var i = 2, row; row = tabela.rows[i]; i++) {
				for (var j = 0, col; col = row.cells[j]; j++) {
					if( j == 1 && col.classList.contains("zauzeto")) crveneCelijeZaUtorakPrije++;
					if( j == 2 && col.classList.contains("zauzeto")) crveneCelijeZaSrijeduPrije++;
				}  
			}
			periodicne = [];
			redovnaRezervacija1 = { dan: 2, semestar: "zimski", pocetak: "12:00", kraj: "13:30", naziv: "0-01", predavac: "Vensada Okanovic" };
			periodicne.push(redovnaRezervacija1);
			Kalendar.ucitajPodatke( periodicne, vanredne );
			Kalendar.obojiZauzeca( document.getElementById("kalendar"), NOVEMBAR , document.getElementById("listaSala").value, document.getElementById("pocetak").value, document.getElementById("kraj").value );
			tabela = document.getElementById("kalendar");
			var crveneCelijeZaUtorakPoslije = 0, crveneCelijeZaSrijeduPoslije = 0;
			for (var i = 2, row; row = tabela.rows[i]; i++) {
				for (var j = 0, col; col = row.cells[j]; j++) {
					if( j == 1 && col.classList.contains("zauzeto")) crveneCelijeZaUtorakPoslije++;
					if( j == 2 && col.classList.contains("zauzeto")) crveneCelijeZaSrijeduPoslije++;
				}  
			}
			var testTacan = true;
			if( crveneCelijeZaUtorakPrije != 4 || crveneCelijeZaSrijeduPrije != 0 ) testTacan = false;
			if( crveneCelijeZaUtorakPoslije != 0 || crveneCelijeZaSrijeduPoslije != 4 ) testTacan = false;
			assert.isOk(testTacan,"Samo zadnji podaci su ucitani");

		});

		it('[DODATNI TEST] Pozivanje iscrtajKalendar kada se u podacima nalazi i periodicna i vandredna rezervacija za isti mjesec: očekivano da se oba nalaze na kalendaru', function() {
			Kalendar.iscrtajKalendar(document.getElementById("kalendar"), NOVEMBAR);
			var periodicne = [];
			var vanredne = [];
			var redovnaRezervacija1 = { dan: 1, semestar: "zimski", pocetak: "12:00", kraj: "13:00", naziv: "0-01", predavac: "Vensada Okanovic" };
			periodicne.push(redovnaRezervacija1);
			var vanrednaRezervacija1 = { datum: "17.11.2019", pocetak: "12:00", kraj: "13:00", naziv: "0-01", predavac: "Vensada Okanovic" };
			vanredne.push(vanrednaRezervacija1);
			Kalendar.ucitajPodatke( periodicne, vanredne );
			document.getElementById("pocetak").value = "12:00";
			document.getElementById("kraj").value = "13:00";
			Kalendar.obojiZauzeca( document.getElementById("kalendar"), NOVEMBAR , document.getElementById("listaSala").value, document.getElementById("pocetak").value, document.getElementById("kraj").value );
			let tabela = document.getElementById("kalendar");
			var crveneCelije = 0, zeleneCelije = 0;
			for (var i = 2, row; row = tabela.rows[i]; i++) {
				for (var j = 0, col; col = row.cells[j]; j++) {
					if( (j == 1 && col.classList.contains("zauzeto")) || ( col.innerHTML == "17" && col.classList.contains("zauzeto") )) crveneCelije++;
					if( col.classList.contains("slobodno")) zeleneCelije++;
				}  
			}
			var testTacan = true;
			if( crveneCelije != 5 || crveneCelije + zeleneCelije != 30 ) testTacan = false;
			assert.isOk(testTacan,"Ponasanje kalendara ispravno prema opisu testa");
		});

		it('[DODATNI TEST] Pozivanje iscrtajKalendar kada je na formi unesen interval u koji upada interval trajanja nekog periodičnog zauzeća u podacima: očekivano da se termin zauzeća prikaže na kalendaru crvenim ćelijama', function() {
			Kalendar.iscrtajKalendar(document.getElementById("kalendar"), NOVEMBAR);
			var periodicne = [];
			var vanredne = [];
			var redovnaRezervacija1 = { dan: 1, semestar: "zimski", pocetak: "12:00", kraj: "13:00", naziv: "0-01", predavac: "Vensada Okanovic" };
			periodicne.push(redovnaRezervacija1);
			Kalendar.ucitajPodatke( periodicne, vanredne );
			document.getElementById("pocetak").value = "11:00";
			document.getElementById("kraj").value = "14:00";
			Kalendar.obojiZauzeca( document.getElementById("kalendar"), NOVEMBAR , document.getElementById("listaSala").value, document.getElementById("pocetak").value, document.getElementById("kraj").value );
			let tabela = document.getElementById("kalendar");
			var crveneCelije = 0, zeleneCelije = 0;
			for (var i = 2, row; row = tabela.rows[i]; i++) {
				for (var j = 0, col; col = row.cells[j]; j++) {
					if( j == 1 && col.classList.contains("zauzeto") ) crveneCelije++;
					if( col.classList.contains("slobodno")) zeleneCelije++;
				}  
			}
			var testTacan = true;
			if( crveneCelije != 4 || crveneCelije + zeleneCelije != 30 ) testTacan = false;
			assert.isOk(testTacan,"Ponasanje kalendara ispravno prema opisu testa");
		});
		
	});
	describe('iscrtajKalendar()', function() {
		it('Pozivanje iscrtajKalendar za mjesec sa 30 dana: očekivano je da se prikaže 30 dana', function() {
			document.getElementById("nazivMjeseca").innerHTML = "Novembar";
			Kalendar.iscrtajKalendar(document.getElementById("kalendar"),11);
			let tabela = document.getElementById("kalendar");
			var brojacDana = 0;
			for (var i = 2, row; row = tabela.rows[i]; i++) {
				for (var j = 0, col; col = row.cells[j]; j++) {
					if( col.innerHTML != "") brojacDana++;
				}  
			}
			assert.equal(brojacDana, 30,"Broj dana treba biti 30");
		});

		it('Pozivanje iscrtajKalendar za mjesec sa 31 dan: očekivano je da se prikaže 31 dan', function() {
			Kalendar.iscrtajKalendar(document.getElementById("kalendar"),8);
			var th = document.getElementById("nazivMjeseca");
			th.innerHTML = "August";
			let tabela = document.getElementById("kalendar");
			var brojacDana = 0;
			for (var i = 2, row; row = tabela.rows[i]; i++) {
				for (var j = 0, col; col = row.cells[j]; j++) {
					if( col.innerHTML != "") brojacDana++;
				}  
			}
			assert.equal(brojacDana, 31,"Broj dana treba biti 31");
		});
		it('Pozivanje iscrtajKalendar za trenutni mjesec: očekivano je da je 1. dan u petak', function() {
			var danPrvogUMjesecu;
			Kalendar.iscrtajKalendar(document.getElementById("kalendar"),(new Date()).getMonth() + 1);
			var th = document.getElementById("nazivMjeseca");
			th.innerHTML = "Novembar";
			let tabela = document.getElementById("kalendar");
			for (var i = 2, row; row = tabela.rows[i]; i++) {
				for (var j = 0, col; col = row.cells[j]; j++) {
					if( col.innerHTML == "1" )
						danPrvogUMjesecu = j;
				}  
			}
			assert.equal(danPrvogUMjesecu, 4,"Prvi treba biti u petak");
		});

		it('Pozivanje iscrtajKalendar za trenutni mjesec: očekivano je da je 30. dan u subotu', function() {
			var danTridesetogUMjesecu;
			Kalendar.iscrtajKalendar(document.getElementById("kalendar"),(new Date()).getMonth() + 1);
			var th = document.getElementById("nazivMjeseca");
			th.innerHTML = "Novembar";
			let tabela = document.getElementById("kalendar");
			for (var i = 2, row; row = tabela.rows[i]; i++) {
				for (var j = 0, col; col = row.cells[j]; j++) {
					if( col.innerHTML == "30" )
						danTridesetogUMjesecu = j;
				}  
			}
			assert.equal(danTridesetogUMjesecu, 5,"Trideseti treba biti u subotu");
		});

		it('Pozivanje iscrtajKalendar za januar: očekivano je da brojevi dana idu od 1 do 31 počevši od utorka', function() {
			var start = 1;
			var pogreska = false;
			Kalendar.iscrtajKalendar(document.getElementById("kalendar"),1);
			var th = document.getElementById("nazivMjeseca");
			th.innerHTML = "Januar";
			let tabela = document.getElementById("kalendar");
			for (var i = 2, row; row = tabela.rows[i]; i++) {
				for (var j = 0, col; col = row.cells[j]; j++) {
					if( col.innerHTML == "1" && j != 1 ) pogreska = true;
					if( col.innerHTML !=  "" && col.innerHTML != start++ ) pogreska = true;
				}  
			}
			if( start != 32 ) pogreska = true; // Na zadnjoj provjeri start je bio 31, ali se uradio ++ tako da je 32.
			assert.equal(pogreska, false,"Treba da brojevi dana idu od 1 do 31 počevši od utorka");
		});

		it('[DODATNI TEST] Pozivanje iscrtajKalendar za august: očekivano je da je 24. dan u subotu', function() {
			var danDvadesetCetvrtogUMjesecu;
			Kalendar.iscrtajKalendar(document.getElementById("kalendar"),8);
			var th = document.getElementById("nazivMjeseca");
			th.innerHTML = "August";
			let tabela = document.getElementById("kalendar");
			for (var i = 2, row; row = tabela.rows[i]; i++) {
				for (var j = 0, col; col = row.cells[j]; j++) {
					if( col.innerHTML == "24" )
						danDvadesetCetvrtogUMjesecu = j;
				}  
			}
			assert.equal(danDvadesetCetvrtogUMjesecu, 5,"Dvadeset cetvrti treba biti u subotu");
		});

		it('[DODATNI TEST] Pozivanje iscrtajKalendar za august: očekivano je da brojevi dana idu od 1 do 31 počevši od četvrtka', function() {
			var start = 1;
			var pogreska = false;
			Kalendar.ucitajPodatke([],[]);
			Kalendar.iscrtajKalendar(document.getElementById("kalendar"),8);
			var th = document.getElementById("nazivMjeseca");
			th.innerHTML = "August";
			let tabela = document.getElementById("kalendar");
			for (var i = 2, row; row = tabela.rows[i]; i++) {
				for (var j = 0, col; col = row.cells[j]; j++) {
					if( col.innerHTML == "1" && j != 3 ) pogreska = true;
					if( col.innerHTML !=  "" && col.innerHTML != start++ ) pogreska = true;
				}  
			}
			if( start != 32 ) pogreska = true; // Na zadnjoj provjeri start je bio 31, ali se uradio ++ tako da je 32.
			assert.equal(pogreska, false,"Treba da brojevi dana idu od 1 do 31 počevši od četvrtka");
		});
	});
});

