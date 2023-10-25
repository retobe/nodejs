var headers = new Headers();
headers.append('Content-Type', 'application/json');
headers.append('Accept', 'application/json');

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
}

// async function checkSessionOnLoad() {
//     // Get the session token from the cookie
//     const sessionToken = getCookie('sessionToken');

//     if (sessionToken) {
//         // Check the validity of the session token
//         try {
//             const response = await fetch('http://localhost:3001/check-session', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({ sessionToken }),
//             });

//             const data = await response.json();
//             console.log(data.session)

//             if (data.session === true) {
//                 window.location.replace("Home.htm");
//             } else {
//                 return window.localStorage.replace("Register.htm");
//             }
//         } catch (error) {
//             console.error(error);
//         }
//     }
// }

// checkSessionOnLoad()

async function updatePageTing() {
    const sessionToken = getCookie('sessionToken');

    console.log(sessionToken)

    if (sessionToken) {
        try {
            const response = await fetch(`http://localhost:3001/user`, {
                method: "POST",
                redirect: 'follow',
                credentials: 'include',
                headers: headers,
                body: JSON.stringify({ sessionToken }),
            });
            const data = await response.json();
            console.log(data.profile)
            await updateBalance(data.profile.balance)
        } catch (error) {
            console.error(error);
            alert("An error occurred while processing your request.");
        }
    } else {
        return window.location.replace("Register.htm");
    }
}

setTimeout(updatePageTing, 1000);

async function updateBalance(amount = 0) {
    if (isNaN(amount)) return console.log("Invalid Amount")
    const balanceElement = document.querySelector("#balanceAmount");
    balanceElement.textContent = `Balance: ${amount}`;
}


async function addCount(e) {
    const sessionToken = getCookie('sessionToken');

    console.log(sessionToken)

    try {
        const response = await fetch(`http://localhost:3001/cookie-add`, {
            method: "POST",
            redirect: 'follow',
            credentials: 'include',
            headers: headers,
            body: JSON.stringify({ sessionToken }),
        });

        const data = await response.json();
        updateBalance(data.amount);

    } catch (error) {
        console.error(error);
        alert("An error occurred while processing your request.");
    }
}