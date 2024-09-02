const { User } = require("../models");

const createAccount = (async (req, res) => {
    const uuid = crypto.randomUUID();
    try {
        const user = await User.create({ fullNames: req.body.name, email: req.body.email, password: req.body.password, userId: uuid });
    
        if (user) {
            res.status(200).json({ message: 'User Account Created' });
        }
        else {
            res.status(500).json({ message: 'Error in creating account' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Failed to create account', error: error });
    }
});

module.exports = {
    createAccount
}