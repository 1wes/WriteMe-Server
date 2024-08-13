import nodemailer from 'nodemailer';
import envConfig from '../env-config';

const { senderEmail, password } = envConfig;

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
        console.log("[✅]:Ready to send email");
    }
})

export default transporter;