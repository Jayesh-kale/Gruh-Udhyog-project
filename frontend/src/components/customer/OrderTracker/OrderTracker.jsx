import { useEffect } from "react";
import "./OrderTracker.css";


const steps = [

    "Pending",

    "Confirmed",

    "Preparing",

    "Ready",

    "Delivered"

];

function OrderTracker({ status }) {

    const currentStep = steps.indexOf(status);
    return (

        <div className="order-tracker">

            {

                steps.map((step, index) => (

                    <div key={step} className="tracker-item">

                        <div className={`tracker-circle ${index <= currentStep ? "active" : ""}`}>
                            {

                                index < currentStep ? "✓" : index === currentStep ? "●" : ""


                            }

                        </div>

                        <span>

                            {step}

                        </span>

                        {

                            index !== steps.length - 1 && (

                                <div className={`tracker-line ${index < currentStep ? "active" : ""}`} />

                            )

                        }

                    </div>

                ))

            }

        </div>

    );

}

export default OrderTracker;