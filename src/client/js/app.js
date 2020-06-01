/* Global Variables */
// const key = "640d86edfe23e3808211ce8a24c6436f&units=imperial";

const url_a = "http://api.geonames.org/searchJSON?q=";
const url_b = "&maxRows=1&username=abhinavsaurav";
const weatherUrlA = "https://api.weatherbit.io/v2.0/forecast/daily?";
const weatherUrlKey = "fe37d1548cf04ea093ee4708a37fddb2";
let x;
let geoData = {};

/**
 * @description It fetches JSON data from the web API
 * @param  placename This zip code of the place
 * @returns weather data in JSON format
 *
 */

const getPlaceData = async (placename) => {
	const placeUrl = url_a + placename + url_b;
	const placeData = await fetch(placeUrl);
	try {
		const retPlace = await placeData.json();
		console.log(retPlace);
		return retPlace;
	} catch (error) {
		console.log("Error", error);
	}
};

/**
 * @description The data is send to the server
 * @param  url the url route for the server to add the data
 * @param  data the JSON data
 *
 */
const postData = async (url = "", data = {}) => {
	const response = await fetch(url, {
		method: "POST",
		credentials: "same-origin",
		headers: {
			"Content-Type": "application/JSON",
		},
		body: JSON.stringify(data),
	});
	try {
		const newData = await response.json();
		console.log(`Received Post data: ${newData}`);
		return newData;
	} catch (error) {
		console.log(`error: ${error}`);
	}
};

/**
 * @description This function updates the UI dynamically
 *
 */

const updateUI = async () => {
	const request = await fetch("http://localhost:3000/projData");
	try {
		const receivedData = await request.json();
		geoData = receivedData;
		console.log(geoData);
		document.getElementById("temp").innerHTML =
			"Latitude: " + receivedData.latitude;
		document.getElementById("date").innerHTML =
			"Longitude: " + receivedData.longitude;
		document.getElementById("content").innerHTML =
			"Country: " + receivedData.country;
	} catch (error) {
		console.log("Exception occured in update UI", error);
	}
};

/**
 *
 * @description Event listener for fetching the data values
 *
 */

document.getElementById("generate").addEventListener("click", executeTask);

function executeTask(e) {
	const placename = document.getElementById("placename").value;
	const feelings = document.getElementById("feelings").value;
	const receivedDate = document.getElementById("travelDate").value;

	if (receivedDate) {
		/**
		 *
		 * @description arrow function for countdown
		 *
		 */

		clearInterval(x);
		x = setInterval(() => {
			let today = new Date();
			let journeyDate = new Date(receivedDate);
			let remainingSeconds = journeyDate.getTime() - today.getTime();

			var days = Math.floor(remainingSeconds / (1000 * 60 * 60 * 24));
			var hours = Math.floor(
				(remainingSeconds % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
			);
			var minutes = Math.floor(
				(remainingSeconds % (1000 * 60 * 60)) / (1000 * 60)
			);
			var seconds = Math.floor((remainingSeconds % (1000 * 60)) / 1000);
			document.getElementById("countdown").innerHTML =
				days + "d " + hours + "h " + minutes + "m " + seconds + "s ";

			// If the count down is over, write some text
			if (remainingSeconds < 0) {
				clearInterval(x);
				document.getElementById("countdown").innerHTML = "EXPIRED COUNTDOWN";
			}
		}, 1000);
	} else {
		document.getElementById("error").innerHTML =
			"Something is Missing! check values";
		return;
	}

	getPlaceData(placename)
		.then(async (data) => {
			console.log(data.geonames[0].lng);
			let jsonData = {
				longitude: data.geonames[0].lng,
				latitude: data.geonames[0].lat,
				country: data.geonames[0].countryName,
			};

			postData("http://localhost:3000/addToProjData", jsonData);
		})
		.then(() => updateUI())
		.then(async () => {
			// https://api.weatherbit.io/v2.0/forecast/daily?lat=51.50853&lon=-0.12574&key=fe37d1548cf04ea093ee4708a37fddb2
			const weatherUrl = `${weatherUrlA}lat=${geoData.latitude}&lon=${geoData.longitude}&key=${weatherUrlKey}`;
			const weatherData = await fetch(weatherUrl);
			try {
				const retWeather = await weatherData.json();
				console.log(retWeather);
				return retWeather;
			} catch (error) {
				console.log("Error", error);
			}
		})
		.then(async (data1) => {
			document.getElementById(
				"weather"
			).innerHTML = `${data1.data[0].weather.description} <img src="./images/${data1.data[0].weather.icon}.png">`;
		});
}

export { executeTask };
