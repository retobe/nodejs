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
            const multiplier = data.profile.multiplier;

            const items = document.querySelectorAll('.item');

            items.forEach(item => {
                const h1 = item.querySelector('h1');
                if (h1.textContent === multiplier + 'x') {
                    item.classList.add('selected');
                }
            });
            await updateValues(data.profile.balance, data.profile.multiplier)
        } catch (error) {
            console.error(error);
        }
    } else {
        return window.location.replace("Register.htm");
    }
}

setTimeout(updatePageTing, 1000);

async function updateValues(amount, multiplier) {
    if (isNaN(amount)) return console.log("Invalid Amount");
    if (isNaN(multiplier)) return console.log("Invalid Multiplier");
    const balanceElement = document.querySelector("#balanceAmount");
    balanceElement.textContent = `Balance: ${amount.toLocaleString() || 0}`;
    const multiplierElement = document.querySelector("#multiplierAmount");
    multiplierElement.textContent = `Multiplier: ${multiplier.toLocaleString() + "x" || "1x"}`;
}

async function addCount() {
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
        updateValues(data.amount, data.profile.multiplier);

    } catch (error) {
        console.error(error);
        alert("An error occurred while processing your request.");
    }
}