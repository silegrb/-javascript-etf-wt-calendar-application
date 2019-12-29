window.onload = Pozivi.inicijalizirajPocetnuSlikama();
document.getElementById("nazad").disabled = true;

function clickNazad(){
	Pozivi.izmjenaSlika(0);
}

function clickDalje(){
	document.getElementById("nazad").disabled = false;
	Pozivi.izmjenaSlika(1);
}