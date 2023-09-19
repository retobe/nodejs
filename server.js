const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const express = require("express");
const cors = require('cors'); // Import the cors middleware
const app = express();
require("dotenv").config();
const User = require("./User"); // Make sure this path is correct
const uri = process.env.TOKEN;

mongoose.connect(uri);

// Use body-parser middleware to parse incoming request bodies
app.use(cors());
app.use(bodyParser.json()); // Parse JSON data
app.use(express.static('http://127.0.0.1:3000/Index.htm')); // Replace 'public' with your directory name
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded form data

app.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const emailExist = await User.exists({ email: email });
        let msg = "User succesfully created.";

        if (emailExist) {
            msg = 'This email already exists!';
        } else {

            const user = await User.create({
                name: username,
                email: email,
                password: password
            });

            await user.save();
        }

        console.log(emailExist);

        res.status(201).json({ message: msg });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Registration failed' });
    }
});

// Your other routes and middleware can be defined here...

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
