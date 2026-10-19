const GRAPH_API_VERSION =
    process.env.WHATSAPP_GRAPH_API_VERSION || "v23.0";

function normalizePhone(phone) {
    const digits = String(phone || "").replace(/\D/g, "");

    if (digits.length === 10) {
        return `91${digits}`;
    }

    if (digits.length >= 11 && digits.length <= 15) {
        return digits;
    }

    throw new Error("Customer phone number is not a valid WhatsApp number.");
}

function getConfig() {
    const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
    const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
    const templateName = process.env.WHATSAPP_RECEIPT_TEMPLATE_NAME;

    if (!phoneNumberId || !accessToken || !templateName) {
        throw new Error(
            "WhatsApp is not configured. Set WHATSAPP_PHONE_NUMBER_ID, WHATSAPP_ACCESS_TOKEN, and WHATSAPP_RECEIPT_TEMPLATE_NAME."
        );
    }

    return { phoneNumberId, accessToken, templateName };
}

function isWhatsAppConfigured() {
    return Boolean(
        process.env.WHATSAPP_PHONE_NUMBER_ID &&
        process.env.WHATSAPP_ACCESS_TOKEN &&
        process.env.WHATSAPP_RECEIPT_TEMPLATE_NAME
    );
}

async function sendTemplateMessage(to, template, accessToken) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);
    let response;

    try {
        response = await fetch(
            `https://graph.facebook.com/${GRAPH_API_VERSION}/${template.phoneNumberId}/messages`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    messaging_product: "whatsapp",
                    recipient_type: "individual",
                    to,
                    type: "template",
                    template: {
                        name: template.name,
                        language: {
                            code:
                                process.env.WHATSAPP_RECEIPT_TEMPLATE_LANGUAGE ||
                                "en_US",
                        },
                        components: [
                            {
                                type: "body",
                                parameters: template.parameters.map((text) => ({
                                    type: "text",
                                    text: String(text),
                                })),
                            },
                        ],
                    },
                }),
                signal: controller.signal,
            }
        );
    } catch (error) {
        if (error.name === "AbortError") {
            throw new Error("WhatsApp API request timed out.");
        }

        throw error;
    } finally {
        clearTimeout(timeout);
    }

    const result = await response.json().catch(() => null);

    if (!response.ok) {
        throw new Error(
            result?.error?.message ||
            `WhatsApp API returned HTTP ${response.status}.`
        );
    }

    return result;
}

async function sendPaymentReceipt(order) {
    const config = getConfig();
    const customerPhone = normalizePhone(order.customer.phone);
    const parameters = [
        order.customer.name,
        order.orderNumber,
        `INR ${Number(order.totalAmount).toFixed(2)}`,
        order.razorpayPaymentId,
    ];

    const recipients = [
        customerPhone,
        process.env.WHATSAPP_BUSINESS_COPY_TO
            ? normalizePhone(process.env.WHATSAPP_BUSINESS_COPY_TO)
            : null,
    ].filter((phone, index, all) => phone && all.indexOf(phone) === index);

    for (const recipient of recipients) {
        await sendTemplateMessage(
            recipient,
            {
                phoneNumberId: config.phoneNumberId,
                name: config.templateName,
                parameters,
            },
            config.accessToken
        );
    }
}

module.exports = {
    isWhatsAppConfigured,
    sendPaymentReceipt,
};
