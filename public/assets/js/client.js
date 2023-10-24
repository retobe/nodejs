async function handleRegisterSubmit(e) {
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
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(requestData)
        });

        window.location.replace("Login.htm")
    } catch (error) {
        console.error(error);
        alert("An error occurred while processing your request.");
    }
}

// login form

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
            headers: {
                "Content-Type": "application/json"
            },
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
