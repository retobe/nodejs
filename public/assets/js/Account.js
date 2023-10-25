async function signOut() {
    const sessionToken = getCookie('sessionToken');
    try {
        if (!sessionToken) {
            return window.location.replace("Register.htm")
        } else {
            document.cookie = "sessionToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            return window.location.replace("Login.htm")
        }
    } catch (error) {
        console.error(error);
        alert("An error occurred while processing your request.");
    }
}

async function deleteAccount() {
    const sessionToken = getCookie('sessionToken');
    try {
        const response = await fetch(`http://localhost:3001/delete-account`, {
            method: "POST",
            redirect: 'follow',
            credentials: 'include',
            headers: headers,
            body: JSON.stringify({ sessionToken }),
        });

        const data = await response.json();
        if (data.success === true) {
            signOut()
            window.location.reload()
        } else {
            alert(`There has been an Internal Server Error. Please try again later.\n\n${data?.error}`)
        }
    } catch (error) {
        console.error(error);
        alert("An error occurred while processing your request.");
    }
}

async function deleteData() {
    const sessionToken = getCookie('sessionToken');
    try {
        const response = await fetch(`http://localhost:3001/delete-data`, {
            method: "POST",
            redirect: 'follow',
            credentials: 'include',
            headers: headers,
            body: JSON.stringify({ sessionToken }),
        });

        const data = await response.json();
        if (data.success === true) {
            window.location.reload()
        } else {
            alert(`There has been an Internal Server Error. Please try again later.\n\n${data?.error}`)
        }
    } catch (error) {
        console.error(error);
        alert("An error occurred while processing your request.");
    }
}