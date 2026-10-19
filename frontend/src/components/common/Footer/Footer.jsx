import "./Footer.css";

import { Link, Links } from "react-router-dom";
import {
    FaFacebookF,
    FaInstagram,
    FaWhatsapp,
    FaPhoneAlt,
    FaEnvelope,
    FaMapMarkerAlt,
    FaMapMarker,
    FaMapPin,
    FaMapSigns
} from "react-icons/fa";

function Footer() {

    const currentYear = new Date().getFullYear();

    return (

        <footer className="footer">

            <div className="container">

                <div className="row gy-5">

                    {/* Brand */}

                    <div className="col-lg-4">

                        <h3 className="footer-logo">

                          <span><img src="https://res.cloudinary.com/drky4ztad/image/upload/v1792432703/JAY_Gruh_Udhyog_Heritage_Logo.png" alt="" style={{ width: '70px', height: '70px' ,backgroundColor: 'lightgray' ,borderRadius: '20%' }} />Jay GruhUdyog</span> 

                        </h3>

                        <p className="footer-description">

                            Bringing traditional homemade products to your family
                            with freshness, quality and authentic taste.

                        </p>

                        <div className="footer-social">

                              <Link to="" className="facebook-icon" >
                                <FaFacebookF />
                              </Link>

                              <Link to="" className="instagram-icon" >
                                <FaInstagram />
                              </Link>

                              <Link to="https://wa.me/919552232344" className="whatsapp-icon" >
                                <FaWhatsapp />
                              </Link>

                        </div>

                    </div>

                    {/* Quick Links */}

                    <div className="col-lg-2 col-md-4">

                        <h5>Quick Links</h5>

                        <ul>

                            <li><Link to="/">Home</Link></li>

                            <li><Link to="/products">Products</Link></li>

                            <li><Link to="/login">Login</Link></li>

                            <li><Link to="/register">Register</Link></li>

                        </ul>

                    </div>

                    {/* Categories */}

                    <div className="col-lg-3 col-md-4">

                        <h5>Categories</h5>

                        <ul>

                            {/* <li><Link className="nav-link" to="/categories/papad">Papad</Link></li>

                            <li><Link className="nav-link" to="/categories/shevya">Shevya</Link></li>

                            <li><Link className="nav-link"  to="/categories/kurdai">Kurdai</Link></li>

                            <li><Link className="nav-link" to="/categories/cakes">Cakes</Link></li>

                            <li><Link className="nav-link" to="/products">Many More</Link></li> */}

                            <li><Link className="nav-link" to="/products">Papad</Link></li>

                            <li><Link className="nav-link" to="/products">Shevya</Link></li>

                            <li><Link className="nav-link"  to="/products">Kurdai</Link></li>

                            <li><Link className="nav-link" to="/products">Cakes</Link></li>

                            <li><Link className="nav-link" to="/products">Many More</Link></li>

                        </ul>

                    </div>

                    {/* Contact */}

                    <div className="col-lg-3 col-md-4">

                        <h5>Contact</h5>

                        <ul className="contact-list">

                            <li>

                                <FaPhoneAlt />

                                <span>+91 9552232344</span>

                            </li>

                            <li>

                                <FaEnvelope />

                                <span ><Link to="mailto:jayeshkale7972@gmail.com">jayeshkale7972@gmail.com</Link></span>

                            </li>
                            <li>
                                <FaMapMarkerAlt />
                                <span>Pathardi, Maharashtra, India</span>
                            </li>
                            {/* <li>< Link to="https://goo.gl/maps/CxHFspm3STouBAoLA" target="_blank">
                                <FaMapMarkerAlt />
                                <span>Check our location</span>
                            </Link>
                            </li> */}

                            <iframe src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3724.291657228266!2d76.93870307525644!3d21.021012980626367!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMjHCsDAxJzE1LjciTiA3NsKwNTYnMjguNiJF!5e0!3m2!1sen!2sin!4v1784983242436!5m2!1sen!2sin" width="300" height="200"></iframe>

                        </ul>

                    </div>

                </div>

                <hr />

                <div className="footer-bottom">

                    <p>

                        © {currentYear} GruhUdyog. All Rights Reserved.

                    </p>

                    <div className="footer-legal-links">

                        <Link to="/privacy-policy">

                            Privacy Policy

                        </Link>

                        <Link to="/terms-and-conditions">

                            Terms & Conditions

                        </Link>

                    </div>

                </div>

            </div>

        </footer>

    );

}

export default Footer;