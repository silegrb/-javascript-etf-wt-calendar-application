window.onload = Pozivi.inicijalizirajPocetnuSlikama();
document.getElementById("nazad").disabled = true;
var ucitaneSlike = {slike:[]};
var neZoviViseServer = false;
function clickNazad(){
	document.getElementById("dalje").disabled = false;
	var imgJedan = document.getElementById("prvaSlika").src.split("/");
	var prviZahtjev = imgJedan[imgJedan.length - 1];
	var indexNazad = -1;
	for( var i = 0; i < ucitaneSlike.slike.length; i++ ){
		if( prviZahtjev == ucitaneSlike.slike[i] ){
			indexNazad = i - 1;
			break;
		}
	}
	if( indexNazad == 2 ) document.getElementById("nazad").disabled = true;
	var vraceniInfo = {slike:[]};
	for( var i = indexNazad - 2; i <= indexNazad; i++ )
		vraceniInfo.slike.push( ucitaneSlike.slike[i] );	
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

function clickDalje(){
	document.getElementById("nazad").disabled = false;
	if(  neZoviViseServer ){
		var slikaTri = document.getElementById("trecaSlika").src.split("/");
		var nazivSlikeTri = slikaTri[slikaTri.length-1];
		var indexDalje = -1;
		for( var i = 0; i < ucitaneSlike.slike.length; i++ )
		{
			if( nazivSlikeTri == ucitaneSlike.slike[i] ) indexDalje = i+1;
		}
		var vraceniInfo = {slike:[]};
		for( var i = indexDalje; i < ucitaneSlike.slike.length; i++  )
			vraceniInfo.slike.push( ucitaneSlike.slike[i] );
		if( indexDalje + 3 > ucitaneSlike.slike.length - 1 ) document.getElementById("dalje").disabled = true;
		else document.getElementById("dalje").disabled = false;
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
	else{
		Pozivi.izmjenaSlika();
		console.log("---POZVAO SERVER---");
	}
}