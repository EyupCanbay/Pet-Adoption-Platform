if(process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors')
const corn = require("./config/cronJobs");


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
app.use('/users', require('./routes/users_routes.js'));
app.use('/category',require('./routes/category_routes.js'));
app.use('/subcategory', require('./routes/subcategory_routes.js'))


module.exports =  app;