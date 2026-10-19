import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { categoryService } from "../../../services/productService";
import {
    FaCheese,
    FaCookieBite,
    FaBirthdayCake
} from "react-icons/fa";

import {
    GiNoodles,
    GiWheat,
    GiFruitBowl
} from "react-icons/gi";

import "./CategorySection.css";

const ICONS = {
    papad: <FaCheese />,
    shevya: <GiNoodles />,
    kurdai: <FaCookieBite />,
    bibde: <GiWheat />,
    cake: <FaBirthdayCake />,
    // custome category has been added to the ICONS object with a default icon
    default: <GiFruitBowl />

};

const COLORS = {
    papad: "#E8F5E9",
    shevya: "#FFF8E1",
    kurdai: "#E3F2FD",
    bibde: "#F3E5F5",
    cake: "#FCE4EC"
};

function CategorySection() {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        let mounted = true;

        const fetchCategory = async () => {
            try {
                const apiCategories = await categoryService();
              

                const formatted = (apiCategories || []).map((c, i) => {
                    const categoryName = c || "Unknown";
                    const key = categoryName.toLowerCase();

                    return {
                        id: i,
                        name: categoryName,
                        icon: ICONS[key] || <GiFruitBowl />,
                        color: COLORS[key] || "#F5F5F5"
                    };
                });

                if (mounted) setCategories(formatted);
            } catch (error) {
                if (mounted) console.error("Error fetching categories:", error);
            }
        };

        fetchCategory();

        return () => {
            mounted = false;
        };
    }, []);
    return (

        <section className="category-section">

            <div className="container">

                <div className="section-header">

                    <h2>

                        Shop By Category

                    </h2>

                    <p>

                        Browse our homemade products.

                    </p>

                </div>

                <div className="category-grid">

                    {

                        categories.map(c => (

                            <Link

                                key={c.id}

                                to={`/products?category=${c.name}`}

                                className="category-card"

                            >

                                <div

                                    className="category-icon"

                                    style={{

                                        background: c.color

                                    }}

                                >

                                    {c.icon}

                                </div>

                                <h4>

                                    {c.name}

                                </h4>

                            </Link>

                        ))

                    }

                </div>

            </div>

        </section>

    );

}

export default CategorySection;