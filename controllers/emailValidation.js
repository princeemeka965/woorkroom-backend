const nodemailer = require("nodemailer");

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
        const randomNumber = Math.floor(1000 + Math.random() * 9000);

        const info = await transporter.sendMail({
            from: '"WoorkRoom" <carradotechnologiesltd@gmail.com>', // sender address
            to: `${req.body.email}`, // list of receivers
            subject: "Email Validation", // Subject line
            text: `You've reset your password`, // plain text body
            html: `<b>Your email validation OTP is ${randomNumber}</b> <p>This OTP expires in the next 90 secs</p>`, // html body
        });

        console.log(info.response)

        res.status(200).json({ message: 'OTP sent', data: { randomNumber } });
    }
    catch (error) {
        console.error('Error sending OTP email:', error);
        res.status(500).json({ message: 'Failed to send OTP', error: error });
    }
})

module.exports = {
    sendOTP
}