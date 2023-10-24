const chalk = require("chalk");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require('cors'); // Import the cors middleware
const app = express();
require("dotenv").config();
const Schema = require("./User"); // Make sure this path is correct
const uuid = require('uuid');

function generateUniqueSessionToken() {
    return uuid.v4(); // Generate a random UUID
}
const uri = process.env.TOKEN; // Change to your MongoDB URI

// Use body-parser middleware to parse incoming request bodies
app.use(cors()); // Enable CORS for all routes
app.use(bodyParser.json()); // Parse JSON data
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded form data

// MongoDB connection setup
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log(chalk.blueBright('Connected to MongoDB'));
    })
    .catch((error) => {
        console.error(chalk.red('MongoDB connection error\n\n'), error);
    });

// REGISTER FORM
app.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Check if the email already exists in the database
        const existingUser = await Schema.User.exists({ email: email })

        if (existingUser) {
            return res.status(201).json({ error: 'User registered successfully' });
        }

        // Create a new user
        const user = await Schema.User.create({ name: username, email: email, password: password });

        // Save the user to the database
        await user.save();
        console.log(`Registered works`);
        console.log(chalk.red(user))
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Registration failed' });
    }
});


//LOGIN FORM
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await Schema.User.findOne({ email: email });
        if (!!user === true) {
            if (password != user.password) {
                return res.status(401).json({ error: `Invalid Password` })
            } else {
                return res.json({ message: 'Successfully Logged in.' });
            }
        } else if (!user) {
            return res.status(401).json({ error: 'User doesn\'t exist.' });
        }
        res.status(401).json({ error: 'Submission failed' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Submission failed' });
    }
});

app.get("/login", (req, res) => {
    console.log("Inside GET Login")
    res.json("Login page")
})

app.get("/register", (req, res) => {
    console.log("Inside GET Register")
    res.json("Register page")
})

// Start the server
const port = process.env.PORT;

app.listen(port, () => {
    console.log(chalk.hex('#00FF00')(`Server is running on port ${port}`));
});
