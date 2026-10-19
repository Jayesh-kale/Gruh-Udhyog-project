// This is used to implement the nodemailer package to send emails from the server.
//  It creates a transporter object using the Gmail service and authenticates it with 
//  the SMTP_USER and SMTP_PASS environment variables. 
//  The verifyMailTransporter function checks if the transporter is ready to send emails and logs the status. 
//  The module exports both the mailTransporter and verifyMailTransporter functions for use in other parts of the application.

const {
    mailTransporter,
} = require("../utils/mailTransporter");
const { sendSuccess, sendError } = require("../utils/sendResponse");

function escapeHtml(value = "") {
    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

exports.sendContactMessage = async (req, res) => {
    try {
        const {
            name,
            email,
            phone,
            subject,
            message,
        } = req.body;

        if (
            !name ||
            !email ||
            !message
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Name, email, and message are required.",
            });
        }

        const cleanName = String(name).trim();
        const cleanEmail = String(email).trim();
        const cleanPhone = String(phone || "").trim();
        const cleanSubject = String(
            subject || "New Contact Form Message"
        ).trim();
        const cleanMessage = String(message).trim();

        if (cleanName.length < 2) {
            return res.status(400).json({
                success: false,
                message: "Enter a valid name.",
            });
        }

        if (cleanMessage.length < 5) {
            return res.status(400).json({
                success: false,
                message:
                    "Message must contain at least 5 characters.",
            });
        }

        if (cleanMessage.length > 5000) {
            return res.status(400).json({
                success: false,
                message:
                    "Message cannot exceed 5000 characters.",
            });
        }

        const emailPattern =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(cleanEmail)) {
            return res.status(400).json({
                success: false,
                message: "Enter a valid email address.",
            });
        }

        const emailHtml = `
            <div style="font-family: Arial, sans-serif; line-height: 1.6;">
                <h2>New Contact Form Message</h2>

                <p>
                    <strong>Name:</strong>
                    ${escapeHtml(cleanName)}
                </p>

                <p>
                    <strong>Email:</strong>
                    ${escapeHtml(cleanEmail)}
                </p>

                <p>
                    <strong>Phone:</strong>
                    ${escapeHtml(cleanPhone || "Not provided")}
                </p>

                <p>
                    <strong>Subject:</strong>
                    ${escapeHtml(cleanSubject)}
                </p>

                <hr />

                <p>
                    <strong>Message:</strong>
                </p>

                <p>
                    ${escapeHtml(cleanMessage).replace(
            /\n/g,
            "<br />"
        )}
                </p>
            </div>
        `;

        await mailTransporter.sendMail({
            from: `"Gyruh Udyog Website" <${process.env.SMTP_USER}>`,
            to: process.env.BUSINESS_EMAIL,

            // Allows you to reply directly to the customer.
            replyTo: cleanEmail,

            subject: `Contact Form: ${cleanSubject}`,

            text: `
            New Contact Form Message

            Name: ${cleanName}
            Email: ${cleanEmail}
            Phone: ${cleanPhone || "Not provided"}
            Subject: ${cleanSubject}

            Message:
            ${cleanMessage}
            `,

            html: emailHtml,
        });
        return sendSuccess(res, 200, "Your message has been sent successfully.");
    } catch (error) {
        console.error(
            "Contact email error:",
            error
        );

        return sendError(res, 500, "Unable to send your message right now.");
    }
};