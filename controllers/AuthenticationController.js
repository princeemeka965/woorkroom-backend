const { User } = require("../models");

const createAccount = (async (req, res) => {
    const { v4: uuidv4 } = require('uuid');
    const uuid = uuidv4();
    try {
        const user = await User.create({ fullNames: req.body.name, email: req.body.email, password: req.body.password, userId: uuid, orgDomain: req.body.orgDomain });

        if (user) {
            res.status(200).json({ message: 'User Account Created', status: true });
        }
        else {
            res.status(500).json({ message: 'Error in creating account', status: false });
        }
    } catch (error) {
        res.status(500).json({ message: 'Failed to create account', error: error, status: false });
    }
});

module.exports = {
    createAccount
}