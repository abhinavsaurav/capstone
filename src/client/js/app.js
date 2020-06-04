/* Global Variables */
// const key = "640d86edfe23e3808211ce8a24c6436f&units=imperial";

const url_a = "http://api.geonames.org/searchJSON?q=";
const url_b = "&maxRows=1&username=abhinavsaurav";
const weatherUrlA = "https://api.weatherbit.io/v2.0/forecast/daily?";
const weatherUrlKey = "fe37d1548cf04ea093ee4708a37fddb2";
let pixabayUrlPlusKey =
	"https://pixabay.com/api/?key=16838225-7a7a834db353d16074c9f4e39";
let x;
//let geoData = {};
let days;
let country = "";
let duration = -1;

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
 * @description This function fetches the reqested data
 *
 */

const reqData = async () => {
	const request = await fetch("http://localhost:3000/projData");
	try {
		const receivedData = await request.json();
		let geoData = receivedData;
		console.log(geoData);
		return geoData;
	} catch (error) {
		console.log("Exception occured in reqData", error);
	}
};

/**
 *
 * @description Event listener for fetching the data values
 *
 */
function eventListener1() {
	document.getElementById("generate").addEventListener("click", executeTask);
}

function executeTask(e) {
	const placename = document.getElementById("placename").value;
	// const feelings = document.getElementById("feelings").value;
	const receivedDate = document.getElementById("travelDate").value;
	const returnDate = document.getElementById("returnDate").value;
	let date1 = new Date(receivedDate);
	let date2 = new Date(returnDate);

	// To calculate the time difference of two dates
	let Difference_In_Time = date2.getTime() - date1.getTime();

	// To calculate the no. of days between two dates
	let Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
	duration = Difference_In_Days;

	document.getElementById("error").innerHTML = "";
	document.getElementById("latitude").innerHTML = "";
	document.getElementById("date").innerHTML = "";
	document.getElementById("country").innerHTML = "";
	document.getElementById("weather-descr").innerHTML = "";
	document.getElementById("weather-icon").innerHTML = "";

	document.getElementById("apiDataImage").innerHTML = ``;

	if (receivedDate && Difference_In_Days > 0) {
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

			days = Math.floor(remainingSeconds / (1000 * 60 * 60 * 24));
			let hours = Math.floor(
				(remainingSeconds % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
			);
			let minutes = Math.floor(
				(remainingSeconds % (1000 * 60 * 60)) / (1000 * 60)
			);
			let seconds = Math.floor((remainingSeconds % (1000 * 60)) / 1000);
			document.getElementById("countdown").innerHTML =
				days + "d " + hours + "h " + minutes + "m " + seconds + "s ";

			// If the count down is over, write some text
			if (remainingSeconds < 0) {
				clearInterval(x);
				document.getElementById("countdown").innerHTML = "EXPIRED COUNTDOWN";
				return;
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
			country = data.geonames[0].countryName;
			console.log(country);
			await postData("http://localhost:3000/addToProjData", jsonData);
			// document.getElementById("latitude").innerHTML =
			// 	"Latitude: " + jsonData.latitude;
			// document.getElementById("date").innerHTML =
			// 	"Longitude: " + jsonData.longitude;
			// document.getElementById("country").innerHTML =
			// 	"Country: " + jsonData.country;
		})
		.then(() => {
			return reqData();
		})
		.then(async (geoData) => {
			const weatherUrl = `${weatherUrlA}lat=${geoData.latitude}&lon=${geoData.longitude}&key=${weatherUrlKey}`;
			console.log(weatherUrl);
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
			console.log(data1);
			let weatherData = {};
			try {
				if (days < 16) {
					weatherData = {
						temperature: data1.data[days].temp,
						description: data1.data[days].weather.description,
						icon: `${data1.data[days].weather.icon}.png`,
					};
				} else if (days > 16) {
					weatherData = {
						temperature: data1.data[15].temp,
						description: data1.data[15].weather.description,
						icon: `${data1.data[15].weather.icon}.png`,
					};
				} else {
					document.getElementById("error").innerHTML = "Invalid Date value";
					return;
				}
				// document.getElementById(
				// 	"temperature"
				// ).innerHTML = `${weatherData.temperature} &#8451;`;
				// document.getElementById(
				// 	"weather-descr"
				// ).innerHTML = `Description ${weatherData.description}`;
				// document.getElementById(
				// 	"weather-icon"
				// ).innerHTML = `<img src="./images/${weatherData.icon}">`;

				await postData("http://localhost:3000/addWeatherData", weatherData);
			} catch (error) {
				console.log("error", error);
			}
		})
		.then(async () => {
			let urlPixabay = `${pixabayUrlPlusKey}&q=${placename}&category=travel&page=1&per_page=5`;
			let imageData = await fetch(urlPixabay);
			try {
				let retImageData = await imageData.json();
				console.log(retImageData);
				if (retImageData.totalHits == 0) {
					imageData = await fetch(
						`${pixabayUrlPlusKey}&q=${country}%20map&page=1&per_page=5`
					);
					try {
						retImageData = await imageData.json();
						console.log("In nested try");
						console.log(retImageData);
					} catch (error2) {
						console.log("error2", error2);
					}
				}
				console.log(retImageData);
				return retImageData;
			} catch (error) {
				console.log("error");
			}
		})
		.then(async (imageData) => {
			console.log(imageData);
			let imageData1 = {};
			if (imageData.totalHits != 0) {
				imageData1 = {
					imageUrl: imageData.hits[0].largeImageURL,
				};
			} else {
				imageData1 = {
					imageUrl:
						"https://pixabay.com/get/57e1d5424f4fad0bffd8992cc62e3f7d1d3ddce04e507440742f78dc9f48c0_1280.jpg",
				};
			}
			// document.getElementById(
			// 	"apiDataImage"
			// ).innerHTML = `<img src="${imageData1.imageUrl} alt="Data not found" width="200px" height="200px">`;

			await postData("http://localhost:3000/addImageData", imageData1);
		})
		.then(() => updateUI());
}

const updateUI = async () => {
	const request = await fetch("http://localhost:3000/projData");
	try {
		const receivedData = await request.json();
		console.log(receivedData);
		document.getElementById(
			"temperature"
		).innerHTML = `${receivedData.temperature} &#8451;`;
		document.getElementById(
			"weather-descr"
		).innerHTML = `${receivedData.description}`;
		document.getElementById(
			"weather-icon"
		).innerHTML = `<img src="./images/${receivedData.icon}">`;
		document.getElementById("duration").innerHTML =
			"duration: " + duration + " days";
		document.getElementById("latitude").innerHTML =
			"Latitude: " + receivedData.latitude;
		document.getElementById("date").innerHTML =
			"Longitude: " + receivedData.longitude;
		document.getElementById("country").innerHTML =
			"Country: " + receivedData.country;

		document.getElementById(
			"apiDataImage"
		).innerHTML = `<img src="${receivedData.imageUrl} alt="Data not found" width="200px" height="200px">`;

		// document.getElementById(
		// 	"error"
		// ).innerHTML = `<img src="https://pixabay.com/get/53e6dc434351b108f5d08460962931761637dce7564c704c7c2e7ad69e4dc25b_1280.jpg" alt="no image">`;

		document.getElementById("results").style.display = "flex";
		const sect = document.getElementById("results");
		sect.scrollIntoView({
			behavior: "smooth",
		});
	} catch (error) {
		console.log("Exception occured in Update UI", error);
	}
};

export { executeTask, eventListener1 };
