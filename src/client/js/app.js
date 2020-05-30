/* Global Variables */
const key = "640d86edfe23e3808211ce8a24c6436f&units=imperial";
const url_a = "http://api.openweathermap.org/data/2.5/weather?zip=";
const url_b = "&appid=";

// Create a new date instance dynamically with JS
let d = new Date();
let newDate = d.getMonth() + "." + d.getDate() + "." + d.getFullYear();

/**
 * @description It fetches JSON data from the web API
 * @param  zipp This zip code of the place
 * @returns weather data in JSON format
 *
 */

const getWeather = async (zipp) => {
	const weatherUrl = url_a + zipp + url_b + key;
	const weatherData = await fetch(weatherUrl);
	try {
		const retWeather = await weatherData.json();
		console.log(retWeather);
		return retWeather;
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
		document.getElementById("temp").innerHTML =
			"The temperature in the area: " + receivedData.temperature;
		document.getElementById("date").innerHTML =
			"Today's date: " + receivedData.date;
		document.getElementById("content").innerHTML =
			"Users response: " + receivedData.userResponse;
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
	const zip = document.getElementById("zip").value;
	const feelings = document.getElementById("feelings").value;
	getWeather(zip)
		.then(async (data) => {
			console.log(data.main.temp);
			let jsonData = {
				temperature: data.main.temp,
				date: newDate,
				userResponse: feelings,
			};

			postData("http://localhost:3000/addToProjData", jsonData);
		})
		.then(() => updateUI());
}

export { executeTask };
