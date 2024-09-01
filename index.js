const express = require('express');
const { Sequelize } = require('sequelize');
const config = require('./config/config.json');
const cors = require('cors');
const emailValidation = require('./routes/emailValidation');
const authentication = require('./routes/authentication');

const app = express();
app.use(express.json());

app.use(cors({ origin: "*" }));

app.use('/email', emailValidation);
app.use('/users', authentication);


// Initialize Sequelize
const sequelize = new Sequelize(config.development.database, config.development.username, config.development.password, {
    host: config.development.host,
    dialect: config.development.dialect
});

// Test the database connection
sequelize
    .authenticate()
    .then(() => {
        console.log('Database connection has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });

app.listen(8000, () => {
    console.log('Server is running on port 3000');
});