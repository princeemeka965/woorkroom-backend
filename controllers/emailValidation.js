const nodemailer = require("nodemailer");
const { createHash } = require('crypto');

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
        const randomToken = Math.floor(1000 + Math.random() * 9000);

        const info = await transporter.sendMail({
            from: '"WoorkRoom" <carradotechnologiesltd@gmail.com>', // sender address
            to: `${req.body.email}`, // list of receivers
            subject: "Email Validation", // Subject line
            text: `You've reset your password`, // plain text body
            html: `<b>Your email validation OTP is ${randomToken}</b> <p>This OTP expires in the next 90 secs</p>`, // html body
        });

        const hashedToken = createHash('sha256').update(randomToken).digest('hex');

        res.status(200).json({ message: 'OTP sent', __rcd_mpIv: hashedToken });
    }
    catch (error) {
        console.error('Error sending OTP email:', error);
        res.status(500).json({ message: 'Failed to send OTP', error: error });
    }
})

module.exports = {
    sendOTP
}