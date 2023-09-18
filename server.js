const express = require("express")
const mongoose = require("mongoose");
const app = express();
require("dotenv").config();

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
    } catch(error) {
        console.error(error);
    }
}

start();