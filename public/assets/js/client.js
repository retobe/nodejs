var headers = new Headers();
headers.append('Content-Type', 'application/json');
headers.append('Accept', 'application/json');

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
}

async function checkSessionValidity(sessionToken) {
    try {
        const response = await fetch('http://localhost:3001/check-session', {
            method: 'POST',
            headers: headers,
            credentials: 'include',
            body: JSON.stringify({ sessionToken }),
        });

        if (response.status === 200) {
            // Session is valid; you can consider the user as logged in
            const data = await response.json();
            alert(data.message);
            // Redirect to the dashboard or other authorized pages
        } else {
            // Session is not valid; you can proceed with the login form
        }
    } catch (error) {
        console.error(error);
    }
}

async function checkSessionOnLoad() {
    // Get the session token from the cookie
    const sessionToken = getCookie('sessionToken');

    if (sessionToken) {
        // Check the validity of the session token
        try {
            const response = await fetch('http://localhost:3001/check-session', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ sessionToken }),
            });

            const data = await response.json();
            console.log(data.session)

            if (data.session === true) {
                window.location.replace("Home.htm");
            } else {
                return;
            }
        } catch (error) {
            console.error(error);
        }
    }
}

checkSessionOnLoad()

//REGISTER FORM
async function handleRegisterSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const requestData = {
        username: formData.get("username"),
        email: formData.get("email"),
        password: formData.get("password")
    };

    console.log(requestData)

    try {
        const response = await fetch(`http://localhost:3001/register`, {
            method: "POST",
            redirect: 'follow',
            credentials: 'include',
            headers: headers,
            body: JSON.stringify(requestData)
        });

        const alertDiv = document.querySelector("#registerAlert")
        const form = document.querySelector(".container")
        const data = await response.json();
        alertDiv.innerHTML = data.message || data.error || `Register Failed. Please try again.`
        if (data.message) {
            alertDiv.classList.remove("danger")
            alertDiv.classList.add("success")
            form.style.display = "none";
            console.log(document.cookie)
            if (document.cookie.includes('sessionToken')) {
                console.log('SessionToken cookie is set.');
            } else {
                console.log("Nope didnt work")
            }
            setTimeout(() => {
                alertDiv.innerText = "Redirecting..."
                setTimeout(() => {
                    window.location.replace("Home.htm")
                }, 1000);
            }, 2000);
        } else if (data.error) {
            alertDiv.classList.remove("success")
            alertDiv.classList.add("danger")
        }
        alertDiv.style.display = "flex";
    } catch (error) {
        console.error(error);
        alert("An error occurred while processing your request.");
    }
}

// LOGIN FORMMMMMMMMMMMM
async function handleLoginSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const requestData = {
        email: formData.get("email"),
        password: formData.get("password")
    };
    try {
        const response = await fetch(`http://localhost:3001/login`, {
            method: "POST",
            redirect: 'follow',
            credentials: 'include',
            headers: headers,
            body: JSON.stringify(requestData)
        });


        const alertDiv = document.querySelector("#loginAlert")
        const form = document.querySelector(".container")
        const data = await response.json();
        alertDiv.innerHTML = data.message || data.error || `Login Failed. Please try again.`
        if (data.message) {
            alertDiv.classList.remove("danger")
            alertDiv.classList.add("success")
            form.style.display = "none";
            setTimeout(() => {
                alertDiv.innerText = "Redirecting..."
                setTimeout(() => {
                    window.location.replace("Home.htm")
                }, 1000);
            }, 2000);
        } else if (data.error) {
            alertDiv.classList.remove("success")
            alertDiv.classList.add("danger")
        }
        alertDiv.style.display = "flex";

    } catch (error) {
        console.error(error);
        alert("An error occurred while processing your request.");
    }
}
