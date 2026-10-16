import { NavLink, Link } from "react-router-dom";
import {
    FiShoppingCart,
    FiUser,
    FiMenu,
    FiX,
    FiLogOut,
    
} from "react-icons/fi";

import { useState } from "react";
import { useAuth } from "../../../services/context/authContext.jsx";
import { logoutUser} from "../../../services/authService.js";

import "./Navbar.css";
import toast from "react-hot-toast";

function Navbar() {

    const [mobileMenu, setMobileMenu] = useState(false);
    const [showProfile, setShowProfile] = useState(false);

    const { user } = useAuth();

    const handleLogOut = () => {
        const logOut = logoutUser();
        if(logOut){
            toast.success("Logged out successfully!");
            setTimeout(() => {
            window.location.href = "/login";
        }, 1000);
        }
    }

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

                    {/* <NavLink to="/profile">
                        Profile
                    </NavLink> */}

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
                        onClick={() =>
                            setShowProfile(!showProfile)
                        }
                    >

                        <FiUser/>

                        <span>

                            {user?.name || "Profile"}

                        </span>

                    </NavLink>

                    <button
                        
                        className="icon-btn"
                        onClick={() => handleLogOut()}
                    >
                        <FiLogOut size={22}/>
                        
                    </button>

                    {/* To Display The Pop Dialog To Show Profile Option */}

                    {/* {showProfile && (

                        <div className="admin-profile-menu">

                            <Link to="/admin/profile">
                                <i className="fa-regular fa-user"></i>
                                Profile
                            </Link>

                            <Link to="/admin/settings">
                                <i className="fa-solid fa-gear"></i>
                                Settings
                            </Link>

                            <div className="profile-menu-divider"></div>

                            <button onClick={handleLogout}>
                                <i className="fa-solid fa-arrow-right-from-bracket"></i>
                                Logout
                            </button>

                        </div>

                    )} */}

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