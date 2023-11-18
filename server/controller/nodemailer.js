const nodemailer = require('nodemailer');
const Mailgen = require('mailgen');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    host: "smtp.forwardemail.net",
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    }
});

const MailGenerator = new Mailgen({
    theme: "default",
    product: {
        name: "Mailgen",
        link: 'https://mailgen.js/'
    }
});

async function registerMail(req, res) {
    try {
        const { username, userEmail, text, subject } = req.body;

        // Email body configuration
        const email = {
            body: {
                name: username,
                intro: text || 'Welcome to Daily Tuition! We\'re very excited to have you on board.',
                outro: 'Need help, or have questions? Just reply to this email, we\'d love to help.'
            }
        };

        // Generate email content
        const emailBody = MailGenerator.generate(email);

        const message = {
            from: process.env.EMAIL,
            to: userEmail,
            subject: subject || "Signup Successful",
            html: emailBody
        };

        // Send mail
        await transporter.sendMail(message);

        return res.status(200).send({ msg: "You should receive an email from us." });
    } catch (error) {
        console.error('Error sending email:', error);
        return res.status(500).send({ error });
    }
}

module.exports = registerMail;
