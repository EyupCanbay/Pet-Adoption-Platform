const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors')

dotenv.config();

const app = express();
const corsOptions = {
    origin: "*", 
    credentials: true, 
    methods: ['GET', 'POST', 'PUT', 'DELETE']
};

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors(corsOptions));


app.use('/auth', require('./routes/auth_routes.js'));


module.exports =  app;