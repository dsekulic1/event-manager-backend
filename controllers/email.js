const asyncWrapper = require('../middleware/async')
require('dotenv').config();
var nodemailer = require('nodemailer');

const SENDER_ADDRESS = process.env.SENDER_ADDRESS;
const SENDER_PASS = process.env.SENDER_PASS;
const mail = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    auth: {
        user: SENDER_ADDRESS,
        pass: SENDER_PASS
    }
});

const sendEmail = asyncWrapper(async(req, res) => {

    var mail_content = "Poštovani,\n\n" + req.body.emailMessage + "\n\nLijep pozdrav,\nVaše obavijesti."
    var mailOptions = {
        from: SENDER_ADDRESS,
        to: req.body.emailTo,
        subject: 'Obavijest',
        text: mail_content
    };
    const response = mail.sendMail(mailOptions);
    if (!response.ok) {
        return next(createCustomError(`Error : ${error}`, 500))
    }
    mail.close();
    return res.status(201).json({ response });
})

module.exports = sendEmail