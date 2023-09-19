const express = require("express")
const mongoose = require("mongoose");
const app = express();
require("dotenv").config();
const User = require("./User")
const uri = process.env.TOKEN;

mongoose.set("strictQuery", false);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = 3000;
const customers = [
    {
        "name": "Wael",
        "industry": "Software Developer"
    }
];

app.get('/', (req, res) => {
    res.send("Welcome!");
})

app.get('/api/customers', (req, res) => {
    res.send({ "customers": customers });
})

app.post('/api/customers', (req, res) => {
    console.log(req.body);
    res.send(req.body);
})

app.post('/', (req, res) => {
    res.send("This is a post request");
})


const start = async () => {
    try {
        await mongoose.connect(uri)

        app.listen(PORT, () => {
            console.log('App listening on port', PORT);
        })
    } catch (error) {
        console.error(error);
    }
}

start();

run();
async function run() {
    try {
        const user = await User.create({
            name: "Kyle",
            email: "KYLE123@gmail.com",
            age: 18,
            hobbies: ["Weight lifting", "Coding", "Playing soccer"],
            address: {
                street: "4147 Madison St",
                zipcode: 48125,
                city: "Dearborn Hts",
            },
        });
        user.createdAt = 5;
        await user.save();
        console.log(user)
    } catch(e) {
        console.log(e.message)
    }
}
