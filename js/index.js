"use strict"
const months = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];
const Days = [ "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday" ];
const directions = {
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

// today data
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
// second Day data
let tomorrowDayName = document.querySelector(".tomorrow-day-name");
let tomorrowHDegree = document.querySelector(".tomorrow-Hdegree");
let tomorrowLDegree = document.querySelector(".tomorrow-Ldegree");
let tomorrowKindIcon = document.querySelector(".tomorrow-kind img");
let tomorrowKindName = document.querySelector(".tomorrow-kind span.name");
//Third day data
let nextDayName = document.querySelector(".next-day-name");
let nextHDegree = document.querySelector(".next-Hdegree");
let nextLDegree = document.querySelector(".next-Ldegree");
let nextKindIcon = document.querySelector(".next-kind img");
let nextKindName = document.querySelector(".next-kind span.name");



async function getWeatherData(q) {
	let response = await fetch(`http://api.weatherapi.com/v1/forecast.json?key=2507a24fdbbf42b28b4130022241306&q=${q}&days=3`);
	let data = await response.json();
	return data;
};
async function tomorrow(obj) {
	console.log(obj);
	let tomorrowDate = new Date(obj.date);
	let tomorrowName = Days[ tomorrowDate.getDay() ]; // getDay() return day number as Sunday - Saturday : 0 - 6
	tomorrowDayName.innerHTML = tomorrowName;

	tomorrowHDegree.innerHTML = `${obj.day.maxtemp_c}°C`;
	tomorrowLDegree.innerHTML = `${obj.day.mintemp_c}°C`;

	console.log(obj.day.condition.icon);
	console.log(tomorrowKindIcon)
	tomorrowKindIcon.src = `https:${obj.day.condition.icon}`;

	tomorrowKindName.innerHTML = obj.day.condition.text;
}
async function nextDay(obj) {
	console.log(obj);
	let nextDayDate = new Date(obj.date);
	let nextDayObjName = Days[ nextDayDate.getDay() ]; // getDay() return day number as Sunday - Saturday : 0 - 6
	nextDayName.innerHTML = nextDayObjName;

	nextHDegree.innerHTML = `${obj.day.maxtemp_c}°C`;
	nextLDegree.innerHTML = `${obj.day.mintemp_c}°C`;

	console.log(obj.day.condition.icon);
	console.log(tomorrowKindIcon)
	nextKindIcon.src = `https:${obj.day.condition.icon}`;

	nextKindName.innerHTML = obj.day.condition.text;
}


async function weather(q) {

	try {
		loader.classList.remove("d-none");
		let data = await getWeatherData(q);
		let [ , tomorrowObj, nextDayObj ] = data.forecast.forecastday;

		console.log("fetch is working & destructing");

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

		console.log("writing data to html");

		await tomorrow(tomorrowObj);
		await nextDay(nextDayObj);
		console.log("done all working");
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

