const { User } = require("../models");
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

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
            res.status(200).json({ message: 'User Account Created', status: true });
        } else {
            res.status(500).json({ message: 'Error in creating account', status: false });
        }

    } catch (error) {
        res.status(500).json({ message: 'Failed to create account', error: error.message, status: false });
    }
};

module.exports = {
    createAccount
};