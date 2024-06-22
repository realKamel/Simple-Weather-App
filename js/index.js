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
	NNE: "North wind",
	NE: "North East wind ",
	ENE: "East wind",
	E: "East wind",
	ESE: "East wind",
	SE: "South East wind",
	SSE: "South wind ",
	S: "South wind",
	SSW: "South wind ",
	SW: "South West wind",
	WSW: "West wind",
	W: "West wind",
	WNW: "West wind",
	NW: "North West wind",
	NNW: "North wind",
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
	"sunny-sky",
];
// to handle user location
let userLocation = sessionStorage.getItem( "userLocation" );
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

// search method
const searchInput = document.getElementById( "floatingSearch" );
const searchBtn = document.getElementById( "searchBtn" );

const dangerAlert = document.getElementById( "dangerAlert" );

// data list for search results
const dataList = document.getElementById( "datalistOptions" );

async function getWeatherData ( q ) {
	try {
		dangerAlert.classList.add( "d-none" );
		let response = await fetch(
			`http://api.weatherapi.com/v1/forecast.json?key=2507a24fdbbf42b28b4130022241306&q=${ q }&days=3`
		);
		if ( !response.ok ) {
			dangerAlert.classList.remove( "d-none" );
			throw new Error( `HTTP error! status: ${ response.status }` );
		}
		if ( response.status !== 200 ) {
			if ( data.error.code === 1006 ) console.log( "No matching location found." );
			console.log( dangerAlert );
			dangerAlert.classList.remove( "d-none" );
		}
		return await response.json();
	} catch ( error ) {
		console.error( "Error fetching weather data:", error );
		return null;
	}
}

async function updateForecast ( dayElement, obj ) {
	let objDate = new Date( obj.date );
	dayElement.dayName.innerHTML = Days[ objDate.getDay() ]; // getDay() return day number as Sunday - Saturday : 0 - 6
	dayElement.hDegree.innerHTML = `${ obj.day.maxtemp_c }°C`;
	dayElement.lDegree.innerHTML = `${ obj.day.mintemp_c }°C`;
	dayElement.kindIcon.src = `https:${ obj.day.condition.icon }`;
	dayElement.kindName.innerHTML = obj.day.condition.text;
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
		myIcon.src = `https:${ data.current.condition.icon }`;
		windSpeed.innerHTML = `${ data.current.wind_kph }  `;
		rainChance.innerHTML = `${ data.current.humidity } `;
		windDir.innerHTML = `${ directions[ data.current.wind_dir ] } `;
		windArrow.style.transform = `rotate(${ data.current.wind_degree - 45 }deg)`;
		console.log( "writing data to html" );

		await changeSkin( data.current.condition.text.toLowerCase() );
		await updateForecast(
			{
				dayName: tomorrowDayName,
				hDegree: tomorrowHDegree,
				lDegree: tomorrowLDegree,
				kindIcon: tomorrowKindIcon,
				kindName: tomorrowKindName,
			},
			tomorrowObj
		);
		await updateForecast(
			{
				dayName: nextDayName,
				hDegree: nextHDegree,
				lDegree: nextLDegree,
				kindIcon: nextKindIcon,
				kindName: nextKindName,
			},
			nextDayObj
		);

		console.log( "done all working" );
	} catch ( error ) {
		console.log( "Error Happened in weather()" );
	} finally {
		loader.classList.add( "d-none" );
	}
}

async function changeSkin ( weatherState ) {
	for ( const skin of skinsList ) {
		if ( myContainer.classList.contains( skin ) )
			myContainer.classList.remove( skin );
	}
	//console.log( "Weather Change to", weatherState );

	for ( const iterator of skinsList ) {
		let res = iterator.split( "-" );
		if ( weatherState.includes( res[ 0 ] ) ) {
			console.log( weatherState, res[ 0 ] );
			myContainer.classList.add( iterator );
			break;
		}
	}
}

// for GeoApi and locating user
if ( userLocation === null ) {
	function successCallback ( position ) {
		const latitude = position.coords.latitude;
		const longitude = position.coords.longitude;
		console.log( `Latitude: ${ latitude }, Longitude: ${ longitude }` );
		sessionStorage.setItem(
			"userLocation",
			JSON.stringify( `${ latitude },${ longitude }` )
		);
		weather( `${ latitude },${ longitude }` );
	}
	function errorCallback ( error ) {
		weather( "Cairo" );
		console.warn( `ERROR(${ error.code }): ${ error.message }` );
	}
	const options = {
		enableHighAccuracy: true, // Use high accuracy if available
		timeout: 5000, // Timeout after 5 seconds
		maximumAge: 0, // Do not use cached position
	};
	loader.classList.remove( "d-none" );
	navigator.geolocation.getCurrentPosition(
		successCallback,
		errorCallback,
		options
	);
	loader.classList.remove( "d-none" );
} else {
	// if user have the same session it will return his location
	weather( JSON.parse( userLocation ) );
}

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
