import { NavLink, Link } from "react-router-dom";
import {
    FiShoppingCart,
    FiUser,
    FiMenu,
    FiX,
    
} from "react-icons/fi";

import { useState } from "react";
import { useAuth } from "../../../services/context/authContext.jsx";

import "./Navbar.css";

function Navbar() {

    const [mobileMenu, setMobileMenu] = useState(false);

    const { user } = useAuth();

    return (

        <header className="navbar">

            <div className="navbar-container">

                {/* Logo */}

                <Link
                    to="/"
                    className="logo"
                >
                    Kale's Store
                </Link>

                {/* Desktop Menu */}

                <nav className={`nav-links ${mobileMenu ? "active" : ""}`}>

                    <NavLink to="/">
                        Home
                    </NavLink>

                    <NavLink to="/products">
                        Products
                    </NavLink>

                    <NavLink to="/orders">
                        Orders
                    </NavLink>

                    <NavLink to="/profile">
                        Profile
                    </NavLink>

                </nav>

                {/* Right */}

                <div className="navbar-right">

                    <NavLink
                        to="/cart"
                        className="icon-btn"
                    >
                        <FiShoppingCart size={22}/>
                    </NavLink>

                    <NavLink
                        to="/profile"
                        className="profile-btn"
                    >

                        <FiUser/>

                        <span>

                            {user?.name || "Profile"}

                        </span>

                    </NavLink>

                    <button

                        className="menu-btn"

                        onClick={() =>
                            setMobileMenu(!mobileMenu)
                        }

                    >

                        {

                            mobileMenu ?

                                <FiX size={24}/>

                                :

                                <FiMenu size={24}/>

                        }

                    </button>

                </div>

            </div>

        </header>

    );

}

export default Navbar;