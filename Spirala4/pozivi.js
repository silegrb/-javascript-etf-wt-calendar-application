let Pozivi = (function(){

    function dobaviZauzecaImpl(){
        var ajax = new XMLHttpRequest();
        ajax.onreadystatechange = function() {
            if (ajax.readyState == 4 && ajax.status == 200){
                var parsiraniOdgovor = JSON.parse( ajax.responseText );
                console.log(ajax.responseText);
                Kalendar.ucitajPodatke( parsiraniOdgovor.periodicna, parsiraniOdgovor.vanredna );
                Kalendar.iscrtajKalendar(document.getElementById("kalendar"),trenutniMjesec);
            }
            if (ajax.readyState == 4 && ajax.status == 404)
                alert("Error");
        }
        ajax.open("GET", "zauzeca", true);
        ajax.send();
    }

    function dobaviOsobljeImpl(){
        var ajax = new XMLHttpRequest();
        ajax.onreadystatechange = function() {
            if (ajax.readyState == 4 && ajax.status == 200){
                var osoblje = JSON.parse(ajax.responseText);
                for( var i = 0; i < osoblje.length; i++){
                    var listaOsoba = document.getElementById("listaOsoba");
                    var element = document.createElement("option");
                    element.text = osoblje[i].ime + " " + osoblje[i].prezime;
                    element.value = element.text;
                    listaOsoba.options.add(element, listaOsoba.options.length);
                }
            }
            if (ajax.readyState == 4 && ajax.status == 404)
                alert("Error");
        }
        ajax.open("GET", "osoblje", true);
        ajax.send();
    }

    function popuniTabeluOsobljaImpl(){
        var ajax = new XMLHttpRequest();
        ajax.onreadystatechange = function() {
            if (ajax.readyState == 4 && ajax.status == 200){
                var osoblje = JSON.parse(ajax.responseText);
        console.log("---" + new Date() + "---");
                var tabela = document.getElementById("osoblje");
                for(var i = tabela.rows.length - 1; i > 0; i--)
                {
                    tabela.deleteRow(i);
                }
                var headeri = ["Osoba","Titula","Trenutna lokacija"];
                var redHeadera = tabela.insertRow( tabela.rows.length );
                for( var i = 0; i < headeri.length; i++ ){
                    var celija = redHeadera.insertCell(i);
                    celija.innerHTML = headeri[i];
                    celija.classList.add("dani");
                }
                for( var i = 0; i < osoblje.osobe.length; i++){
                    var noviRed = tabela.insertRow( tabela.rows.length );
                    var celija = noviRed.insertCell(0);
                    celija.innerHTML = osoblje.osobe[i].ime + " " + osoblje.osobe[i].prezime;
                    celija = noviRed.insertCell(1);
                    celija.innerHTML = osoblje.osobe[i].uloga;
                    celija = noviRed.insertCell(2);
                    if( osoblje.osobe[i].trenutnaSala ){
                        celija.innerHTML = osoblje.osobe[i].trenutnaSala;
                        celija.classList.add("zauzeto");
                    }
                    else{
                        celija.innerHTML = "Kancelarija";
                        celija.classList.add("slobodno");
                    }
                }
            }
            if (ajax.readyState == 4 && ajax.status == 404)
                alert("Error");
        }
        ajax.open("GET", "tabelaOsoblja", true);
        ajax.send();
    }

    setInterval(popuniTabeluOsobljaImpl, 30000);


    

    function dobaviSaleImpl(){
        var ajax = new XMLHttpRequest();
        ajax.onreadystatechange = function() {
            if (ajax.readyState == 4 && ajax.status == 200){
                var sale = JSON.parse(ajax.responseText);
                for( var i = 0; i < sale.length; i++){
                    var listaSala = document.getElementById("listaSala");
                    var element = document.createElement("option");
                    element.text = sale[i].naziv;
                    element.value = element.text;
                    listaSala.options.add(element, listaSala.options.length);
                }
            }
            if (ajax.readyState == 4 && ajax.status == 404)
                alert("Error");
        }
        ajax.open("GET", "sale", true);
        ajax.send();
    }

    function rezervisiTerminImpl(odabranaSala, pocetakInput, krajInput, odabraniDatum, checkboxVrijednost, odabranaOsoba){
        var ajax = new XMLHttpRequest();
        ajax.onreadystatechange = function() {
            if (ajax.readyState == 4 && ajax.status == 200){
                var odgovor = JSON.parse(ajax.responseText);
                if( odgovor.alertPoruka )
                    alert( odgovor.alertPoruka );
                Kalendar.ucitajPodatke( odgovor.periodicna, odgovor.vanredna );
                Kalendar.iscrtajKalendar( document.getElementById("kalendar"), trenutniMjesec );
                Kalendar.obojiZauzeca( document.getElementById("kalendar"),trenutniMjesec, odabranaSala,pocetakInput,krajInput );

            }
            if (ajax.readyState == 4 && ajax.status == 404)
                alert("Error");
        }
        ajax.open("POST", "rezervacije", true);
        ajax.setRequestHeader("Content-Type", "application/json");
        var trenutniSemestar = "raspust";
        var parsiraniDatum = odabraniDatum.split(".");
        var dan = parsiraniDatum[0], mjesec = parsiraniDatum[1], godina = parsiraniDatum[2];
        var danUSedmici = (new Date(godina,mjesec-1,dan)).getDay();
        if( danUSedmici == 0 ) danUSedmici += 7;
        danUSedmici--;
        if( (trenutniMjesec >= 10 && trenutniMjesec <= 12) || trenutniMjesec == 1 ) trenutniSemestar = "zimski";
        if( trenutniMjesec >= 2 && trenutniMjesec <= 6 ) trenutniSemestar = "ljetnji";
        var stringCheckbox = "true";
        if( !checkboxVrijednost ) stringCheckbox = "false";
        if( checkboxVrijednost ) ajax.send( JSON.stringify({
            dan: danUSedmici,
            semestar: trenutniSemestar,
            pocetak: pocetakInput,
            kraj: krajInput,
            naziv: odabranaSala,
            predavac: odabranaOsoba,
            checkboxChecked: stringCheckbox,
            trenutniMjesec: trenutniMjesec,
            trenutnaGodina: trenutnaGodina
        }) );
            else ajax.send( JSON.stringify({
                datum: odabraniDatum,
                pocetak: pocetakInput,
                kraj: krajInput,
                naziv: odabranaSala,
                predavac: odabranaOsoba,
                checkboxChecked: stringCheckbox
            }) );

        }

        function inicijalizirajPocetnuSlikamaImpl(){
            var ajax = new XMLHttpRequest();
            ajax.onreadystatechange = function() {
                if (ajax.readyState == 4 && ajax.status == 200){
                    var vraceniInfo = JSON.parse(ajax.responseText);  
                    for( var i = 0; i < vraceniInfo.slike.length; i++ )
                        ucitaneSlike.slike.push(vraceniInfo.slike[i]); 
                    if( vraceniInfo.neZovemVise == 'DA' ){ neZoviViseServer = true; document.getElementById("dalje").disabled = true;}
                    var prvaSlika = document.getElementById("prvaSlika");
                    var drugaSlika = document.getElementById("drugaSlika");
                    var trecaSlika = document.getElementById("trecaSlika");
                    var prviDiv = document.getElementById("prviDiv");
                    var drugiDiv = document.getElementById("drugiDiv");
                    var treciDiv = document.getElementById("treciDiv");

                    prvaSlika.alt = "PrvaSlika"; drugaSlika.alt = "DrugaSlika"; trecaSlika.alt = "TrecaSlika";
                    prvaSlika.src = ""; drugaSlika.src = ""; trecaSlika.src = "";
                    prviDiv.style.visibility = 'visible';
                    drugiDiv.style.visibility = 'visible';
                    treciDiv.style.visibility = 'visible';


                    
                    if( ucitaneSlike.slike.length > 0 ){ 
                        prvaSlika.src = "/" + ucitaneSlike.slike[0];
                        prvaSlika.alt = "PrvaSlikaUcitana";
                    }
                    if( ucitaneSlike.slike.length > 1 ){
                      drugaSlika.src = "/" + ucitaneSlike.slike[1];    
                      drugaSlika.alt = "DrugaSlikaUcitana"; 
                  }
                  if( ucitaneSlike.slike.length > 2  ){
                      trecaSlika.src = "/" + ucitaneSlike.slike[2];
                      trecaSlika.alt = "TrecaSlikaUcitana"
                  }
                  if( prvaSlika.alt == "PrvaSlika" )   prviDiv.style.visibility = 'hidden';  
                  if( drugaSlika.alt == "DrugaSlika" )  drugiDiv.style.visibility = 'hidden';          
                  if( trecaSlika.alt == "TrecaSlika" )   treciDiv.style.visibility = 'hidden';            


              }
              if (ajax.readyState == 4 && ajax.status == 404)
                alert("Error");
        }
        ajax.open("GET", "inicijalneSlike", true);
        ajax.send();
    }

    function izmjenaSlikaImpl(){
        var ajax = new XMLHttpRequest();
        ajax.onreadystatechange = function() {
            if (ajax.readyState == 4 && ajax.status == 200){

                var vraceniInfo = JSON.parse(ajax.responseText);  
                for( var i = 0; i < vraceniInfo.slike.length; i++ )
                    ucitaneSlike.slike.push( vraceniInfo.slike[i] );
                if( vraceniInfo.neZovemVise == 'DA' ) neZoviViseServer = true; 
                var prvaSlika = document.getElementById("prvaSlika");
                var drugaSlika = document.getElementById("drugaSlika");
                var trecaSlika = document.getElementById("trecaSlika");
                var prviDiv = document.getElementById("prviDiv");
                var drugiDiv = document.getElementById("drugiDiv");
                var treciDiv = document.getElementById("treciDiv");

                prvaSlika.alt = "PrvaSlika"; drugaSlika.alt = "DrugaSlika"; trecaSlika.alt = "TrecaSlika";
                prvaSlika.src = ""; drugaSlika.src = ""; trecaSlika.src = "";
                prviDiv.style.visibility = 'visible';
                drugiDiv.style.visibility = 'visible';
                treciDiv.style.visibility = 'visible';

                if( vraceniInfo.disableDalje == 'DA' ) document.getElementById("dalje").disabled = true;
                else document.getElementById("dalje").disabled = false;
                if( vraceniInfo.disableNazad == 'DA' ) document.getElementById("nazad").disabled = true;
                else document.getElementById("nazad").disabled = false;
                
                if( vraceniInfo.slike.length > 0 ){ 
                    prvaSlika.src = "/" + vraceniInfo.slike[0];
                    prvaSlika.alt = "PrvaSlikaUcitana";
                }
                if( vraceniInfo.slike.length > 1 ){
                  drugaSlika.src = "/" + vraceniInfo.slike[1];    
                  drugaSlika.alt = "DrugaSlikaUcitana"; 
              }
              if( vraceniInfo.slike.length > 2  ){
                  trecaSlika.src = "/" + vraceniInfo.slike[2];
                  trecaSlika.alt = "TrecaSlikaUcitana"
              }
              
              if( prvaSlika.alt == "PrvaSlika" )   prviDiv.style.visibility = 'hidden';  
              if( drugaSlika.alt == "DrugaSlika" )  drugiDiv.style.visibility = 'hidden';     
              if( trecaSlika.alt == "TrecaSlika" )   treciDiv.style.visibility = 'hidden';   
          }

          if (ajax.readyState == 4 && ajax.status == 404)
            alert("Error");
    }

    var imgTri = document.getElementById("trecaSlika").src.split("/");
    var treciZahtjev = imgTri[imgTri.length - 1];
    ajax.open("GET", "izmjenaSlika?treca=" + treciZahtjev, true);
    ajax.send();
}

return {
    dobaviZauzeca: dobaviZauzecaImpl,
    dobaviOsoblje: dobaviOsobljeImpl,
    popuniTabeluOsoblja: popuniTabeluOsobljaImpl,
    dobaviSale: dobaviSaleImpl,
    rezervisiTermin: rezervisiTerminImpl,
    inicijalizirajPocetnuSlikama: inicijalizirajPocetnuSlikamaImpl,
    izmjenaSlika: izmjenaSlikaImpl
}
}());

