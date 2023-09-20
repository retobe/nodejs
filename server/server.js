const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require('cors'); // Import the cors middleware
const app = express();
require("dotenv").config();
const User = require("./User"); // Make sure this path is correct
const uri = process.env.TOKEN; // Change to your MongoDB URI

// Use body-parser middleware to parse incoming request bodies
app.use(cors()); // Enable CORS for all routes
app.use(bodyParser.json()); // Parse JSON data
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded form data

// MongoDB connection setup
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((error) => {
        console.error('MongoDB connection error:', error);
    });

// REGISTER FORM
app.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Check if the email already exists in the database
        const existingUser = await User.exists({ name: username, email: email })
        console.log(!!existingUser);

        if (!!existingUser === true) {
            return res.status(400).json({ message: 'Email/Username already exists.' });
        }

        // Create a new user
        const user = await User.create({ name: username, email: email, password: password });

        // Save the user to the database
        await user.save();
        console.log(user);
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Registration failed' });
    }
});


//LOGIN FORM
app.post('/login', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const user = User.exists({ name: username, email: email, password: password });
        console.log(!!user);
        if (!!user === true) {
            res.status(200).json({ message: 'Successfully Logged in.' });
        } else {
            res.status(400).json({ message: 'This doesnt exist' });
        }


    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Submission failed' });
    }
});

// Start the server
const port = process.env.PORT;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
