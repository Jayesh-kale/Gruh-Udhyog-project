import {
    FaLeaf,
    FaAward,
    FaTruck,
    FaUsers
} from "react-icons/fa";

const features = [
    {
        id: 1,
        icon: <FaLeaf />,
        title: "Fresh Ingredients",
        description:
            "Every product is prepared using fresh, carefully selected ingredients to ensure authentic homemade taste."
    },
    {
        id: 2,
        icon: <FaAward />,
        title: "Premium Quality",
        description:
            "We maintain consistent quality standards in every batch with traditional preparation methods."
    },
    {
        id: 3,
        icon: <FaTruck />,
        title: "Quick Order Preparation",
        description:
            "Orders are prepared efficiently with real-time order tracking so you always know the status."
    },
    {
        id: 4,
        icon: <FaUsers />,
        title: "Trusted Family Business",
        description:
            "Serving customers with homemade products and trusted service for years."
    }
];

function WhyChooseUs() {

    return (

        <section className="py-5 bg-light">

            <div className="container">

                <div className="text-center mb-5">

                    <h2 className="fw-bold">
                        Why Choose GruhUdyog?
                    </h2>

                    <p className="text-muted">
                        Homemade goodness with quality, trust and tradition.
                    </p>

                </div>

                <div className="row g-4">

                    {

                        features.map((feature) => (

                            <div
                                key={feature.id}
                                className="col-md-6 col-lg-3"
                            >

                                <div className="card border-0 shadow-sm h-100 text-center p-4">

                                    <div
                                        className="mx-auto mb-3 rounded-circle bg-success bg-opacity-10 d-flex align-items-center justify-content-center"
                                        style={{
                                            width: "70px",
                                            height: "70px",
                                            fontSize: "30px",
                                            color: "#198754"
                                        }}
                                    >

                                        {feature.icon}

                                    </div>

                                    <h5 className="fw-bold">
                                        {feature.title}
                                    </h5>

                                    <p className="text-muted mb-0">
                                        {feature.description}
                                    </p>

                                </div>

                            </div>

                        ))

                    }

                </div>

            </div>

        </section>

    );

}

export default WhyChooseUs;