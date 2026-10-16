export function loadRazorpayScript() {
    return new Promise((resolve) => {
        const scriptUrl =
            "https://checkout.razorpay.com/v1/checkout.js";

        const existingScript = document.querySelector(
            `script[src="${scriptUrl}"]`
        );

        if (existingScript) {
            resolve(true);
            return;
        }

        const script = document.createElement("script");
        script.src = scriptUrl;
        script.async = true;

        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);

        document.body.appendChild(script);
    });
}