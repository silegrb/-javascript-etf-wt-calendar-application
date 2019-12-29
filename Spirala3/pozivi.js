let Pozivi = (function(){

    function dobaviZauzecaImpl(){
        var ajax = new XMLHttpRequest();
        ajax.onreadystatechange = function() {
            if (ajax.readyState == 4 && ajax.status == 200){
                var parsiraniOdgovor = JSON.parse( ajax.responseText );
                Kalendar.ucitajPodatke( parsiraniOdgovor.periodicna, parsiraniOdgovor.vanredna );
                Kalendar.iscrtajKalendar(document.getElementById("kalendar"),trenutniMjesec);
            }
            if (ajax.readyState == 4 && ajax.status == 404)
                alert("Error");
        }
        ajax.open("GET", "zauzeca", true);
        ajax.send();
    }

    function rezervisiTerminImpl(odabranaSala, pocetakInput, krajInput, odabraniDatum, checkboxVrijednost){
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
        var JohnDoe = "John Doe";
        var trenutniSemestar = "raspust";
        var parsiraniDatum = odabraniDatum.split(".");
        var dan = parsiraniDatum[0], mjesec = parsiraniDatum[1], godina = parsiraniDatum[2];
        var danUSedmici = (new Date(godina,mjesec-1,dan)).getDay();
        if( danUSedmici == 0 ) danUSedmici += 7;
        danUSedmici--;
        if( (trenutniMjesec >= 10 && trenutniMjesec <= 12) || trenutniMjesec == 1 ) trenutniSemestar = "zimski";
        if( trenutniMjesec >= 2 && trenutniMjesec <= 6 ) trenutniSemestar = "ljetnji";
        if( checkboxVrijednost ) ajax.send( JSON.stringify({
            dan: danUSedmici,
            semestar: trenutniSemestar,
            pocetak: pocetakInput,
            kraj: krajInput,
            naziv: odabranaSala,
            predavac: JohnDoe,
            checkboxChecked: checkboxVrijednost
        }) );
            else ajax.send( JSON.stringify({
                datum: odabraniDatum,
                pocetak: pocetakInput,
                kraj: krajInput,
                naziv: odabranaSala,
                predavac: JohnDoe,
                checkboxChecked: checkboxVrijednost
            }) );

        }

        function inicijalizirajPocetnuSlikamaImpl(){
            var ajax = new XMLHttpRequest();
            ajax.onreadystatechange = function() {
                if (ajax.readyState == 4 && ajax.status == 200){
                    var vraceniInfo = JSON.parse(ajax.responseText);   
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


                    if( vraceniInfo.slike.length < 4 ) document.getElementById("dalje").disabled = true;
                    
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
                  if( drugaSlika.alt == "DrugaSlika" ) {  drugiDiv.style.visibility = 'hidden';  console.log("ok"); }         
                  if( trecaSlika.alt == "TrecaSlika" )   treciDiv.style.visibility = 'hidden';            


              }
              if (ajax.readyState == 4 && ajax.status == 404)
                alert("Error");
        }
        ajax.open("GET", "inicijalneSlike", true);
        ajax.send();
    }

    function izmjenaSlikaImpl(jesteDalje){
        var ajax = new XMLHttpRequest();
        ajax.onreadystatechange = function() {
            if (ajax.readyState == 4 && ajax.status == 200){
                var vraceniInfo = JSON.parse(ajax.responseText);   
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
              if( drugaSlika.alt == "DrugaSlika" ) {  drugiDiv.style.visibility = 'hidden';  console.log("ok"); }         
              if( trecaSlika.alt == "TrecaSlika" )   treciDiv.style.visibility = 'hidden';   
          }

          if (ajax.readyState == 4 && ajax.status == 404)
            alert("Error");
    }
    var imgJedan = document.getElementById("prvaSlika").src.split("/");
    var prviZahtjev = imgJedan[imgJedan.length - 1];
    var imgDva = document.getElementById("drugaSlika").src.split("/");
    var drugiZahtjev = imgDva[imgDva.length - 1];
    var imgTri = document.getElementById("trecaSlika").src.split("/");
    var treciZahtjev = imgTri[imgTri.length - 1];
    ajax.open("GET", "izmjenaSlika?prva=" + prviZahtjev + "&treca=" + treciZahtjev + "&jesteDalje=" + jesteDalje, true);
    ajax.send();
}

return {
    dobaviZauzeca: dobaviZauzecaImpl,
    rezervisiTermin: rezervisiTerminImpl,
    inicijalizirajPocetnuSlikama: inicijalizirajPocetnuSlikamaImpl,
    izmjenaSlika: izmjenaSlikaImpl
}
}());

