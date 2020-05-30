// Setup empty JS object to act as endpoint for all routes
projectData = {};

// Require Express to run server and routes
const express = require("express");

// Start up an instance of app
const app = express();

/* Middleware*/
const bodyParser = require("body-parser");
//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Cors for cross origin allowance
const cors = require("cors");
app.use(cors());

// Initialize the main project folder
app.use(express.static("dist"));

// Setup Server

const port = 3000;
const server = app.listen(port, listening);

function listening() {
	console.log("Server Started");
	console.log(`Sever Running at port:${port}`);
}

app.get("/projData", retProjData);

/**
 *
 * @description Returns the JS endpoint object value
 *
 */

function retProjData(req, res) {
	console.log(projectData);
	res.send(projectData);
}

/**
 *
 * @description Used for adding the data to the JS endpoint object value
 *
 */

app.post("/addToProjData", addToProjectData);
function addToProjectData(req, res) {
	//check the u_response and also do we need to add it to array?
	console.log(req.body);
	projectData = {
		temperature: req.body.temperature,
		date: req.body.date,
		userResponse: req.body.userResponse,
	};
	console.log(`Inisde Adding ProjData ${projectData}`);
}
