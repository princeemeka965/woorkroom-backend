const { OrganisationDB } = require("../models");

const createAccount = (async (req, res) => {
    const user = await OrganisationDB.create({});
});

module.exports = {
    createAccount
}