const { User } = require("../models");
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');

// Define a secret key to sign the json token
const secretKey = 'SEQUELIZE0006';

const createAccount = async (req, res) => {
    try {
        const uuid = uuidv4();
        const saltRounds = 10;

        // Hash the password
        const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);

        // Create the user with the hashed password
        const user = await User.create({
            fullNames: req.body.name,
            email: req.body.email,
            password: hashedPassword, // Save the hashed password
            userId: uuid,
            orgDomain: req.body.orgDomain
        });

        if (user) {
            const userData = {
                name: req.body.name,
                email: req.body.email,
                orgDomain: req.body.orgDomain
            };
            // Generate the token
            const token = jwt.sign(userData, secretKey, { expiresIn: '48h' });

            res.status(200).json({ message: 'User Account Created', lynchpin: token, status: true });
        } else {
            res.status(500).json({ message: 'Error in creating account', status: false });
        }

    } catch (error) {
        res.status(500).json({ message: 'Failed to create account', error: error.message, status: false });
    }
};


const loginAccount = async (req, res) => {
    try {
        const saltRounds = 10;

        // Hash the password
        const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
        const retrieveDBUsers = await User.findAll({ where: { user: req.body.username, password: hashedPassword } });

        if (retrieveDBUsers.length === 0) {
            res.status(500).json({ message: 'Invalid username or password', status: false });
        }
        else {
            const userData = {
                name: retrieveDBUsers[0].fullNames,
                email: retrieveDBUsers[0].email,
                orgDomain: retrieveDBUsers[0].orgDomain
            };
            // Generate the token
            const token = jwt.sign(userData, secretKey, { expiresIn: '48h' });
            res.status(200).json({ message: 'User Account Created', lynchpin: token, status: true });
        }

    } catch (error) {
        res.status(500).json({ message: 'Error in validating account', error: error.message, status: false });
    }
};

module.exports = {
    createAccount,
    loginAccount
};