"use strict";
const months = [
	"January",
	"February",
	"March",
	"April",
	"May",
	"June",
	"July",
	"August",
	"September",
	"October",
	"November",
	"December",
];
const Days = [
	"Sunday",
	"Monday",
	"Tuesday",
	"Wednesday",
	"Thursday",
	"Friday",
	"Saturday",
];
const directions = {
	N: "North wind",
	NNE: "North northeast wind",
	NE: "North East wind ",
	ENE: "East northeast wind",
	E: "East wind",
	ESE: "East southeast wind",
	SE: "South East wind",
	SSE: "South southeast wind ",
	S: "South wind",
	SSW: "South southwest wind ",
	SW: "South West wind",
	WSW: "West southwest wind",
	W: "West wind",
	WNW: "West northwest wind",
	NW: "North West wind",
	NNW: "North northwest wind",
};

const skinsList = [
	"clear-sky",
	"cloudy-sky",
	"sleet-sky",
	"thunder-sky",
	"overcast-sky",
	"mist-sky",
	"blizzard-sky",
	"drizzle-sky",
	"rain-sky",
];
// today data
const city = document.getElementById( "my-city" );
const myDate = document.querySelector( ".date .content p" );
const myDegree = document.querySelector( ".my-degree" );
const myCond = document.getElementById( "kind-name" );
const myIcon = document.querySelector( ".kind .icon img" );
const loader = document.querySelector( ".my-loader" );
const windSpeed = document.getElementById( "wind-speed" );
const rainChance = document.querySelector( ".rain-chance" );
const windDir = document.querySelector( ".wind-dir" );
const windArrow = document.querySelector( ".wind-arr" );
const myContainer = document.querySelector( ".my-container" );
// second Day data
const tomorrowDayName = document.getElementById( "tomorrow-day-name" );
const tomorrowHDegree = document.getElementById( "tomorrow-Hdegree" );
const tomorrowLDegree = document.getElementById( "tomorrow-Ldegree" );
const tomorrowKindIcon = document.querySelector( ".tomorrow-kind img" );
const tomorrowKindName = document.querySelector( ".tomorrow-kind span.name" );
//Third day data
const nextDayName = document.getElementById( "next-day-name" );
const nextHDegree = document.getElementById( "next-Hdegree" );
const nextLDegree = document.getElementById( "next-Ldegree" );
const nextKindIcon = document.querySelector( ".next-kind img" );
const nextKindName = document.querySelector( ".next-kind span.name" );

//
const searchInput = document.getElementById( "floatingSearch" );
const searchBtn = document.getElementById( "searchBtn" );

//
const dangerAlert = document.getElementById( "dangerAlert" );

// data list for search results

const dataList = document.getElementById( "datalistOptions" );

async function getWeatherData ( q ) {
	try {
		let response = await fetch(
			`http://api.weatherapi.com/v1/forecast.json?key=2507a24fdbbf42b28b4130022241306&q=${ q }&days=3`
		);
		let data = await response.json();
		if ( response.status !== 200 ) {
			if ( data.error.code === 1006 ) console.log( "No matching location found." );
			console.log( dangerAlert );
			dangerAlert.classList.remove( "d-none" );
		}
		return data;
	} catch ( error ) {
		console.log( error );
	} finally {
		dangerAlert.classList.add( "d-none" );
	}
}

async function tomorrow ( obj ) {
	let tomorrowDate = new Date( obj.date );
	let tomorrowName = Days[ tomorrowDate.getDay() ]; // getDay() return day number as Sunday - Saturday : 0 - 6

	tomorrowDayName.innerHTML = tomorrowName;

	tomorrowHDegree.innerHTML = `${ obj.day.maxtemp_c }°C`;
	tomorrowLDegree.innerHTML = `${ obj.day.mintemp_c }°C`;

	tomorrowKindIcon.src = `https:${ obj.day.condition.icon }`;
	tomorrowKindName.innerHTML = obj.day.condition.text;
}
async function nextDay ( obj ) {
	let nextDayDate = new Date( obj.date );
	let nextDayObjName = Days[ nextDayDate.getDay() ]; // getDay() return day number as Sunday - Saturday : 0 - 6
	nextDayName.innerHTML = nextDayObjName;

	nextHDegree.innerHTML = `${ obj.day.maxtemp_c }°C`;
	nextLDegree.innerHTML = `${ obj.day.mintemp_c }°C`;

	nextKindIcon.src = `https:${ obj.day.condition.icon }`;

	nextKindName.innerHTML = obj.day.condition.text;
}
async function weather ( q ) {
	try {
		loader.classList.remove( "d-none" );
		const data = await getWeatherData( q );
		let [ , tomorrowObj, nextDayObj ] = data.forecast.forecastday;

		console.log( "fetch is working & destructing" );

		const date = new Date( `${ data.location.localtime }` );

		city.innerHTML = `${ data.location.name } ,${ data.location.country }`;

		myDate.innerHTML = `Today , ${ date.getDate() }  ${ months[ date.getMonth() ] }`;

		myDegree.innerHTML = `${ data.current.temp_c }°`;
		myCond.innerHTML = `${ data.current.condition.text }`;

		await changeSkin( data.current.condition.text.toLowerCase() );
		myIcon.src = `https:${ data.current.condition.icon }`;
		windSpeed.innerHTML = `${ data.current.wind_kph }  `;
		rainChance.innerHTML = `${ data.current.humidity } `;
		windDir.innerHTML = `${ directions[ data.current.wind_dir ] } `;
		windArrow.style.transform = `rotate(${ data.current.wind_degree - 45 }deg)`;

		console.log( "writing data to html" );

		await tomorrow( tomorrowObj );
		await nextDay( nextDayObj );
		console.log( "done all working" );
	} catch ( error ) {
		console.log( "Error Happened in weather()" );
	} finally {
		loader.classList.add( "d-none" );
	}
}

async function changeSkin ( weatherState ) {
	console.log( myContainer );
	for ( const skin of skinsList ) {
		if ( myContainer.classList.contains( skin ) )
			myContainer.classList.remove( skin );
	}
	console.log( "Weather Change to", weatherState );

	for ( const iterator of skinsList ) {
		if ( iterator.search( weatherState ) ) {
			myContainer.classList.add( iterator );
		}
	}
	/* if ( weatherState === "sunny" ) {
		myContainer.classList.add( "sunny-sky" );
	}
	else if ( weatherState === "clear" ) {
		myContainer.classList.add( "clear-sky" );
	}
	else if ( weatherState.includes( "rain" ) ) {
		myContainer.classList.add( "rain-sky" );
	}
	else if ( weatherState.includes( "drizzle" ) ) {
		myContainer.classList.add( "drizzle-sky" );
	}
	else if ( weatherState.includes( "blizzard" ) ) {
		myContainer.classList.add( "blizzard-sky" );
	}
	else if ( weatherState.includes( "mist" ) ) {
		myContainer.classList.add( "mist-sky" );
	}
	else if ( weatherState.includes( "overcast" ) ) {
		myContainer.classList.add( "overcast-sky" );
	}
	else if ( weatherState.includes( "thunder" ) ) {
		myContainer.classList.add( "thunder-sky " );
	}
	else if ( weatherState.includes( "sleet" ) ) {
		myContainer.classList.add( "sleet-sky" );
	}
	else if ( weatherState.includes( "cloudy" ) ) {
		myContainer.classList.add( "cloudy-sky" );
	} */
}

// for GetApi and locating user
function successCallback ( position ) {
	const latitude = position.coords.latitude;
	const longitude = position.coords.longitude;
	console.log( `Latitude: ${ latitude }, Longitude: ${ longitude }` );
	weather( `${ latitude },${ longitude }` );
}
function errorCallback ( error ) {
	console.warn( `ERROR(${ error.code }): ${ error.message }` );
}
const options = {
	enableHighAccuracy: true, // Use high accuracy if available
	timeout: 5000, // Timeout after 5 seconds
	maximumAge: 0, // Do not use cached position
};

navigator.geolocation.getCurrentPosition(
	successCallback,
	errorCallback,
	options
);

/* To Handel Search and Suggestions for locations */
searchBtn.addEventListener( "click", function () {
	weather( searchInput.value );
} );
async function getSearchResults ( searchValue ) {
	const response = await fetch(
		`http://api.weatherapi.com/v1/search.json?key=2507a24fdbbf42b28b4130022241306&q=${ searchValue }`
	);
	const searchResult = await response.json();
	let content = ``;

	for ( const iterator of searchResult ) {
		content += `<option value="${ iterator.name }">`;
	}
	dataList.innerHTML = content;
}
searchInput.addEventListener( "input", function () {
	if ( searchInput.value.length > 0 ) getSearchResults( searchInput.value );
} );
