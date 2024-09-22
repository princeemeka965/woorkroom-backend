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

        // check if user with the email address currently exists
        const retrieveDBUsers = await User.findAll({ where: { email: req.body.email } });

        if (retrieveDBUsers.length > 0) {
            res.status(500).json({ message: 'User with email currently exist', status: false });
        }
        else {
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

                res.status(200).json({ message: 'User Account Created', userData: userData, lynchpin: token, status: true });
            } else {
                res.status(500).json({ message: 'Error in creating account', status: false });
            }
        }

    } catch (error) {
        res.status(500).json({ message: 'Failed to create account', error: error.message, status: false });
    }
};


const loginAccount = async (req, res) => {
    try {
        const retrieveDBUser = await User.findOne({ where: { email: req.body.email } });

        // compare passwords to check if they match
        const passwordExist = await bcrypt.compare(req.body.password, retrieveDBUser.password);

        if (!passwordExist) {
            res.status(500).json({ message: 'Invalid username or password', status: false });
        }
        else {
            const userData = {
                name: retrieveDBUser.fullNames,
                email: retrieveDBUser.email,
                orgDomain: retrieveDBUser.orgDomain
            };
            // Generate the token
            const token = jwt.sign(userData, secretKey, { expiresIn: '48h' });
            res.status(200).json({ lynchpin: token, userData: userData, status: true });
        }

    } catch (error) {
        res.status(500).json({ message: 'Error in validating account', error: error.message, status: false });
    }
};


const lynchpinValidate = async (req, res) => {
    jwt.verify(req.body.token, secretKey, (err, decoded) => {
        if (err) {
            console.error('Error decoding token:', err);
        } else {
            console.log('Decoded user data:', decoded);
            // Access the user data from the decoded token
            const userData = {
                name: decoded.name,
                email: decoded.email,
                orgDomain: decoded.orgDomain
            };
            res.status(200).json({ userData: userData, status: true });
        }
    });
}

module.exports = {
    createAccount,
    loginAccount,
    lynchpinValidate
};