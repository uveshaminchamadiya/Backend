const express = require('express')
const app = express();

app.get('/', (req,res) => {
    return res.status(200).send('<h1>Hello World! Welcome to ExpressJS App');
})

app.listen(8000, (req,res) => {
    console.log("Server listening at: http://localhost:8000");
})