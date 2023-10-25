const chalk = require("chalk");
const express = require("express");
const cookieParser = require('cookie-parser');
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require('cors');
const app = express();
require("dotenv").config();
const Schema = require("./User");
const uuid = require('uuid');

function generateUniqueSessionToken() {
    return uuid.v4();
}
const uri = process.env.TOKEN;

// Use body-parser middleware to parse incoming request bodies
const corsOptions = {
    origin: ['http://localhost:8080', "http://localhost:5500", "http://127.0.0.1:5500", "http://192.168.1.248:8080"],
    credentials: true,
};

app.use(cors(corsOptions));
app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
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
    try {
        const existingUser = await Schema.User.exists({ email: email });

        if (!!existingUser === true) {
            console.log("Reached here EMAIL TING")
            return res.status(401).json({ error: 'Email already inuse' });
        }

        const user = await Schema.User.create({ name: username, email: email, password: password });


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
                return res.cookie('sessionToken', sessionToken, {
                    expires: expirationTimestamp,
                    httpOnly: false
                }).json({ message: 'Successfully Logged in', sessionToken });
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
        const user = await Schema.User.findOne({ sessionToken });

        if (user && user.sessionExpiration > new Date()) {
            return res.status(200).json({ session: true });
        } else {
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
        userProfile.balance += userProfile.multiplier;
        userProfile.save();
        return res.json({ message: `Success`, amount: userProfile.balance, profile: userProfile })
    }
})

app.post("/multiplier", async (req, res) => {
    const { sessionToken, multiplier } = req.body
    const userProfile = await Schema.User.findOne({ sessionToken: sessionToken });
    if (!userProfile) {
        return res.json({ error: `Session token has been altered please delete your cookies from this domain or relogin.` })
    } else {
        userProfile.multiplier = parseInt(multiplier);
        userProfile.save();
        res.json({ profile: userProfile, message: `Multiplier has now been set to ${parseInt(multiplier)}x` })
    }
})

app.post("/delete-account", async (req, res) => {
    const { sessionToken } = req.body
    const database = mongoose.connection;
    const user = database.collection("logusers");

    try {
        const deletedUser = await Schema.User.findOneAndDelete({ sessionToken: sessionToken });

        if (deletedUser) {
            return res.status(201).json({ message: "User deleted successfully", success: true });
        } else {
            return res.status(404).json({ error: "User not found", success: false });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: `There has been an Internal Server Error. Please try again later.`, success: false });
    }
})

app.post("/delete-data", async (req, res) => {
    const { sessionToken } = req.body
    try {
        const userProfile = await Schema.User.findOne({ sessionToken: sessionToken })

        if (!userProfile) {
            return res.status(404).json({ error: "User not found", success: false });
        } else {
            userProfile.balance = 0;
            userProfile.multiplier = 1;
            userProfile.save();
            return res.status(201).json({ success: true });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: `There has been an Internal Server Error. Please try again later.`, success: false });
    }
})


const port = process.env.PORT;

app.listen(port, () => {
    console.log(chalk.hex('#00FF00')(`Server is running on port ${port}`));
});
