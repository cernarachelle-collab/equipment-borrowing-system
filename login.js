/* =========================================
   LOGIN CONFIGURATION
========================================= */

// Demonstration credentials only.
// Do NOT use real passwords here.

const DEMO_USERNAME = "admin";
const DEMO_PASSWORD = "admin123";

// Name of the browser session key.
const SESSION_KEY = "ebms_logged_in";


/* =========================================
   GET HTML ELEMENTS
========================================= */

const loginForm =
    document.getElementById("loginForm");

const usernameInput =
    document.getElementById("username");

const passwordInput =
    document.getElementById("password");

const togglePasswordButton =
    document.getElementById("togglePassword");

const loginMessage =
    document.getElementById("loginMessage");


/* =========================================
   CHECK EXISTING SESSION
========================================= */

// If the user is already logged in,
// there is no need to show the login page again.

if (sessionStorage.getItem(SESSION_KEY) === "true") {

    window.location.href = "index.html";

}


/* =========================================
   LOGIN FORM
========================================= */

loginForm.addEventListener("submit", function (event) {

    // Prevent the browser from refreshing the page.
    event.preventDefault();


    const username =
        usernameInput.value.trim();

    const password =
        passwordInput.value;


    /* -----------------------------------------
       BASIC VALIDATION
    ----------------------------------------- */

    if (!username || !password) {

        showLoginMessage(
            "Please enter your username and password.",
            "error"
        );

        return;

    }


    /* -----------------------------------------
       CHECK DEMONSTRATION CREDENTIALS
    ----------------------------------------- */

    if (
        username === DEMO_USERNAME &&
        password === DEMO_PASSWORD
    ) {

        // Store only the login state.
        // The password is NOT stored.
        sessionStorage.setItem(
            SESSION_KEY,
            "true"
        );


        showLoginMessage(
            "Login successful. Opening the system...",
            "success"
        );


        // Give the user brief feedback before redirecting.
        setTimeout(function () {

            window.location.href = "index.html";

        }, 700);


    } else {

        showLoginMessage(
            "Invalid username or password. Please try again.",
            "error"
        );


        // Clear password after failed login.
        passwordInput.value = "";

        passwordInput.focus();

    }

});


/* =========================================
   SHOW / HIDE PASSWORD
========================================= */

togglePasswordButton.addEventListener(
    "click",
    function () {

        if (passwordInput.type === "password") {

            passwordInput.type = "text";

            togglePasswordButton.textContent =
                "Hide";

            togglePasswordButton.setAttribute(
                "aria-label",
                "Hide password"
            );

        } else {

            passwordInput.type = "password";

            togglePasswordButton.textContent =
                "Show";

            togglePasswordButton.setAttribute(
                "aria-label",
                "Show password"
            );

        }

    }
);


/* =========================================
   DISPLAY LOGIN MESSAGE
========================================= */

function showLoginMessage(message, type) {

    loginMessage.textContent =
        message;

    loginMessage.className =
        `login-message ${type}`;

}