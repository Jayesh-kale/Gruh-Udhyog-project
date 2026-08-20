import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { BrowserRouter } from "react-router-dom";

import { Toaster } from "react-hot-toast";

import App from "./App";
import { AuthProvider } from "./services/context/authContext.jsx";
import { CartProvider } from "./services/context/CartContext";

// Bootstrap
import "bootstrap/dist/css/bootstrap.min.css";

// Styles
import "./assets/styles/variables.css";
import "./assets/styles/global.css";
import "./assets/styles/utilities.css";
import "./assets/styles/components.css";

// AOS
import "aos/dist/aos.css";

createRoot(document.getElementById("root")).render(

    <StrictMode>

        <BrowserRouter>

            <AuthProvider>
                <CartProvider>
                    <App />

                    <Toaster
                        position="top-right"
                        reverseOrder={false}
                        gutter={10}
                        toastOptions={{
                            duration: 3000,
                            style: {
                                borderRadius: "12px",
                                background: "#ffffff",
                                color: "#333333"
                            }
                        }}
                    />

                </CartProvider>
            </AuthProvider>

        </BrowserRouter>

    </StrictMode>

);