const landing = document.getElementById("landing");
const landingButton = document.getElementById("landingButton");
let lastKnownScrollPosition = 0;
let ticking = false;

let willScroll = true;
let scrollDownDelay;

const landingText = document.querySelector(".landingText");

const sectionTextBoxR = document.querySelectorAll(".sectionTextBoxR");
const sectionImgBoxR = document.querySelectorAll(".sectionImgBoxR");

const sectionTextBoxL = document.querySelectorAll(".sectionTextBoxL");
const sectionImgBoxL = document.querySelectorAll(".sectionImgBoxL");

let lastScrollTop = 0;

const sec = document.querySelectorAll(".sec");

const commandsTable = document.getElementById("commandsTable");

const login = document.getElementById("Login");

const loginCard = document.querySelector(".loginCard");

const loginForm = document.querySelectorAll(".loginForm");

const register = document.getElementById("Register");

const registerCard = document.querySelector(".registerCard");

const registerForm = document.querySelectorAll(".registerForm");

const errorPage = document.getElementById("Error");

const errorCard = document.querySelector(".errorCard");

const accCard = document.querySelectorAll(".accCard");

const accForm = document.querySelectorAll(".accForm");

const otp = document.getElementById("otp");

const otpCard = document.querySelector(".otpCard");

const otpForm = document.querySelectorAll(".otpForm");

const changePassword = document.getElementById("changePassword");

const changePasswordCard = document.querySelector(".changePasswordCard");

const changePasswordForm = document.querySelectorAll(".changePasswordForm");

const forgotPass = document.getElementById("forgotPass");

const forgotPassCard = document.querySelector(".forgotPassCard");

const forgotPassForm = document.querySelectorAll(".forgotPassForm");

const forgotPassOtp = document.getElementById("forgotPassOtp");

const forgotPassResend = document.getElementById("forgotPassResend");

const forgotPassBtn = document.getElementById("forgotPassBtn");

const registeredEmail = document.getElementById("registeredEmail");

const registeredEmailCheck = document.getElementById("registeredEmailCheck");

const otpResend = document.getElementById("otpResend");

const resendLine = document.getElementById("resendLine");

const resendTimer = document.getElementById("resendTimer");

const navbar = document.querySelector(".navbar");

const otpInputs = document.querySelectorAll(".otp");

const changelog = document.getElementById("changelog");

let colorMode;
let userLog;

// Spinner

function showLoadingIcon() {
	$("#spinner").show();
}

function hideLoadingIcon() {
	$("#spinner").hide();
}

function retrieveData(request) {
	// Retrieve data from JSON file
	let jsonData = localStorage.getItem("dostData");

	if (jsonData) {
		let data = JSON.parse(jsonData);
		if (request === "getColourMode") {
			return data["colourModeData"] ?? "dark";
		} else if (request === "getUserLog") {
			return data["userLogged"];
		}
	} else {
		// If file not present , creates a new file and sets default value for colorMode and userLog
		let dataN = {
			["colourModeData"]: colorMode,
			["userLogged"]: "notLogged",
		};
		let jsonDataN = JSON.stringify(dataN);
		// Store data in JSON file
		localStorage.setItem("dostData", jsonDataN);
		//
		if (request === "getColourMode") {
			return "dark";
		} else if (request === "getUserLog") {
			return "notLogged";
		}
	}
}

// storeLoginData('Logged');

window.addEventListener("load", (event) => {
	colorMode = retrieveData("getColourMode");
	applyColourMode(colorMode);
	console.log(`colour mode is - ${colorMode}`);
});

if (history.scrollRestoration) {
	history.scrollRestoration = "manual";
} else {
	window.onbeforeunload = function () {
		window.scrollTo(0, 0);
	};
} // For not scrollling to earlier scroll position upon refresh

// For locking navbar to top
const navAnimation = function () {
	let st = document.documentElement.scrollTop; // Credits: "https://github.com/qeremy/so/blob/master/so.dom.js#L426"
	if (st > lastScrollTop) {
		// downscroll code
		document.querySelector(".navbar").classList.remove("nav-active");
		document.querySelector(".navbar").classList.add("nav-hidden");
	} else if (st < lastScrollTop) {
		// upscroll code
		document.querySelector(".navbar").classList.remove("nav-hidden");
		document.querySelector(".navbar").classList.add("nav-active");
	} // else was horizontal scroll
	lastScrollTop = st <= 0 ? 0 : st; // For Mobile or negative scrolling
};

window.addEventListener(
	"scroll",
	function () {
		if (!landing) {
			navAnimation();
		} else if (landing && landing.classList.contains("hidden")) {
			navAnimation();
		}
	},
	false
);

function disableScroll() {
	document.body.classList.add("stop-scrolling");
} //in use currently

function enableScroll() {
	document.body.classList.remove("stop-scrolling");
} //in use currently

// Define the breakpoints
const breakpoints = {
	small: "(max-width: 576px)",
	medium: "(min-width: 577px) and (max-width: 767px)",
	large: "(min-width: 768px)",
};

// Attach the event listener
window.addEventListener("resize", handleWindowResize);

// Initial call to handle the current breakpoint
handleWindowResize();

// For handling landing page-----------------------------------------------------------------------------
if (landing && !landing.classList.contains("hidden")) {
	document.querySelector(".navbar").classList.add("navbefore");
	document.querySelector(".navbar").classList.remove("fixed-top");
	window.addEventListener("load", (event) => {
		var image = document.querySelector(".landingImg");
		var isLoaded = image.complete && image.naturalHeight !== 0;
		if (isLoaded) {
			document.body.style.display = "block";
		}
	});
	disableScroll();
	//Landing animation(2)---------One step go

	setTimeout(function () {
		document.querySelector(".image-container").classList.add("fade-in");
		landingText.classList.remove("hidden"); // runs first
		landingText.classList.add("lineUp"); // runs second
		// landingText.classList.add("typewriterLanding"); // runs second
		landingButton.classList.remove("hidden");
		landingButton.classList.add("lineUp");
	}, 10);
	//
	landingButton.addEventListener("click", function () {
		willScroll = false;
		enableScroll();
		document.querySelector(".navbar").classList.add("fixed-top");
		document.querySelector(".navbar").classList.add("navafter");
		document
			.getElementById("landto")
			.scrollIntoView({ behavior: "smooth" });
		setTimeout(() => {
			landing.classList.add("hidden");
			document.querySelector(".navbar").classList.remove("navafter");
			document.querySelector(".navbar").classList.remove("navbefore");
		}, scrollDownDelay);
	}); //Closes landing part through button
}

// Function to handle the breakpoint changes
function handleBreakpointChange(breakpoint) {
	if (breakpoint === "small") {
		// Code for small screens
		scrollDownDelay = 1300;
		// Not working currently
	} else if (breakpoint === "medium") {
		// Code for medium screens
		scrollDownDelay = 1000;
	} else if (breakpoint === "large") {
		// Code for large screens
		scrollDownDelay = 700;
	}
}

//Function to handle navbar toggler

const navbarToggler = document.getElementById("navbarToggler");
function navbarToggle() {
	document.addEventListener("click", function (event) {
		let isClickInside = navbar.contains(event.target);
		if (!isClickInside) {
			if (navbarToggler.getAttribute("aria-expanded") === "true") {
				navbarToggler.click();
			}
		}
	});
}

// Function to handle the window resize event
function handleWindowResize() {
	for (let breakpoint in breakpoints) {
		if (window.matchMedia(breakpoints[breakpoint]).matches) {
			handleBreakpointChange(breakpoint);
		}
		var windowWidth = window.innerWidth;
		if (windowWidth < 992) {
			navbarToggle();
		}
	}
}

// For handling sections-----------------------------------------------------------------------------
// to handle scroll and animate sections
if (document.title == "Home | DOST") {
	const toastLiveExample = document.getElementById("signUpToast");

	const toastBootstrap =
		bootstrap.Toast.getOrCreateInstance(toastLiveExample);
	for (let i = 1; i < 5; i++) {
		document
			.getElementById(`arrow${i}`)
			.addEventListener("click", function () {
				document
					.getElementById(`section${i + 1}`)
					.scrollIntoView({ behavior: "smooth" });
			});
	}

	$(document).ready(function () {
		let ids = ["section1", "section2", "section3", "section4", "section5"];
		let scrollCount = [1, 1, 1, 1, 1];

		for (let i = 0; i < ids.length; i++) {
			$("#" + ids[i]).scrollex({
				top: "5%",
				enter: function () {
					// console.log('Element ' + ids[i] + ' entered the viewport');

					if (scrollCount[i] == 1) {
						document
							.getElementById(ids[i])
							.classList.add("typewriter");
						// console.log(`scrolling to section${i + 1}`);
						let currentSection = document.getElementById(ids[i]);
						if (i % 2 == 0) {
							currentSection
								.querySelector(".hideTextEven")
								.classList.add("showTextEven");
						} else {
							currentSection
								.querySelector(".hideTextOdd")
								.classList.add("showTextOdd");
						}

						currentSection
							.querySelector(".hideImg")
							.classList.add("showImg");

						// For signUp Toast
						if (i == 4) {
							userLog = retrieveData("getUserLog");
							if (userLog === "notLogged") {
								setTimeout(function () {
									toastBootstrap.show();
								}, 4000);
							}
						}
					}
					scrollCount[i] = 0;
				},
				leave: function () {
					// console.log('Element ' + ids[i] + ' left the viewport');
				},
			});
		}
	});
}

// For dark-light modes
function storeColourMode(colour) {
	let jsonData1 = localStorage.getItem("dostData");
	if (jsonData1) {
		let data = JSON.parse(jsonData1);
		data["colourModeData"] = colour;
		let jsonData2 = JSON.stringify(data);
		localStorage.setItem("dostData", jsonData2);
	}
}

// Light-dark mode (default dark mode)
function applyColourMode(toColourMode) {
	if (toColourMode === "light") {
		//Light mode

		//Body
		document.body.classList.remove("bodyDark");
		document.body.classList.add("bodyLigt");

		//Navbar
		document.querySelector(".lightDark").src = document
			.querySelector(".lightDark")
			.src.replace("dark", "light");

		// Entry field function
		function entryField(fieldList) {
			for (let i = 0; i < fieldList.length; i++) {
				fieldList[i].style.backgroundColor = "#ffffff";
			}
			for (let i = 0; i < fieldList.length; i++) {
				if (fieldList[i].classList.contains("form-control")) {
					fieldList[i].classList.remove("darkPlaceholder");
					fieldList[i].classList.remove("text-light");
				}
			}
		}

		// Handle card colours
		function cardColor(card) {
			if (card.length > 1) {
				for (let i = 0; i < card.length; i++) {
					card[i].classList.remove("bg-dark");
					card[i].classList.remove("text-light");
					card[i].classList.add("bg-light");
					card[i].classList.add("text-dark");
				}
			} else {
				card.classList.remove("bg-dark");
				card.classList.remove("text-light");
				card.classList.add("bg-light");
				card.classList.add("text-dark");
			}
		}

		// Commands
		if (commandsTable) {
			commandsTable.classList.remove("table-dark");
		}
		// Login
		if (login) {
			cardColor(loginCard);
			entryField(loginForm);
		}
		// Register
		if (register) {
			cardColor(registerCard);
			entryField(registerForm);
		}

		// Account
		if (document.title === "Account | DOST") {
			cardColor(accCard);
			entryField(accForm);
			document.getElementById("deleteAccount").style.color = "black";
		}

		// OTP
		if (otp) {
			cardColor(otpCard);
			entryField(otpForm);
		}

		// Change password
		if (changePassword) {
			cardColor(changePasswordCard);
			entryField(changePasswordForm);
		}

		// Forgot pass
		if (forgotPass) {
			cardColor(forgotPassCard);
			entryField(forgotPassForm);
		}

		// Error oage
		if (errorPage) {
			cardColor(errorCard);
		}

		// Changelog
		if (changelog) {
			document
				.getElementById("changelogAccordion")
				.setAttribute("data-bs-theme", "light");
		}

		// if (errorPage) {
		//   errorCard.classList.remove('bg-dark');
		//   errorCard.classList.remove('text-light');
		//   errorCard.classList.add('bg-light');
		//   errorCard.classList.add('text-dark');
		// }

		//
		storeColourMode("light");
		colorMode = "light";
	} else if (toColourMode === "dark") {
		//Dark mode

		//Body
		document.body.classList.remove("bodyLight");
		document.body.classList.add("bodyDark");

		//Navbar
		document.querySelector(".lightDark").src = document
			.querySelector(".lightDark")
			.src.replace("light", "dark");

		// Entry field function
		function entryField(entryField) {
			for (let i = 0; i < entryField.length; i++) {
				entryField[i].style.backgroundColor = "#1e2124";
			}
			for (let i = 0; i < entryField.length; i++) {
				if (entryField[i].classList.contains("form-control")) {
					entryField[i].classList.add("darkPlaceholder");
					entryField[i].classList.add("text-light");
				}
			}
		}

		// Handle card colours
		function cardColor(card) {
			if (card.length > 1) {
				for (let i = 0; i < card.length; i++) {
					card[i].classList.remove("bg-light");
					card[i].classList.remove("text-dark");
					card[i].classList.add("bg-dark");
					card[i].classList.add("text-light");
				}
			} else {
				card.classList.remove("bg-light");
				card.classList.remove("text-dark");
				card.classList.add("bg-dark");
				card.classList.add("text-light");
			}
		}
		// Commands
		if (commandsTable) {
			commandsTable.classList.add("table-dark");
		}
		// Login
		if (login) {
			cardColor(loginCard);
			entryField(loginForm);
		}
		// Register
		if (register) {
			cardColor(registerCard);
			entryField(registerForm);
		}

		// Account
		if (document.title === "Account | DOST") {
			cardColor(accCard);
			entryField(accForm);
			document.getElementById("deleteAccount").style.color = "white";
		}
		// OTP
		if (otp) {
			cardColor(otpCard);
			entryField(otpForm);
		}
		// changePassword
		if (changePassword) {
			cardColor(changePasswordCard);
			entryField(changePasswordForm);
		}
		// Forgot pass
		if (forgotPass) {
			cardColor(forgotPassCard);
			entryField(forgotPassForm);
		}

		// Error page
		if (errorPage) {
			cardColor(errorCard);
		}

		// Changelog
		if (changelog) {
			document
				.getElementById("changelogAccordion")
				.setAttribute("data-bs-theme", "dark");
		}
		// if (errorPage) {
		//      errorCard.classList.remove('bg-light');
		//      errorCard.classList.remove('text-dark');
		//      errorCard.classList.add('bg-dark');
		//      errorCard.classList.add('text-light');
		//    }

		//
		storeColourMode("dark");
		colorMode = "dark";
	}
}

document.querySelector(".lightDark").addEventListener("click", function () {
	if (colorMode === "dark") {
		applyColourMode("light");
	} else if (colorMode === "light") {
		applyColourMode("dark");
	}
});

notification;
function notification(type, text) {
	const notitypes = ["alert-success", "alert-danger", "alert-primary"];
	for (let i = 0; i < notitypes.length; i++) {
		if (
			document
				.getElementById("notiAlert")
				.classList.contains(notitypes[i])
		) {
			document.getElementById("notiAlert").classList.remove(notitypes[i]);
		}
	}
	const notification = new bootstrap.Toast(
		document.getElementById("notification")
	);
	document.getElementById("notiAlert").classList.add(type);
	document.getElementById("notifcationContent").innerHTML = text;
	notification.show();
}

// ----------Password Eyes-------------------------------------------------------------------------------------------
function passwordEyes(passwordInput, passwordEye) {
	let eye = document.getElementById(passwordEye);
	let input = document.getElementById(passwordInput);
	eye.addEventListener("click", function () {
		if (input.getAttribute("type") === "password") {
			input.setAttribute("type", "text");
			eye.src = eye.src.replace("invisible", "visible");
		} else if (input.getAttribute("type") === "text") {
			input.setAttribute("type", "password");
			eye.src = eye.src.replace("visible", "invisible");
		}
	});
}

// Footer insta toast

const footerInsta = document.getElementById("footerInsta");

if (footerInsta) {
	const instaToast = new bootstrap.Toast(
		document.getElementById("instaToast")
	);
	footerInsta.addEventListener("click", () => {
		instaToast.show();
	});
}

// Footer Tell Us about it toast

const footerButton = document.querySelector(".footerButton");

if (footerButton) {
	userLog = retrieveData("getUserLog");
	console.log(`user log is - ${userLog}`);
	footerButton.addEventListener("click", () => {
		if (userLog === "logged") {
			const TellUsAboutItToast = new bootstrap.Toast(
				document.getElementById("TellUsAboutItToast")
			);
			document.getElementById("suggestionBox").classList.remove("hidden");
			TellUsAboutItToast.show();
		} else if (userLog === "notLogged") {
			notification(
				"alert-primary",
				"You need to login to use 		that action!"
			);
		}
	});
}

//Suggestion Box

const suggestionTextArea = document.getElementById("suggestion");
let suggestionInput; //Textarea input

if (suggestionTextArea) {
	document
		.getElementById("suggestionButton")
		.addEventListener("click", function () {
			suggestionInput = suggestionTextArea.value;
			// console.log(`Suggestion is - ${suggestionInput}`);
			$.ajax({
				url: "/suggestion-data",
				type: "POST",
				data: JSON.stringify({ data: suggestionInput }),
				contentType: "application/json",
				success: function (response) {
					if (response == "success") {
						notification(
							"alert-primary",
							"Thank you for your suggestion!"
						);
					} else {
						notification(
							"alert-danger",
							"Some error occured, please try again"
						);
						console.log("Error");
					}
				},
				error: function (error) {
					console.error("Error:", error);
				},
			});
			suggestionTextArea.value = "";
			document.getElementById("suggestionBox").classList.add("hidden");
			document.getElementById("closeSuggestion").click();
		});

	document
		.getElementById("closeSuggestion")
		.addEventListener("click", function () {
			suggestionTextArea.value = "";
		});
}

// -------------Commands--------------------------------------------------------------------------------------------

if (commandsTable) {
	async function fillComandsTable() {
		const response = await fetch("/static/assets/data/commands.json");
		const commandsData = await response.json();
		displayCommands(commandsData);
	}

	fillComandsTable();

	function displayCommands(data) {
		let keys = Object.keys(data);
		let values = Object.values(data);
		for (let i = 0; i < keys.length; i++) {
			// First declare new html elements
			const tableRow = document.createElement("tr");
			const commandCol1 = document.createElement("th");
			commandCol1.setAttribute("scope", "row");
			const commandCol2 = document.createElement("td");
			const commandCol3 = document.createElement("td");

			// Then give innerHtml values

			commandCol1.innerHTML = i + 1;
			commandCol2.innerHTML = keys[i];
			commandCol3.innerHTML = values[i].replaceAll("\n", "</br>");

			// Then appendchild them to tableRow

			tableRow.appendChild(commandCol1);
			tableRow.appendChild(commandCol2);
			tableRow.appendChild(commandCol3);

			// Then finally appendchild the made tableRow to the table body
			document.getElementById("commandTableBody").appendChild(tableRow);
		}
	}
}

// ------------Login--------------------------------------------------------------------------------------------------

// Login Checks

if (login) {
	const user = document.getElementById("email");
	const password = document.getElementById("password");
	const remember = document.getElementById("rememberMeCheck");

	async function loginCheck(user, password, remember) {
		const data = {
			user: user,
			password: password,
			remember: remember,
		};
		showLoadingIcon();

		const response1 = await fetch("/login", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(data),
		});
		let response;
		if (response1.ok) {
			response = await response1.json();
		} else {
			throw new Error("Network response was not ok.");
		}
		try {
			if (response.type === "logged") {
				document.getElementById("loginMessage").innerText = "";
				notification("alert-success", "Logged in successfully!");
				hideLoadingIcon();
				window.location.href = "/?goto=home";
			} else if (response.type === "invalid") {
				// DO HERE
				document.getElementById("loginMessage").innerText =
					"Incorrect Credentials!";
				notification("alert-danger", "Incorrect Credentials");
				hideLoadingIcon();
			}
		} catch (error) {
			console.error("Error:", error);
			hideLoadingIcon();
		}
	}
	passwordEyes("password", "passwordEye");
	let emailInput = document.getElementById("email");
	let passwordInput = document.getElementById("password");

	passwordInput.addEventListener("keyup", checkLogin);
	emailInput.addEventListener("keyup", checkLogin);

	function checkLogin() {
		let email = emailInput.value;
		let password = passwordInput.value;

		if (email && password) {
			document.getElementById("loginButton").disabled = false;
		} else {
			document.getElementById("loginButton").disabled = true;
		}
	}
	document
		.getElementById("loginButton")
		.addEventListener("click", function () {
			// console.log(user.value, password.value, remember.checked ? 'yes' : 'no');
			loginCheck(
				user.value.trim(),
				password.value,
				remember.checked ? "yes" : "no"
			);
		});
}

// --------------------Register-------------------------------------------------

// Register Check

if (register) {
	async function regisCheck(user, email, name, password) {
		const data = {
			user: user,
			email: email,
			name: name,
			password: password,
		};

		const response1 = await fetch("/register", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(data),
		});
		let response;
		if (response1.ok) {
			response = await response1.json();
		} else {
			throw new Error("Network response was not ok.");
		}
		try {
			// console.log(response)
			if (response.type === "success") {
				notification("alert-success", "Redirecting for verification");
				window.location.href = "/otp-page";
			} else if (response.type === "email-error") {
				// DO HERE
				notification("alert-danger", "Email already in use");
			} else if (response.type === "user-error") {
				// DO HERE
				notification("alert-danger", "Username is already taken");
			}
		} catch (error) {
			console.error("Error:", error);
			// callback(false); // Handle errors
		}
	}
	// Variables
	let submitBtn = document.getElementById("signupBtn");

	let emailInput = document.getElementById("email");
	let passwordInput = document.getElementById("password");
	let usernameInput = document.getElementById("uname");
	let fullnameInput = document.getElementById("fname");
	let cPasswordInput = document.getElementById("cpassword");
	let criteriaList = document.getElementById("criteria");

	let qUsername = false;
	let qPassword = false;
	let qCPassword = false;
	let qFullname = false;
	let qEmail = false;
	let qCUsername = false;

	// PasswordEye
	passwordEyes("password", "passwordEye");
	passwordEyes("cpassword", "cpasswordEye");

	// Binds
	passwordInput.addEventListener("focus", showCriteria);
	passwordInput.addEventListener("blur", hideCriteria);
	passwordInput.addEventListener("keyup", validatePassword);
	cPasswordInput.addEventListener("keyup", checkPassword);
	usernameInput.addEventListener("keyup", validateUsername);
	usernameInput.addEventListener("keyup", checkUsername);
	fullnameInput.addEventListener("keyup", validateFname);
	emailInput.addEventListener("keyup", validateEmail);
	emailInput.addEventListener("keyup", checkEmail);

	// Functions

	function showCriteria() {
		criteriaList.classList.add("visible");
		criteriaList.classList.remove("hidden");
	}

	function hideCriteria() {
		criteriaList.classList.remove("visible");
		criteriaList.classList.add("hidden");
	}

	function validatePassword() {
		let password = passwordInput.value.trim();
		let cpassword = cPasswordInput.value.trim();

		if (cpassword) {
			checkPassword();
		}

		// Regular expressions to check for different criteria
		let lowercaseRegex = /[a-z]/;
		let uppercaseRegex = /[A-Z]/;
		let symbolRegex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
		let digitRegex = /[0-9]/;

		// Check if all criteria are met
		let isLowercase = lowercaseRegex.test(password);
		let isUppercase = uppercaseRegex.test(password);
		let isSymbol = symbolRegex.test(password);
		let isDigit = digitRegex.test(password);
		let isLengthValid = password.length >= 8;

		let lowercaseEl = document.getElementById("lowercase");
		let uppercaseEl = document.getElementById("uppercase");
		let symbolEl = document.getElementById("symbol");
		let digitEl = document.getElementById("digit");
		let lengthEl = document.getElementById("length");

		lowercaseEl.innerHTML =
			"<span>" +
			(isLowercase
				? "<i class='fas fa-check'></i>"
				: "<i class='fas fa-times'></i> ") +
			"</span> At least one lowercase letter";
		lowercaseEl.style.color = isLowercase ? "green" : "red";

		uppercaseEl.innerHTML =
			"<span>" +
			(isUppercase
				? "<i class='fas fa-check'></i>"
				: "<i class='fas fa-times'></i> ") +
			"</span> At least one uppercase letter";
		uppercaseEl.style.color = isUppercase ? "green" : "red";

		symbolEl.innerHTML =
			"<span>" +
			(isSymbol
				? "<i class='fas fa-check'></i>"
				: "<i class='fas fa-times'></i> ") +
			"</span> At least one symbol";
		symbolEl.style.color = isSymbol ? "green" : "red";

		digitEl.innerHTML =
			"<span>" +
			(isDigit
				? "<i class='fas fa-check'></i>"
				: "<i class='fas fa-times'></i> ") +
			"</span> At least one digit";
		digitEl.style.color = isDigit ? "green" : "red";

		lengthEl.innerHTML =
			"<span>" +
			(isLengthValid
				? "<i class='fas fa-check'></i>"
				: "<i class='fas fa-times'></i> ") +
			"</span> Minimum length of 8 characters";
		lengthEl.style.color = isLengthValid ? "green" : "red";

		if (
			isLowercase &&
			isUppercase &&
			isSymbol &&
			isDigit &&
			isLengthValid
		) {
			document.getElementById("password").style.boxShadow =
				"inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 8px rgba(0, 255, 255)";
			document.getElementById("innerPass").innerText = "";
			qPassword = true;
		} else {
			document.getElementById("password").style.boxShadow =
				"inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 8px rgba(255, 0, 0)";
			document.getElementById("innerPass").innerText =
				"Password must meet all criteria";
			qPassword = false;
		}
		signupBtn();
	}

	// Confirm Password

	function checkPassword() {
		let password = passwordInput.value.trim();
		let cpassword = cPasswordInput.value.trim();

		if (password == cpassword) {
			document.getElementById("cpassword").style.boxShadow =
				"inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 8px rgba(0, 255, 255)";
			document.getElementById("innerCPass").innerText = "";
			qCPassword = true;
		} else {
			document.getElementById("cpassword").style.boxShadow =
				"inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 8px rgba(255, 0, 0)";
			document.getElementById("innerCPass").innerText =
				"Password did not match";
			qCPassword = false;
		}
		signupBtn();
	}

	//   Username check
	function validateUsername() {
		var username = usernameInput.value.trim();
		var isValid = /^[a-zA-Z0-9_]{4,15}$/.test(username);

		if (isValid) {
			document.getElementById("uname").style.boxShadow =
				"inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 8px rgba(0, 255, 255)";
			document.getElementById("innerUname").innerHTML = "";
			qUsername = true;
		} else {
			document.getElementById("uname").style.boxShadow =
				"inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 8px rgba(255, 0, 0)";
			document.getElementById("innerUname").innerHTML =
				"4-15 characters, letters, numbers, underscores only";
			qUsername = false;
		}
		signupBtn();
	}

	let timer;
	let totalTime = 1000;

	function checkUsername() {
		let username = usernameInput.value.trim(); // to send

		clearTimeout(timer);

		timer = setTimeout(function () {
			showLoadingIcon();
			sendUser(username); // ajax function
		}, totalTime);
	}

	function sendUser(username) {
		let isValid = /^[a-zA-Z0-9_]{4,15}$/.test(username);

		function storeValid(data) {
			if (isValid && data == "usernotexists") {
				document.getElementById("uname").style.boxShadow =
					"inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 8px rgba(0, 255, 255)";
				document.getElementById("innerUname").innerHTML = "";
				qCUsername = true;
			} else if (!isValid && data == "usernotexists") {
				document.getElementById("uname").style.boxShadow =
					"inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 8px rgba(255, 0, 0)";
				document.getElementById("innerUname").innerHTML =
					"4-15 characters, letters, numbers, underscores only";
				qCUsername = false;
			} else {
				document.getElementById("uname").style.boxShadow =
					"inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 8px rgba(255, 0, 0)";
				document.getElementById("innerUname").innerHTML =
					"Username is already taken";
				qCUsername = false;
			}
			signupBtn();
		}

		$.ajax({
			url: "/userexist",
			type: "GET",
			data: { user: username },
			beforeSend: function () {
				showLoadingIcon();
			},
			success: function (response) {
				storeValid(response);
				hideLoadingIcon();
			},
			error: function (error) {
				console.log(error);
				hideLoadingIcon();
			},
		});
	}

	// Email check
	function validateEmail() {
		var email = emailInput.value.trim();
		var isValid =
			/^[a-zA-Z0-9_]{1,64}@[a-zA-Z0-9_]{1,}\.[a-zA-Z0-9_]{2,}$/.test(
				email
			);

		if (isValid) {
			document.getElementById("email").style.boxShadow =
				"inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 8px rgba(0, 255, 255)";
			document.getElementById("innerEmail").innerHTML = "";
			qEmail = true;
		} else {
			document.getElementById("email").style.boxShadow =
				"inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 8px rgba(255, 0, 0)";
			document.getElementById("innerEmail").innerHTML =
				"Enter a valid email address";
			qEmail = false;
		}
		signupBtn();
	}

	function checkEmail() {
		let email = emailInput.value.trim(); // to send

		clearTimeout(timer);

		timer = setTimeout(function () {
			showLoadingIcon();
			sendEmail(email); // ajax function
		}, totalTime);
	}

	function sendEmail(email) {
		let isValid =
			/^[a-zA-Z0-9_]{1,64}@[a-zA-Z0-9_]{1,}\.[a-zA-Z0-9_]{2,}$/.test(
				email
			);

		function storeValid(data) {
			if (isValid && data == "emailnotexists") {
				document.getElementById("email").style.boxShadow =
					"inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 8px rgba(0, 255, 255)";
				document.getElementById("innerEmail").innerHTML = "";
				qEmail = true;
			} else if (!isValid && data == "emailnotexists") {
				document.getElementById("email").style.boxShadow =
					"inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 8px rgba(255, 0, 0)";
				document.getElementById("innerEmail").innerHTML =
					"Enter a valid email address";
				qEmail = false;
			} else {
				document.getElementById("email").style.boxShadow =
					"inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 8px rgba(255, 0, 0)";
				document.getElementById("innerEmail").innerHTML =
					"Email is already taken";
				qEmail = false;
			}
			signupBtn();
		}

		$.ajax({
			url: "/emailexist",
			type: "GET",
			data: { email: email },
			beforeSend: function () {
				showLoadingIcon();
			},
			success: function (response) {
				storeValid(response);
				hideLoadingIcon();
			},
			error: function (error) {
				console.log(error);
				hideLoadingIcon();
			},
		});
	}

	//   Full name check
	function validateFname() {
		var fullname = fullnameInput.value.trim();
		var isValid = /^[A-Za-z ]{1,30}$/.test(fullname);

		if (isValid) {
			document.getElementById("fname").style.boxShadow =
				"inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 8px rgba(0, 255, 255)";
			document.getElementById("innerFname").innerHTML = "";
			qFullname = true;
		} else {
			document.getElementById("fname").style.boxShadow =
				"inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 8px rgba(255, 0, 0)";
			document.getElementById("innerFname").innerHTML =
				"Letters and Spaces only";
			qFullname = false;
		}
		signupBtn();
	}

	function signupBtn() {
		if (
			qPassword &&
			qCPassword &&
			qUsername &&
			qFullname &&
			qEmail &&
			qCUsername
		) {
			submitBtn.disabled = false;
		} else {
			submitBtn.disabled = true;
		}
	}
	submitBtn.addEventListener("click", function () {
		regisCheck(
			usernameInput.value.trim(),
			emailInput.value.trim(),
			fullnameInput.value.trim(),
			cPasswordInput.value
		);
		// console.log(usernameInput.value, emailInput.value, fullnameInput.value, cPasswordInput.value);
	});
}

// Account

// Checks title of page
if (document.title === "Account | DOST") {
	// get user from session data
	function getUser() {
		return new Promise(async function (resolve, _) {
			x = fetch("/theuser", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
			}).then((res) => res.json());
			resolve(x);
		});
	}

	function editCredentials(check, checkValue, field, value) {
		postData = {
			check: check,
			checkValue: checkValue,
			field: field,
			value: value,
		};
		$.ajax({
			url: "/edit-credentials",
			type: "POST",
			data: JSON.stringify(postData),
			contentType: "application/json",
			success: function (response) {},
		});
	}

	const dp = document.getElementById("dp");
	const accName = document.getElementById("accName");
	const accEmail = document.getElementById("accEmail");
	const accUsername = document.getElementById("accUsername");
	const accPassword = document.getElementById("accPassword");
	const passwordDisplay = document.getElementById("passwordDisplay");
	const passwordChange = document.getElementById("passwordChange");
	const passwordNew = document.getElementById("passwordNew");
	const passwordConfirm = document.getElementById("passwordConfirm");

	const accPasswordOld = document.getElementById("accPasswordOld");
	const accPasswordNew = document.getElementById("accPasswordNew");
	const accPasswordConfirm = document.getElementById("accPasswordConfirm");

	let criteriaList = document.getElementById("criteria");

	const fillAcc = async function () {
		showLoadingIcon();
		accData = await getUser(); //get user data
		hideLoadingIcon();

		dp.src =
			"https://png.pngtree.com/png-clipart/20190520/original/pngtree-vector-users-icon-png-image_4144740.jpg";
		accName.value = accData.name;
		accEmail.value = accData.email;
		accUsername.value = accData.username;

		let newsletterCheck = document.getElementById("newsletterCheck");
		if (accData.newsletter === "yes") {
			newsletterCheck.setAttribute("checked", true);
		} else if (accData.newsletter === "no") {
			newsletterCheck.removeAttribute("checked");
		}

		let qFullname = false;
		let qUsername = false;
		let qOldPass = false;
		let qPassword = false;
		let qCPassword = false;

		// Binds
		accPasswordNew.addEventListener("focus", showCriteria);
		accPasswordNew.addEventListener("blur", hideCriteria);
		accPasswordNew.addEventListener("keyup", validatePassword);
		accPasswordConfirm.addEventListener("keyup", checkPassword);
		// Validation part
		function showCriteria() {
			criteriaList.classList.add("visible");
			criteriaList.classList.remove("hidden");
		}

		function hideCriteria() {
			criteriaList.classList.remove("visible");
			criteriaList.classList.add("hidden");
		}

		// Name
		function accValidateName() {
			accName.addEventListener("keyup", function () {
				let fullname = accName.value.trim();
				let isValid = /^[A-Za-z ]{1,15}$/.test(fullname);

				if (isValid) {
					accName.style.boxShadow =
						"inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 8px rgba(0, 255, 255)";
					document.getElementById("innerFname").innerHTML = "";
					qFullname = true;
					editPencilName.style.opacity = 1;
				} else {
					accName.style.boxShadow =
						"inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 8px rgba(255, 0, 0)";
					document.getElementById("innerFname").innerHTML =
						"Letters and Spaces only";
					qFullname = false;
					editPencilName.style.opacity = 0.5;
				}
			});
		}
		// Username
		function accValidateUsername() {
			let usernameOld = accData.username;
			let timer;
			const totalTime = 500;
			function checkUsername() {
				let username = accUsername.value.trim();
				let isValid = /^[a-zA-Z0-9_]{4,15}$/.test(username);
				if (isValid) {
					$.ajax({
						url: "/userexist",
						type: "GET",
						data: { user: accUsername.value },
						beforeSend: function () {
							showLoadingIcon();
						},
						success: function (response) {
							if (
								response == "userexists" &&
								accUsername.value != usernameOld
							) {
								accUsername.style.boxShadow =
									"inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 8px rgba(255, 0, 0)";
								document.getElementById(
									"innerUname"
								).innerHTML = "Username already exists !";
								hideLoadingIcon();
								qUsername = false;
								editPencilUsername.style.opacity = 0.5;
							} else if (
								response == "userexists" &&
								accUsername.value == usernameOld
							) {
								accUsername.style.boxShadow =
									"inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 8px rgba(255, 0, 0)";
								document.getElementById(
									"innerUname"
								).innerHTML =
									"Username cannot be the same as the last one!";
								hideLoadingIcon();
								qUsername = false;
								editPencilUsername.style.opacity = 0.5;
							} else if (response == "usernotexists") {
								accUsername.style.boxShadow =
									"inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 8px rgba(0, 255, 255)";
								document.getElementById(
									"innerUname"
								).innerHTML = "";
								hideLoadingIcon();
								editPencilUsername.style.opacity = 1;
								qUsername = true;
							}
						},
					});
				} else {
					accUsername.style.boxShadow =
						"inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 8px rgba(255, 0, 0)";
					document.getElementById("innerUname").innerHTML =
						"4-15 characters, letters, numbers, underscores only";
					hideLoadingIcon();
					qUsername = false;
					editPencilUsername.style.opacity = 0.5;
				}
			}
			accUsername.addEventListener("keyup", function () {
				clearTimeout(timer);
				timer = setTimeout(function () {
					checkUsername(); // ajax function
				}, totalTime);
			});
		}
		// Password
		function validatePassword() {
			let password = accPasswordNew.value.trim();
			let cpassword = accPasswordConfirm.value.trim();

			if (cpassword) {
				checkPassword();
			}

			// Regular expressions to check for different criteria
			let lowercaseRegex = /[a-z]/;
			let uppercaseRegex = /[A-Z]/;
			let symbolRegex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
			let digitRegex = /[0-9]/;

			// Check if all criteria are met
			let isLowercase = lowercaseRegex.test(password);
			let isUppercase = uppercaseRegex.test(password);
			let isSymbol = symbolRegex.test(password);
			let isDigit = digitRegex.test(password);
			let isLengthValid = password.length >= 8;

			let lowercaseEl = document.getElementById("lowercase");
			let uppercaseEl = document.getElementById("uppercase");
			let symbolEl = document.getElementById("symbol");
			let digitEl = document.getElementById("digit");
			let lengthEl = document.getElementById("length");

			lowercaseEl.innerHTML =
				"<span>" +
				(isLowercase
					? "<i class='fas fa-check'></i>"
					: "<i class='fas fa-times'></i> ") +
				"</span> At least one lowercase letter";
			lowercaseEl.style.color = isLowercase ? "green" : "red";

			uppercaseEl.innerHTML =
				"<span>" +
				(isUppercase
					? "<i class='fas fa-check'></i>"
					: "<i class='fas fa-times'></i> ") +
				"</span> At least one uppercase letter";
			uppercaseEl.style.color = isUppercase ? "green" : "red";

			symbolEl.innerHTML =
				"<span>" +
				(isSymbol
					? "<i class='fas fa-check'></i>"
					: "<i class='fas fa-times'></i> ") +
				"</span> At least one symbol";
			symbolEl.style.color = isSymbol ? "green" : "red";

			digitEl.innerHTML =
				"<span>" +
				(isDigit
					? "<i class='fas fa-check'></i>"
					: "<i class='fas fa-times'></i> ") +
				"</span> At least one digit";
			digitEl.style.color = isDigit ? "green" : "red";

			lengthEl.innerHTML =
				"<span>" +
				(isLengthValid
					? "<i class='fas fa-check'></i>"
					: "<i class='fas fa-times'></i> ") +
				"</span> Minimum length of 8 characters";
			lengthEl.style.color = isLengthValid ? "green" : "red";

			if (
				isLowercase &&
				isUppercase &&
				isSymbol &&
				isDigit &&
				isLengthValid
			) {
				accPasswordNew.style.boxShadow =
					"inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 8px rgba(0, 255, 255)";
				document.getElementById("innerPass").innerText = "";
				qPassword = true;
			} else {
				accPasswordNew.style.boxShadow =
					"inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 8px rgba(255, 0, 0)";
				document.getElementById("innerPass").innerText =
					"Password must meet all criteria";
				qPassword = false;
			}
			saveNewPass();
		}

		// Confirm Password

		function checkPassword() {
			let password = accPasswordNew.value.trim();
			let cpassword = accPasswordConfirm.value.trim();

			if (password == cpassword) {
				accPasswordConfirm.style.boxShadow =
					"inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 8px rgba(0, 255, 255)";
				document.getElementById("innerCPass").innerText = "";
				qCPassword = true;
			} else {
				accPasswordConfirm.style.boxShadow =
					"inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 8px rgba(255, 0, 0)";
				document.getElementById("innerCPass").innerText =
					"Password did not match";
				qCPassword = false;
			}
			saveNewPass();
		}
		// Save New Password
		function saveNewPass() {
			if (qOldPass && qPassword && qCPassword) {
				document
					.getElementById("saveNewPass")
					.removeAttribute("disabled");
			}
		}

		// Collapse password change area
		function passwordCollapse() {
			passwordDisplay.classList.remove("hidden");
			passwordChange.classList.add("hidden");
			passwordNew.classList.add("hidden");
			passwordConfirm.classList.add("hidden");
			accPasswordOld.value = "";
			accPasswordNew.value = "";
			accPasswordConfirm.value = "";
			accPasswordOld.style.boxShadow = "none";
			accPasswordNew.style.boxShadow = "none";
			accPasswordConfirm.style.boxShadow = "none";
			accPasswordOld.setAttribute("readonly", true);
			passwordEyes("accPasswordOld", "eyePasswordOld");
			passwordEyes("accPasswordNew", "eyePasswordNew");
			passwordEyes("accPasswordConfirm", "eyePasswordConfirm");
		}
		// Password area collapse arrow
		document
			.getElementById("accPasswordCollapse")
			.addEventListener("click", function () {
				passwordCollapse();
			});
		// Save New Password Button
		document
			.getElementById("saveNewPass")
			.addEventListener("click", async function () {
				editCredentials(
					"user",
					accData.username,
					"password",
					accPasswordConfirm.value.trim()
				);
				passwordCollapse();
				accPasswordOld.style.boxShadow = "none";
				accPasswordNew.style.boxShadow = "none";
				accPasswordConfirm.style.boxShadow = "none";
				notification("alert-success", "Password Changed Successfully!");
				accData = await getUser();
			});
		// ----------------------------------------------------------
		// Password Functions
		// Check if the entered current password is correct
		function handleNewPassword() {
			hideLoadingIcon();
			passwordEyes("accPasswordOld", "eyePasswordOld");
			passwordEyes("accPasswordNew", "eyePasswordNew");
			passwordEyes("accPasswordConfirm", "eyePasswordConfirm");
			let oldPassOk = "invalid";
			let timer;
			const totalTime = 1000;
			// clearTimeout(timer);
			function checkOldPass() {
				$.ajax({
					url: "/check-oldPass",
					type: "GET",
					data: {
						user: accData.username,
						oldPass: accPasswordOld.value,
					},
					beforeSend: function () {
						showLoadingIcon();
					},
					success: function (response) {
						if (oldPassOk == "invalid") {
							oldPassOk = response["passOk"];
						}
						if (oldPassOk == "logged") {
							accPasswordOld.style.boxShadow =
								"inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 8px rgba(0, 255, 255)";
							accPasswordOld.setAttribute("readonly", true);
							qOldPass = true;
							accPasswordNew.removeAttribute("disabled");
							accPasswordConfirm.removeAttribute("disabled");
							hideLoadingIcon();
						} else {
							accPasswordOld.style.boxShadow =
								"inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 8px rgba(255, 0, 0)";
							qOldPass = false;
						}
						hideLoadingIcon();
					},
					error: function () {
						hideLoadingIcon();
					},
				});
			}
			accPasswordOld.addEventListener("keyup", function () {
				clearTimeout(timer);
				timer = setTimeout(function () {
					showLoadingIcon();
					checkOldPass(); // ajax function
				}, totalTime);
			});
		}
		// For pencil of name
		const editPencilName = document.getElementById("editPencilName");
		editPencilName.addEventListener("click", async function () {
			// Initially when readonly
			if (accName.hasAttribute("readonly")) {
				accName.removeAttribute("readonly");
				accName.focus();
				editPencilName.src = "/static/assets/tick.png";
				editPencilName.style.opacity = 0.5;
				accName.style.boxShadow =
					"inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 8px rgba(0, 255, 255)";
				accValidateName();
			} else if (qFullname) {
				// When pencil clicked (notReadonly)
				editCredentials(
					"user",
					accData.username,
					"name",
					accName.value.trim()
				); //save changes
				accName.setAttribute("readonly", true);
				editPencilName.src = "/static/assets/pencil.png";
				accName.style.boxShadow = "none";
				notification("alert-success", "Name changed successfully!");
				accData = await getUser();
			}
		});
		// For pencil of username
		const editPencilUsername =
			document.getElementById("editPencilUsername");
		editPencilUsername.addEventListener("click", function () {
			// Initially when readonly
			if (accUsername.hasAttribute("readonly")) {
				accUsername.removeAttribute("readonly");
				accUsername.focus();
				editPencilUsername.src = "/static/assets/tick.png";
				editPencilUsername.style.opacity = 0.5;
				accUsername.style.boxShadow =
					"inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 8px rgba(0, 255, 255)";
				accValidateUsername();
			} else if (qUsername) {
				// When pencil clicked (notReadonly)
				editCredentials(
					"user",
					accData.username,
					"user",
					accUsername.value.trim()
				); //save changes
				accUsername.setAttribute("readonly", true);
				editPencilUsername.src = "/static/assets/pencil.png";
				accUsername.style.boxShadow = "none";
				notification("alert-success", "Username changed successfully!");
			}
		});
		// For Pencil of Password
		const editPencilPassword =
			document.getElementById("editPencilPassword");
		editPencilPassword.addEventListener("click", function () {
			accPasswordOld.removeAttribute("readonly");
			passwordDisplay.classList.add("hidden");
			passwordChange.classList.remove("hidden");
			passwordNew.classList.remove("hidden");
			passwordConfirm.classList.remove("hidden");
			handleNewPassword();
		});
		// For newsletter check
		// TODO : Add ajax call to save newsletter preference
		newsletterCheck.addEventListener("change", (e) => {
			if (e.target.checked) {
				// editCredentials('newsletter', 'yes');
			} else {
				// editCredentials('newsletter', 'no');
			}
		});
	};
	//onfocusout:
	accName.addEventListener("focusout", function (event) {
		if (event.relatedTarget !== document.getElementById("nameTick")) {
			accName.value = accData.name;
			accName.setAttribute("readonly", true);
			editPencilName.src = "static/assets/pencil.png";
			accName.style.boxShadow = "none";
		}
	});
	accUsername.addEventListener("focusout", function (event) {
		if (event.relatedTarget !== document.getElementById("usernameTick")) {
			accUsername.value = accData.username;
			accUsername.setAttribute("readonly", true);
			editPencilUsername.src = "static/assets/pencil.png";
			accUsername.style.boxShadow = "none";
			document.getElementById("innerUname").innerHTML = "";
		}
	});
	let accData;
	fillAcc();

	// Delete account
	passwordEyes("passwordDelete", "passwordEyeDelete");
	document
		.getElementById("deleteAccountFinal")
		.addEventListener("click", function () {
			deleteAccount(document.getElementById("passwordDelete").value);
		});
	deleteAccount = function (password) {
		$.ajax({
			url: "/delete-account",
			type: "POST",
			data: JSON.stringify({ password: password }),
			contentType: "application/json",
			success: function (response) {
				try {
					if (response.message == "account_deleted") {
						console.log("Account Deleted!!");
						notification(
							"alert-success",
							"Account Deleted Successfully!"
						);
						document
							.getElementById("deleteAccountModalClose")
							.click();
						window.location.href = "/?goto=home";
					} else if (response.message == "wrong_password") {
						console.log("Wrong password");
						notification(
							"alert-danger",
							"Password does not match!"
						);
					} else {
						console.log("Error");
						notification("alert-danger", "Error Occured!");
					}
				} catch (error) {
					console.error("Error parsing JSON response: " + error);
				}
			},
			error: function (xhr, status, error) {
				console.error("Error in the AJAX request: " + error);
			},
		});
	};
	// ----------------------------------------------------------------
}

function sendOTPRequest(email, type = "normal") {
	const requestData = {
		email: email,
		type: type,
	};
	// Make an AJAX POST request to eyour server to request an OTP
	fetch("/send-otp", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(requestData),
	})
		.then((response) => response.json())
		.then((data) => {
			// Handle the response from the server (e.g., show a success message)
			notification("alert-success", data.message);
		})
		.catch((error) => {
			// Handle any errors that occur during the request
			notification("alert-danger", "An error occurred while sending OTP");
		});
}
// Send OTP

function checkOtpNow(otp, type) {
	// Create a JSON object with OTP and type
	const data = {
		otp: otp,
		type: type,
	};

	fetch("/check-otp", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(data),
	})
		.then((response) => {
			if (response.ok) {
				return response.json();
			} else {
				throw new Error("Network response was not ok.");
			}
		})
		.then((response) => {
			// console.log(response)
			if (response.message == "otpOk" && response.type === "forgot") {
				notification("alert-success", "OTP is valid");
				// Redirect to the /create_new_password route or handle the login logic here.
				window.location.href = "/create-new-password";
			} else if (
				response.message == "otpOk" &&
				response.type === "register"
			) {
				notification(
					"alert-success",
					"Registration has been completed"
				);
				window.location.href = "/complete-registration";
			} else if (response.message == "otpNotOk") {
				notification("alert-danger", "OTP is not valid");
				// OTP is not valid
			}
		})
		.catch((error) => {
			console.error("Error:", error);
			// callback(false); // Handle errors
		});
}

// Check OTP

// OTP
if (otp) {
	function handleInput(index) {
		if (otpInputs[index].value.length === 1) {
			if (index < otpInputs.length - 1) {
				otpInputs[index + 1].focus();
			}
		}
	} // take input

	function eraseLastInput() {
		for (let i = otpInputs.length - 1; i >= 0; i--) {
			if (otpInputs[i].value.length > 0) {
				otpInputs[i].value = "";
				otpInputs[i].focus();
				break;
			}
		}
	} // erase input function
	for (j = 0; j < 6; j++) {
		otpInputs[j].addEventListener("keydown", function (event) {
			if (event.key == "Backspace") {
				eraseLastInput();
			}
		});
	} //erase input
	for (let z = 0; z < otpInputs.length; z++) {
		otpInputs[z].addEventListener("keydown", function (event) {
			if (isNaN(event.key) && event.key != "Backspace") {
				event.preventDefault();
			}
		});
	} // OTP accepts numbers only.

	document
		.getElementById("otpButton")
		.addEventListener("click", async function () {
			let receivedOtp = "";
			for (let k = 0; k < 6; k++) {
				receivedOtp += otpInputs[k].value;
			}
			console.log(receivedOtp);
			// Change kar lena jo daalna hai
			await checkOtpNow(receivedOtp, "register"); //Check received OTP
		});
	// Timeleft
	function resend() {
		resendLine.classList.add("hidden");
		resendTimer.classList.remove("hidden");

		let timeLeft = 29;
		function updateTimer() {
			document.getElementById(
				"timer"
			).innerHTML = `Resend OTP in : ${timeLeft} sec`;
			if (timeLeft == 0) {
				clearInterval(timerInterval); // Stop the timer
				resendTimer.classList.add("hidden");
				resendLine.classList.remove("hidden");
				document.getElementById(
					"timer"
				).innerHTML = `Resend in : 30 sec`; // Change as timer expires.
			} else {
				timeLeft--; // Decrement the time
			}
		}
		const timerInterval = setInterval(updateTimer, 1000);
	}
	window.onload = resend();
	otpResend.addEventListener("click", function () {
		sendOTPRequest("register", "resend");
		resend();
	});
}

// Change Password
if (changePassword) {
	let passwordInput = document.getElementById("chPassword");
	let cPasswordInput = document.getElementById("chConfirmPassword");
	let criteriaList = document.getElementById("criteria");

	let qPassword = false;
	let qCPassword = false;

	passwordEyes("chPassword", "chPasswordEye");
	passwordEyes("chConfirmPassword", "chConfirmpasswordEye");

	// Binds
	passwordInput.addEventListener("focus", showCriteria);
	passwordInput.addEventListener("blur", hideCriteria);
	passwordInput.addEventListener("keyup", validatePassword);
	cPasswordInput.addEventListener("keyup", checkPassword);

	// Functions

	function showCriteria() {
		criteriaList.classList.add("visible");
		criteriaList.classList.remove("hidden");
	}

	function hideCriteria() {
		criteriaList.classList.remove("visible");
		criteriaList.classList.add("hidden");
	}

	function validatePassword() {
		let password = passwordInput.value;
		let cpassword = cPasswordInput.value;

		if (cpassword) {
			checkPassword();
		}

		// Regular expressions to check for different criteria
		let lowercaseRegex = /[a-z]/;
		let uppercaseRegex = /[A-Z]/;
		let symbolRegex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
		let digitRegex = /[0-9]/;

		// Check if all criteria are met
		let isLowercase = lowercaseRegex.test(password);
		let isUppercase = uppercaseRegex.test(password);
		let isSymbol = symbolRegex.test(password);
		let isDigit = digitRegex.test(password);
		let isLengthValid = password.length >= 8;

		let lowercaseEl = document.getElementById("lowercase");
		let uppercaseEl = document.getElementById("uppercase");
		let symbolEl = document.getElementById("symbol");
		let digitEl = document.getElementById("digit");
		let lengthEl = document.getElementById("length");

		lowercaseEl.innerHTML =
			"<span>" +
			(isLowercase
				? "<i class='fas fa-check'></i>"
				: "<i class='fas fa-times'></i> ") +
			"</span> At least one lowercase letter";
		lowercaseEl.style.color = isLowercase ? "green" : "red";

		uppercaseEl.innerHTML =
			"<span>" +
			(isUppercase
				? "<i class='fas fa-check'></i>"
				: "<i class='fas fa-times'></i> ") +
			"</span> At least one uppercase letter";
		uppercaseEl.style.color = isUppercase ? "green" : "red";

		symbolEl.innerHTML =
			"<span>" +
			(isSymbol
				? "<i class='fas fa-check'></i>"
				: "<i class='fas fa-times'></i> ") +
			"</span> At least one symbol";
		symbolEl.style.color = isSymbol ? "green" : "red";

		digitEl.innerHTML =
			"<span>" +
			(isDigit
				? "<i class='fas fa-check'></i>"
				: "<i class='fas fa-times'></i> ") +
			"</span> At least one digit";
		digitEl.style.color = isDigit ? "green" : "red";

		lengthEl.innerHTML =
			"<span>" +
			(isLengthValid
				? "<i class='fas fa-check'></i>"
				: "<i class='fas fa-times'></i> ") +
			"</span> Minimum length of 8 characters";
		lengthEl.style.color = isLengthValid ? "green" : "red";

		if (
			isLowercase &&
			isUppercase &&
			isSymbol &&
			isDigit &&
			isLengthValid
		) {
			document.getElementById("chPassword").style.boxShadow =
				"inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 8px rgba(0, 255, 255)";
			document.getElementById("innerPass").innerText = "";
			qPassword = true;
		} else {
			document.getElementById("chPassword").style.boxShadow =
				"inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 8px rgba(255, 0, 0)";
			document.getElementById("innerPass").innerText =
				"Password must meet all criteria";
			qPassword = false;
		}
		saveNewPassBtn();
	}

	// Confirm Password

	function checkPassword() {
		let password = passwordInput.value;
		let cpassword = cPasswordInput.value;

		if (password == cpassword) {
			document.getElementById("chConfirmPassword").style.boxShadow =
				"inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 8px rgba(0, 255, 255)";
			document.getElementById("innerCPass").innerText = "";
			qCPassword = true;
		} else {
			document.getElementById("chConfirmPassword").style.boxShadow =
				"inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 8px rgba(255, 0, 0)";
			document.getElementById("innerCPass").innerText =
				"Password did not match";
			qCPassword = false;
		}
		saveNewPassBtn();
	}

	function saveNewPassBtn() {
		if (qPassword && qCPassword) {
			document
				.getElementById("saveNewPassBtn")
				.removeAttribute("disabled");
		}
	}

	document
		.getElementById("saveNewPassBtn")
		.addEventListener("click", function () {
			changePass(passwordInput.value); // Change password
		});
	function changePass(password) {
		// Create a JSON object with OTP and type
		const data = {
			password: password,
		};

		fetch("/change-password", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(data),
		})
			.then((response) => {
				if (response.ok) {
					return response.json();
				} else {
					throw new Error("Network response was not ok.");
				}
			})
			.then((response) => {
				// console.log(response)
				if (response.type == "Ok") {
					document.getElementById("innerPass").innerText = "";
					notification("alert-success", response.message);
					window.location.href = "/changed-password";
				} else if (response.type == "passwordError") {
					document.getElementById("innerPass").innerText =
						response.message;
					notification("alert-danger", response.message);
					// new password mathces old password
				} else if (response.type == "NotOk") {
					notification("alert-danger", response.message);
					document.getElementById("innerPass").innerText =
						response.message;
					// OTP is not valid
				}
			})
			.catch((error) => {
				console.error("Error:", error);
				// callback(false); // Handle errors
			});
	}
}

// ForgotPass
if (forgotPass) {
	function handleInput(index) {
		if (otpInputs[index].value.length === 1) {
			if (index < otpInputs.length - 1) {
				otpInputs[index + 1].focus();
			}
		}
	} // take input

	function eraseLastInput() {
		for (let i = otpInputs.length - 1; i >= 0; i--) {
			if (otpInputs[i].value.length > 0) {
				otpInputs[i].value = "";
				otpInputs[i].focus();
				break;
			}
		}
	} // erase input function
	for (j = 0; j < 6; j++) {
		otpInputs[j].addEventListener("keydown", function (event) {
			if (event.key == "Backspace") {
				eraseLastInput();
			}
		});
	} //erase input
	for (let z = 0; z < otpInputs.length; z++) {
		otpInputs[z].addEventListener("keydown", function (event) {
			if (isNaN(event.key) && event.key != "Backspace") {
				event.preventDefault();
			}
		});
	} // allow only numbers

	const tooltipEmail = new bootstrap.Tooltip(registeredEmailCheck);
	function checkEmail() {
		$.ajax({
			url: "/emailexist",
			type: "POST",
			type: "GET",
			data: { email: registeredEmail.value },
			beforeSend: function () {
				showLoadingIcon();
			},
			success: function (response) {
				if (response == "emailexists") {
					hideLoadingIcon();
					registeredEmail.setAttribute("readonly", true);
					registeredEmailCheck.src = registeredEmailCheck.src.replace(
						"exclamation",
						"tick"
					);
					tooltipEmail.disable();
					forgotPassBtn.removeAttribute("disabled");
				}
			},
		});
	}

	registeredEmail.addEventListener("keyup", function () {
		clearTimeout(timer);
		timer = setTimeout(function () {
			checkEmail();
			showLoadingIcon();
		}, 700);
	});
	let sendRequest = true; //forgotPassBtn;
	forgotPassBtn.addEventListener("click", function () {
		if (sendRequest) {
			forgotPassOtp.classList.remove("hidden");
			forgotPassResend.classList.remove("hidden");
			sendOTPRequest(registeredEmail.value);
			sendRequest = false;
			checkOtp();
		}
	});

	function checkOtp() {
		otpInputs[0].focus();
		forgotPassBtn.addEventListener("click", async function () {
			let receivedOtp = "";
			for (let k = 0; k < 6; k++) {
				receivedOtp += otpInputs[k].value;
			}
			// Change kar lena jo daalna hai
			await checkOtpNow(receivedOtp, "forgot"); //Check received OTP
		});
		resend(); // to initiate resend timer
		otpResend.addEventListener("click", function () {
			resend();
			sendOTPRequest(registeredEmail.value, "resend");
		});
	}
	// Timeleft
	function resend() {
		resendLine.classList.add("hidden");
		resendTimer.classList.remove("hidden");
		let timeLeft = 29;
		function updateTimer() {
			document.getElementById(
				"timer"
			).innerHTML = `Resend OTP in : ${timeLeft} sec`;
			if (timeLeft == 0) {
				clearInterval(timerInterval); // Stop the timer
				resendTimer.classList.add("hidden");
				resendLine.classList.remove("hidden");
				document.getElementById(
					"timer"
				).innerHTML = `Resend in : 30 sec`; // Change as timer expires.
			} else {
				timeLeft--; // Decrement the time
			}
		}
		const timerInterval = setInterval(updateTimer, 1000);
	}
}
// To check autofill if needed
// document.addEventListener('onautocomplete',function(e){
// 	console.log(e,"autocomplete hoise");
// 	e.preventDefault();
// });

// $(document).ready(function () {
//   $('#section2').scrollex({
//     delay: 500,
//     enter: function () {
//       console.log('Element entered the viewport');
//     },
//     leave: function () {
//       console.log('Element left the viewport');
//     },
//   });
// });

if (changelog) {
	console.log("Changelog Page");
	async function fillChangeLog() {
		const response = await fetch("/static/assets/data/changelog.json");
		const changelogsData = await response.json();
		// console.log(changelogsData);
		displayChangelog(changelogsData);
	}

	fillChangeLog();

	let accordian = document.getElementById("changelogAccordion");
	function displayChangelog(data) {
		let keys = Object.keys(data);
		let values = Object.values(data);
		for (let i = 0; i < keys.length; i++) {
			const temp = `
			<div class="accordion-item">
			<h2 class="accordion-header">
				<button
					class="accordion-button ${i == 0 ? "" : "collapsed"}"
					type="button"
					data-bs-toggle="collapse"
					data-bs-target= ${"#panelsStayOpen-collapse" + i}
					aria-expanded= "${i == 0 ? "true" : "false"}"
					aria-controls="panelsStayOpen-collapseOne"
				>
					 <b> ${keys[i]} - ${values[i].desc} </b>
				</button>
			</h2>
			<div
				id= ${"panelsStayOpen-collapse" + i}
				class="accordion-collapse collapse ${i == 0 ? "show" : ""}"
			>
				<div class="accordion-body">
					<ul class="m-0 py-0">
					  ${values[i].changes
							.map((change) => {
								return `<li>${change}</li>`;
							})
							.join("")}
					</ul>
				</div>
			</div>
		</div>`;
			accordian.innerHTML += temp;
		}
	}
}
