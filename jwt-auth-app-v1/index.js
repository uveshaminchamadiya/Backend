const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();


const app = express();
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;
const secretKey = process.env.SECRET_KEY || 'dummyKey';

//  Store User Data
const users = [];

// route setting 

// User registration route
app.post('/register', async (req, res) => {
    const { username, password } = req.body;

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 8);

    // Store user
    users.push({ username, password: hashedPassword });

    res.status(201).send({ message: 'User registered successfully!' });
});

// User login route
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    // Find user
    const user = users.find(u => u.username === username);
    if (!user) {
        return res.status(400).send({ message: 'Invalid credentials' });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return res.status(400).send({ message: 'Invalid credentials' });
    }

    // Generate JWT
    const token = jwt.sign({ username: user.username }, secretKey, { expiresIn: '1m' });

    res.send({ token });
});

// Protected route
app.get('/protected', (req, res) => {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(401).send({ message: 'No token provided' });
    }

    // Verify token
    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            return res.status(401).send({ message: 'Invalid token' });
        }

        res.send({ message: 'Welcome to the protected route!', user: decoded });
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}/`);
});
