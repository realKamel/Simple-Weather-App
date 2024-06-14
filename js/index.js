"use strict"
const months = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];
let city = document.querySelector(".my-city");
let myDate = document.querySelector(".date .content p");
let myDegree = document.querySelector(".my-degree");
let myCond = document.querySelector(".kind-name");
let myIcon = document.querySelector(".kind .icon img");
let loader = document.querySelector(".my-loader");
let windSpeed = document.querySelector(".wind-speed");
let rainChance = document.querySelector(".rain-chance");
let windDir = document.querySelector(".wind-dir");
let windArrow = document.querySelector(".wind-arr");

let directions = {
	N: "north wind",
	NNE: "north-northeast wind",
	NE: "northeast wind ",
	ENE: "east-northeast wind",
	E: "east wind",
	ESE: "east-southeast wind",
	SE: "southeast wind",
	SSE: "south-southeast wind ",
	S: "south wind",
	SSW: "south-southwest wind ",
	SW: "southwest wind",
	WSW: "west-southwest wind",
	W: "west wind",
	WNW: "west-northwest wind",
	NW: "northwest wind",
	NNW: "north-northwest wind",
}


async function getWeatherData(q) {
	let response = await fetch(`http://api.weatherapi.com/v1/forecast.json?key=2507a24fdbbf42b28b4130022241306&q=${q}&days=3`);
	let data = await response.json();
	return data;
};

async function weather(q) {

	try {
		loader.classList.remove("d-none");
		let data = await getWeatherData(q);
		console.log("this is me");
		console.log(data);

		const date = new Date(`${data.location.localtime}`);

		city.innerHTML = `${data.location.name} ,${data.location.country}`;
		myDate.innerHTML = `Today , ${date.getDate()}  ${months[ date.getMonth() ]}`;
		myDegree.innerHTML = `${data.current.temp_c}°`;
		myCond.innerHTML = `${data.current.condition.text}`;
		myCond.innerHTML = `${data.current.condition.text}`;
		myIcon.src = `https:${data.current.condition.icon}`;
		windSpeed.innerHTML = `${data.current.wind_kph} `;
		rainChance.innerHTML = `${data.current.humidity} `;
		windDir.innerHTML = `${directions[ data.current.wind_dir ]}`;
		windArrow.style.transform = `rotate(${data.current.wind_degree - 45}deg)`;

	} catch (error) {
		console.log("Error Happened");

	} finally {
		loader.classList.add("d-none");
	}
}



function successCallback(position) {
	const latitude = position.coords.latitude;
	const longitude = position.coords.longitude;
	console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
	weather(`${latitude},${longitude}`);
}

function errorCallback(error) {
	console.warn(`ERROR(${error.code}): ${error.message}`);
}

const options = {
	enableHighAccuracy: true, // Use high accuracy if available
	timeout: 5000,            // Timeout after 5 seconds
	maximumAge: 0             // Do not use cached position
};

let loc = navigator.geolocation.getCurrentPosition(successCallback, errorCallback, options);

