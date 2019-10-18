// _ = helper functions
let domsun;
function _parseMillisecondsIntoReadableTime(timestamp) {
	//Get hours from milliseconds
	const date = new Date(timestamp * 1000);
	// Hours part from the timestamp
	const hours = '0' + date.getHours();
	// Minutes part from the timestamp
	const minutes = '0' + date.getMinutes();
	// Seconds part from the timestamp (gebruiken we nu niet)
	// const seconds = '0' + date.getSeconds();

	// Will display time in 10:30(:23) format
	return hours.substr(-2) + ':' + minutes.substr(-2); //  + ':' + s
}

// 5 TODO: maak updateSun functie
let updateSun = function(time) {
	domSun.setAttribute('data-time', time);
};
// 4 Zet de zon op de juiste plaats en zorg ervoor dat dit iedere minuut gebeurt.
let placeSunAndStartMoving = (totalMinutes, sunrise) => {
	// In de functie moeten we eerst wat zaken ophalen en berekenen.
	// Haal het DOM element van onze zon op en van onze aantal minuten resterend deze dag.
	const domTimeLeft = document.querySelector('.js-time-left');
	domSun = document.querySelector('.js-sun');
	// Bepaal het aantal minuten dat de zon al op is.
	const today = new Date();
	const minutes = today.getHours() * 60 + today.getMinutes();
	console.log('total: ' + totalMinutes);
	console.log('minutes: ' + minutes);
	// Nu zetten we de zon op de initiële goede positie ( met de functie updateSun ). Bereken hiervoor hoeveel procent er van de totale zon-tijd al voorbij is.
	if (minutes % 60 < 10) {
		//console.log("minutes: " + Math.round(minutes/60)+ ":0" + minutes%60);
		updateSun(Math.floor(minutes / 60) + ':0' + (minutes % 60));
	} else {
		updateSun(Math.floor(minutes / 60) + ':' + (minutes % 60));
		//console.log("minutes: " + Math.round(minutes/60)+ ":" + minutes%60);
	}
	// We voegen ook de 'is-loaded' class toe aan de body-tag.
	document.querySelector('.js-body').classList.add('is-loaded');
	// Vergeet niet om het resterende aantal minuten in te vullen.

	// Nu maken we een functie die de zon elke minuut zal updaten
	setInterval(function() {
		getAPI(50.8027841, 3.2097454);
	}, 60 * 1000);
	// Bekijk of de zon niet nog onder of reeds onder is
	// Anders kunnen we huidige waarden evalueren en de zon updaten via de updateSun functie.
	// PS.: vergeet weer niet om het resterend aantal minuten te updaten en verhoog het aantal verstreken minuten.
};

// 3 Met de data van de API kunnen we de app opvullen
let showResult = queryResponse => {
	console.log(queryResponse);
	// We gaan eerst een paar onderdelen opvullen
	// Zorg dat de juiste locatie weergegeven wordt, volgens wat je uit de API terug krijgt.
	const domLocation = document.querySelector('.js-location');
	domLocation.innerHTML = queryResponse.city.name;
	// Toon ook de juiste tijd voor de opkomst van de zon en de zonsondergang.
	const domsunrise = document.querySelector('.js-sunrise');
	const domsunset = document.querySelector('.js-sunset');
	domsunrise.innerHTML = _parseMillisecondsIntoReadableTime(
		queryResponse.city.sunrise
	);
	domsunset.innerHTML = _parseMillisecondsIntoReadableTime(
		queryResponse.city.sunset
	);
	// Hier gaan we een functie oproepen die de zon een bepaalde positie kan geven en dit kan updaten.
	const sunset = new Date(queryResponse.city.sunset * 1000);
	const sunrise = queryResponse.city.sunrise / 1000;
	console.log(sunset);
	placeSunAndStartMoving(
		((queryResponse.city.sunset - queryResponse.city.sunrise) / 1000) * 60,
		queryResponse.city.sunrise
	);
};

// 2 Aan de hand van een longitude en latitude gaan we de yahoo wheater API ophalen.
let getAPI = (lat, lon) => {
	// Eerst bouwen we onze url op
	let url = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=ab342d92a6fa8d23069b4ade0788c0e3&units=metric&lang=nl&cnt=1`;
	// Met de fetch API proberen we de data op te halen.
	fetch(url)
		.then(function(response) {
			return response.json();
		})
		.then(function(data) {
			showResult(data);
		});
	// Als dat gelukt is, gaan we naar onze showResult functie.
};

document.addEventListener('DOMContentLoaded', function() {
	// 1 We will query the API with longitude and latitude.
	getAPI(50.8027841, 3.2097454);
});
