var headers = new Headers();
headers.append('Content-Type', 'application/json');
headers.append('Accept', 'application/json');

document.addEventListener("DOMContentLoaded", function () {
    const items = document.querySelectorAll(".shop .item");

    items.forEach((item) => {
        item.addEventListener("click", (event) => {
            if (item.getAttribute("class").includes("selected")) return;
            items.forEach((item) => {
                item.classList.remove("selected");
            });

            item.classList.add("selected");
            item.disabled = true

            multiplierAdd(parseInt(event.target.textContent));
        });
    });

    async function multiplierAdd(multiplier) {
        const sessionToken = getCookie('sessionToken');
        if (sessionToken) {
            try {
                const response = await fetch(`http://localhost:3001/multiplier`, {
                    method: "POST",
                    redirect: 'follow',
                    credentials: 'include',
                    headers: headers,
                    body: JSON.stringify({ sessionToken, multiplier }),
                });
                const data = await response.json();
                updateValues(data.profile.balance, data.profile.multiplier)
            } catch (error) {
                console.error(error);
            }
        } else {
            return window.location.replace("Login.htm")
        }
    }
});
