const nodemailer = require("nodemailer");
const { createHash } = require('crypto');
const { EmailDB } = require("../models");

const sendOTP = (async (req, res) => {
    const config = {
        service: "gmail",
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: "carradotechnologiesltd@gmail.com",
            pass: "szsjzbofepsrsaci"
        },
    };

    const transporter = nodemailer.createTransport(config);

    try {
        // Generate a random number between 0 and 999 (inclusive)
        const randomToken = (Math.floor(1000 + Math.random() * 9000));

        await transporter.sendMail({
            from: '"WoorkRoom" <woorkroom@gmail.com>', // sender address
            to: `${req.body.email}`, // list of receivers
            subject: "Account Validation", // Subject line
            text: `Validate your account`, // plain text body
            html: `<div style="margin: 0 auto; min-width: 320px; font-family: "Nunito", sans-serif; max-width: 650px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; background-color: #dff1ff;" class="u-row">
<div style="padding: 0px; background-color: transparent;" class="u-row-container">
<div style="margin: 0 auto; min-width: 320px; max-width: 650px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; background-color: #f3fbfd;" class="u-row">
<div style="border-collapse: collapse; display: table; width: 100%; background-color: transparent;">
<div style="max-width: 320px; min-width: 650px; display: table-cell; vertical-align: top;" class="u-col u-col-100">
<div style="width: 100% !important;">
<div class="rTable">
<div class="rTableBody">
<div class="rTableRow">
<div class="rTableCell">
<div style="color: #1b262c; line-height: 140%; text-align: center; word-wrap: break-word;">
<p style="font-size: 14px; line-height: 140%;"><strong><span style="font-size: 26px; line-height: 36.4px;"> Verify Your WoorkRoom Account </span></strong></p>
</div>
</div>
</div>
</div>
</div>
<div class="rTable">
<div class="rTableBody">
<div class="rTableRow">
<div class="rTableCell">
<div style="color: #1b262c; line-height: 140%; text-align: center; word-wrap: break-word;">
<p style="font-size: 14px; line-height: 140%; text-align: center;"><span style="font-size: 16px; line-height: 22.4px;"> Thank you for Registering on WoorkRoom. </span></p>
<p style="font-size: 14px; line-height: 140%; text-align: center;"><span style="font-size: 16px; line-height: 22.4px;"> Before utilizing our service you need to verify your Account </span></p>
<p style="font-size: 14px; line-height: 140%; text-align: center;"><span style="font-size: 16px; line-height: 22.4px;"> Your account validation OTP is. </span></p>
</div>
</div>
</div>
</div>
</div>
<div class="rTable">
<div class="rTableBody">
<div class="rTableRow">
<div class="rTableCell">
<div align="center">
<span style="display: block; padding: 15px 40px 14px; line-height: 120%;"><strong><span style="font-size: 16px; line-height: 19.2px;"> ${randomToken} </span></strong></span></a></div>
</div>
</div>
</div>
</div>
<div class="rTable">
<div class="rTableBody">
<div class="rTableRow">
<div class="rTableCell">
<div style="color: #5f5f5f; line-height: 140%; text-align: center; word-wrap: break-word;">
<p style="font-size: 14px; line-height: 140%; text-align: center;"><span style="font-size: 12px; line-height: 16.8px;"> We dont send any irrelevant emails you can unsubscribe at any time. </span></p>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>`
});

        const hashedToken = createHash('sha256').update(randomToken.toLocaleString().replace(',', '')).digest('hex');

        const setTokenDB = await EmailDB.create({ address: req.body.email, token: hashedToken });

        if (setTokenDB) {
            res.status(200).json({ message: 'OTP sent', status: true });
        }
        else {
            res.status(500).json({ message: 'Error in creating token', status: false });
        }
    }
    catch (error) {
        console.error('Error sending OTP email:', error);
        res.status(500).json({ message: 'Failed to send OTP', error: error, status: false });
    }
});

const verifyOTP = (async (req, res) => {
    const hashedToken = createHash('sha256').update(req.body.token).digest('hex');

    const retrieveDBToken = await EmailDB.findOne({ where: { address: req.body.email, token: hashedToken } });

    if (retrieveDBToken) {
        // Destroy Email and Table data from DB.
        await EmailDB.destroy({ where: { address: req.body.email } });
        res.status(200).json({ message: 'Email verified successfully', status: true });
    }
    else {
        res.status(500).json({ message: 'Failed to verify OTP', status: false });
    }
});

module.exports = {
    sendOTP,
    verifyOTP
}