const express = require('express');
const app = express();
const cors = require('cors');

// Users routes
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const student = require('./routes/studentRoute'); 
const errorHandler = require('./middlewares/errorHandler');
// Middleware to parse JSON requests
app.use(bodyParser.json());
app.use(cookieParser());

const corsOptions = {
    origin: ['http://localhost:3001', 'http://localhost:3000'], // Replace with the origin you want to allow
    methods: 'GET, POST, OPTIONS, PUT, PATCH, DELETE',
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true, // Allow cookies and permission headers
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
 
// Use the defined routes in the routes folder
app.use('/api/students', student);

// Middleware global pour erreurs
app.use(errorHandler);

module.exports = app;