const express = require('express')
// App Created
const app = express();

// routes setting 
app.get('/', (req, res) => {
    return res.status(200).send('<h1>Home Page<h1>');
})

app.get('/about', (req, res) => {
    return res.status(200).send('<h1>About Page<h1>');
})

app.get('/orderDetails', (req, res, accessGranted) => {
        const { user } = req.query
        // Only Valid User can access this route
        if (user !== 'Valid User') {
            return res.status(403).send({ message: "Access denied" })
        }
        // access granted is its an valid user
        accessGranted();
    },
    // this block will exicute if valid user is detected
    (req,res) => {
        return res.status(200).send('<h1>Order Details Page<h1>');
    }
)

// listening server at port 8000
app.listen(8000, (req, res) => {
    console.log("Server listening at: http://localhost:8000");
})