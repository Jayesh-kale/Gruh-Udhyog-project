import {
    FaShoppingBasket,
    FaClipboardCheck,
    FaUtensils,
    FaCheckCircle
} from "react-icons/fa";

import { Card } from "../../common";
import "./HowItWorks.css";


const steps = [
    {
        id: 1,
        icon: <FaShoppingBasket />,
        title: "Browse Products",
        description: "Explore our delicious homemade products."
    },
    {
        id: 2,
        icon: <FaClipboardCheck />,
        title: "Place Order",
        description: "Choose products and confirm your order."
    },
    {
        id: 3,
        icon: <FaUtensils />,
        title: "Fresh Preparation",
        description: "Every order is prepared fresh with care."
    },
    {
        id: 4,
        icon: <FaCheckCircle />,
        title: "Order Ready",
        description: "Collect your order or receive delivery."
    }
];

function HowItWorks() {

    return (

        <section className="how-it-works py-5">

            <div className="container">

                <div className="text-center mb-5">

                    <h2 className="fw-bold">

                        How It Works

                    </h2>

                    <p className="text-muted">

                        Get your favourite homemade products in four simple steps.

                    </p>

                </div>

                <div className="steps-container">

                    {

                        steps.map((step, index) => (

                            <>

                                <Card
                                    key={step.id}
                                    className="step-card text-center"
                                >

                                    <div className="step-number">

                                        {step.id}

                                    </div>

                                    <div className="step-icon">

                                        {step.icon}

                                    </div>

                                    <h5 className="fw-bold mt-3">

                                        {step.title}

                                    </h5>

                                    <p className="text-muted mb-0">

                                        {step.description}

                                    </p>

                                </Card>

                                {

                                    index !== steps.length - 1 && (

                                        <div className="step-arrow">

                                            <span className="line"></span>

                                            <span className="arrow">

                                                ▶

                                            </span>

                                        </div>

                                    )

                                }

                            </>

                        ))

                    }

                </div>

            </div>

        </section>

    );

}

export default HowItWorks;