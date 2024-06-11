const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();
app.use(bodyParser.json());

const port = process.env.PORT || 3000;
const secretKey = process.env.SECRET_KEY || 'dummySecrectKey';
const refreshSecretKey = process.env.REFRESH_SECRET_KEY || 'dummyRefreshSSecrectKey';

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

    // Generate access token with short expiration time (1 minute)
    const accessToken = jwt.sign({ username: user.username }, secretKey, { expiresIn: '1m' });

    // Generate refresh token with longer expiration time (1 week)
    const refreshToken = jwt.sign({ username: user.username }, refreshSecretKey, { expiresIn: '7d' });

    res.send({ accessToken, refreshToken });
});

// Refresh token route
app.post('/refresh-token', (req, res) => {
    const { refreshToken } = req.body;

    // Verify refresh token
    jwt.verify(refreshToken, refreshSecretKey, (err, decoded) => {
        if (err) {
            return res.status(401).send({ message: 'Invalid refresh token' });
        }

        // Generate new access token
        const accessToken = jwt.sign({ username: decoded.username }, secretKey, { expiresIn: '1m' });

        res.send({ accessToken });
    });
});

// Protected route
app.get('/protected', (req, res) => {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(401).send({ message: 'No token provided' });
    }

    // Verify access token
    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            return res.status(401).send({ message: 'Invalid token' });
        }

        res.send({ message: 'Welcome to the protected route!', user: decoded });
    });
});

app.listen(port, () => {
    console.log('Server running on port 3000');
});
