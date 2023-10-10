const nodemailer = require("nodemailer");
const { senderEmail, password } = require('../env-config');

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: senderEmail,
        pass: password
    }
});

transporter.verify(err => {
    
    if (err) {
        console.log(err);
    } else {
        console.log("Ready to send email");
    }
})
module.exports = transporter;