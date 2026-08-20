import "./CallToAction.css";

import { Link } from "react-router-dom";
import { Button } from "../../common";

function CallToAction() {

    return (

        <section className="cta-section">

            <div className="container">

                <div className="cta-wrapper">

                    <div className="row align-items-center">

                        <div className="col-lg-8">

                            <span className="cta-badge">

                                Fresh • Homemade • Traditional

                            </span>

                            <h2 className="cta-title">

                                Ready to Enjoy Authentic Homemade Products?

                            </h2>

                            <p className="cta-description">

                                Experience the authentic taste of homemade papad, shevya, kurdai, bibde and many more traditional products made with premium ingredients and lots of care.

                            </p>

                        </div>

                        <div className="col-lg-4">

                            <div className="cta-buttons">

                                    <Button variant="secondary" to="/products">

                                        Browse Products

                                    </Button>

                                    <Link to="/contact">

                                    <Button
                                        variant="outline-light"
                                    >

                                        Contact Us

                                    </Button>

                                </Link>
                                    

                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </section>

    );

}

export default CallToAction;