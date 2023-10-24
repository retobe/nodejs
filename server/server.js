const chalk = require("chalk");
const express = require("express");
const cookieParser = require('cookie-parser');
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
const corsOptions = {
    origin: ['http://localhost:8080', "http://localhost:3000", "http://192.168.1.248:8080"],
    credentials: true,
};

app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});
app.use(cors(corsOptions));
app.use(bodyParser.json()); // Parse JSON data
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded form data
app.use(cookieParser());




mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log(chalk.blueBright('Connected to MongoDB'));
    })
    .catch((error) => {
        console.error(chalk.red('MongoDB connection error\n\n'), error);
    });

// REGISTER FORM
app.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    // Check if the user has a session token cookie
    const sessionToken = req.cookies['sessionToken'];

    if (sessionToken) {
        // Check the validity of the session token
        try {
            const user = await Schema.User.findOne({ sessionToken });
            if (user && user.sessionExpiration > new Date()) {
                // Session is valid; update the session expiration (e.g., refresh it to 7 days from now)
                const newExpiration = new Date();
                newExpiration.setDate(newExpiration.getDate() + 7);

                // Update the session expiration in the database
                user.sessionExpiration = newExpiration;
                await user.save();

                // You can consider the user as logged in, so respond with success
                return res.status(200).json({ message: 'Session is valid. User is logged in.', session: true });
            }
        } catch (error) {
            console.error(error);
        }
    }

    // If the session token is not valid or doesn't exist, proceed with regular registration
    try {
        console.log("Reached here")
        // Check if the email already exists in the database
        const existingUser = await Schema.User.exists({ email: email });

        if (!!existingUser === true) {
            console.log("Reached here EMAIL TING")
            return res.status(401).json({ error: 'Email already inuse' });
        }

        // Create a new user
        const user = await Schema.User.create({ name: username, email: email, password: password });


        // Set a new session token for the newly registered user (similar to the login route)

        const sessionToken = generateUniqueSessionToken();
        const expirationTimestamp = new Date();
        expirationTimestamp.setDate(expirationTimestamp.getDate() + 7);

        user.sessionToken = sessionToken;
        user.sessionExpiration = expirationTimestamp;
        await user.save();

        res.cookie('sessionToken', sessionToken, {
            expires: expirationTimestamp,
            httpOnly: false,
        }).status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Registration failed' });
    }
});


//LOGIN FORM
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    // Check if the user has a session token cookie
    const sessionToken = req.cookies['sessionToken'];

    if (sessionToken) {
        // Check the validity of the session token
        try {
            const user = await Schema.User.findOne({ sessionToken });
            if (user && user.sessionExpiration > new Date()) {
                // Session is valid; update the session expiration (e.g., refresh it to 7 days from now)
                const newExpiration = new Date();
                newExpiration.setDate(newExpiration.getDate() + 7);

                // Update the session expiration in the database
                user.sessionExpiration = newExpiration;
                await user.save();

                // You can consider the user as logged in, so respond with success
                return res.status(200).json({ message: 'Session is valid. User is logged in.' });
            }
        } catch (error) {
            console.error(error);
        }
    }

    // If the session token is not valid or doesn't exist, proceed with regular login
    try {
        const user = await Schema.User.findOne({ email: email });

        if (!!user === true) {
            if (password != user.password) {
                return res.status(401).json({ error: `Invalid Password` });
            } else {
                // User has successfully logged in; create a new session token.
                const sessionToken = generateUniqueSessionToken();

                // Calculate the session's expiration timestamp (e.g., 7 days from now).
                const expirationTimestamp = new Date();
                expirationTimestamp.setDate(expirationTimestamp.getDate() + 7);

                // Update the user's document with the new session token and its expiration.
                user.sessionToken = sessionToken;
                user.sessionExpiration = expirationTimestamp;
                await user.save();

                // Set a new cookie with the session token
                res.cookie('sessionToken', sessionToken, {
                    expires: expirationTimestamp,
                    httpOnly: false
                }).json({ message: 'Successfully Logged in', sessionToken }).end();
            }
        } else if (!user) {
            return res.status(401).json({ error: 'User doesn\'t exist.' });
        }

        return res.status(401).json({ error: 'Submission failed' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Submission failed' });
    }
});



app.post('/check-session', async (req, res) => {
    const { sessionToken } = req.body;

    try {
        // Find the user associated with the session token
        const user = await Schema.User.findOne({ sessionToken });

        if (user && user.sessionExpiration > new Date()) {
            // Session is valid
            return res.status(200).json({ session: true });
        } else {
            // Session is not valid
            return res.status(401).json({ session: false });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while checking the session.' });
    }
});


app.post("/user", async (req, res) => {
    const { sessionToken } = req.body;
    const userProfile = await Schema.User.findOne({ sessionToken: sessionToken });
    if (!userProfile) {
        return res.json({ error: `Session token has been altered please delete your cookies from this domain or relogin.` })
    } else {
        return res.json({ message: `Success`, profile: userProfile, amount: userProfile.balance })
    }
})


app.post("/cookie-add", async (req, res) => {
    const { sessionToken } = req.body;
    const userProfile = await Schema.User.findOne({ sessionToken: sessionToken });
    if (!userProfile) {
        return res.json({ error: `Session token has been altered please delete your cookies from this domain or relogin.` })
    } else {
        userProfile.balance += 1;
        userProfile.save();
        return res.json({ message: `Success`, amount: userProfile.balance })
    }
})


// Start the server
const port = process.env.PORT;

app.listen(port, () => {
    console.log(chalk.hex('#00FF00')(`Server is running on port ${port}`));
});
