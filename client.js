document
.getElementById("registrationForm")
.addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const requestData = {
    username: formData.get("username"),
    email: formData.get("email"),
    password: formData.get("password"),
  };

  try {
    const response = await fetch("http://localhost:3000/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    });

    if (response.status === 201) {
      alert("User registered successfully!");
      // Redirect or perform other actions as needed
    } else {
      alert("Registration failed. Please try again.");
    }
  } catch (error) {
    console.error(error);
    alert("An error occurred while processing your request.");
  }
});