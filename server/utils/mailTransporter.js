// This utility for handling the mail service
const nodemailer = require("nodemailer");

const mailTransporter = nodemailer.createTransport({
    service: "gmail",

    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

async function verifyMailTransporter() {
    try {
        await mailTransporter.verify();
        console.log("Email transporter is ready.");
    } catch (error) {
        console.error(
            "Email transporter error:",
            error.message
        );
    }
}

module.exports = {
    mailTransporter,
    verifyMailTransporter,
};