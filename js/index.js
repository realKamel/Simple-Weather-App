//get all input elements

var nameInput = document.getElementById("floatingName");
var emailInput = document.getElementById("floatingEmail");
var passwordInput = document.getElementById("floatingPassword");

//alert  sign up elements
var alertNameMsg = document.getElementById("validNameAlert");
var alertPassMsg = document.getElementById("validPassAlert");
var alertUQMsg = document.getElementById("alertUQEmail");
var alertEmailChecks = document.getElementById("emailChecks");
//alert log in elements
var emailLoginCheck = document.getElementById("emailLoginCheck");
var passLoginCheck = document.getElementById("passLoginCheck");

var usersList = [];

// get local storage content if exist
if (null != localStorage.getItem("usersList"))
	usersList = JSON.parse(localStorage.getItem("usersList"));

function clearSignUpForm() {
	nameInput.value = null;
	nameInput.classList.remove("is-valid");

	emailInput.value = null;
	emailInput.classList.remove("is-valid");

	passwordInput.value = null;
	passwordInput.classList.remove("is-valid");
}

//to check if mail follow the regex
function signUpNameValidation() {
	var regex = /^[A-Z][a-zA-Z '.-]*[A-Za-z]$/;

	if (regex.test(nameInput.value)) {
		nameInput.classList.remove("is-invalid");
		nameInput.classList.add("is-valid");

		alertNameMsg.classList.add("d-none");

		return true;
	} else {
		nameInput.classList.remove("is-valid");
		nameInput.classList.add("is-invalid");

		alertNameMsg.classList.remove("d-none");
		return false;
	}
}

//to check if password follow regex
function signUpPassValidation() {
	var regex = /^[A-Za-z\d]{3,}$/;

	if (regex.test(passwordInput.value)) {
		passwordInput.classList.remove("is-invalid");
		passwordInput.classList.add("is-valid");

		alertPassMsg.classList.add("d-none");

		return true;
	} else {
		passwordInput.classList.remove("is-valid");
		passwordInput.classList.add("is-invalid");

		alertPassMsg.classList.remove("d-none");

		return false;
	}
}

function signUpEmailValidation() {
	var regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

	if (regex.test(emailInput.value) && isUniqueEmail(emailInput.value)) {
		emailInput.classList.remove("is-invalid");
		emailInput.classList.add("is-valid");
		alertEmailChecks.classList.add("d-none");
		return true;
	} else {
		emailInput.classList.remove("is-valid");
		emailInput.classList.add("is-invalid");

		alertEmailChecks.classList.remove("d-none");

		return false;
	}
};

function isUniqueEmail(email) {
	if (usersList.length == 0) {
		return true;
	} else {
		for (var i = 0; i < usersList.length; i++) {
			if (usersList[ i ].email.toLowerCase() === email.toLowerCase()) {
				console.log("exist");
				alertUQMsg.classList.remove("d-none");
				return false;
			}
		}
		// If we finish the loop without finding a match, the email is unique
		alertUQMsg.classList.add("d-none");
		console.log("new");
		return true;
	}
}

function signUpUser() {
	if (
		signUpNameValidation() &&
		signUpEmailValidation() &&
		signUpPassValidation()
	) {
		var userData = {
			name: nameInput.value,
			email: emailInput.value,
			password: passwordInput.value,
		};
		clearSignUpForm();
		usersList.push(userData);
		localStorage.setItem("usersList", JSON.stringify(usersList));
		window.location.href = "index.html";
	} else console.log("error in signUpUser()");
};



function loginUser() {
	var emailFound = false;
	var passwordCorrect = false;

	for (var i = 0; i < usersList.length; i++) {
		if (usersList[ i ].email.toLowerCase() == emailInput.value.toLowerCase()) {
			emailFound = true;
			if (usersList[ i ].password == passwordInput.value) {
				passwordCorrect = true;
				console.log("user exist");
				sessionStorage.setItem("currentUser", JSON.stringify(usersList[ i ]));
				window.location.href = "home.html";
				break;  // Exit the loop once the user is found and authenticated
			}
		}
	}
	if (!emailFound) {
		emailLoginCheck.classList.remove("d-none");
	} else {
		emailLoginCheck.classList.add("d-none");
		if (!passwordCorrect) {
			passLoginCheck.classList.remove("d-none");
		} else {
			passLoginCheck.classList.add("d-none");
		}
	}
}


var currentUser = JSON.parse(sessionStorage.getItem("currentUser"))

function greetingMsg() {

	console.log(currentUser);
	document.getElementById("welcomeMsg").innerText =
		`
		Welcome ${currentUser.name}
		`;
}

function logUserOut() {
	sessionStorage.removeItem("currentUser");
	window.location.href = "index.html";
}

if (null != currentUser) {
	greetingMsg();
}
