import { Link } from "react-router-dom";
import { FiArrowRight, FiShoppingBag } from "react-icons/fi";

import { Button } from "../../common/index";

import "./Hero.css";

//Hero section just after the navbar on the home page
function Hero() {

    return (

        <section className="hero">

            <div className="hero-container">

                {/* Left Content */}

                <div
                    className="hero-content"
                    data-aos="fade-right"
                >

                    <span className="hero-tag">

                        🌿 100% Homemade Products

                    </span>

                    <h1>

                        Authentic Homemade

                        <span> Papad & Traditional Foods</span>

                    </h1>

                    <p>

                        Discover premium quality homemade Papad,
                        Shevya, Kurdai, Bibde and seasonal products
                        prepared with traditional recipes and fresh
                        ingredients.

                    </p>

                    <div className="hero-buttons">

                        <Button to="/products" className="hero-btn-link">
                                Shop Now
                                
                                <FiShoppingBag />
                        </Button>

                        <Button
                            variant="outline"
                        >

                            <Link
                                to="/products"
                                className="hero-btn-link"
                            >

                                Explore

                                <FiArrowRight />

                            </Link>

                        </Button>

                    </div>

                </div>

                {/* Right Image */}

                <div
                    className="hero-image"
                    data-aos="fade-left"
                >

                    <img
                        className="hero-img"
                        style={{
                            borderRadius:"40vw",
                            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1), 0 6px 20px rgba(0, 0, 0, 0.1)"

                        }}
                        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT_pRAHikELOQ4NRP7YNuagbynOygnAHPFsPmMhBM1ZxQ&s=10"

                        alt="Homemade Papad"

                    />

                </div>

            </div>

        </section>

    );

}

export default Hero;