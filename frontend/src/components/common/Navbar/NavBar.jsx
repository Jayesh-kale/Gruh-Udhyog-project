import { NavLink, Link } from "react-router-dom";
import {
    FiShoppingCart,
    FiUser,
    FiMenu,
    FiX,
    FiLogOut,
    
} from "react-icons/fi";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../services/context/authContext.jsx";
import LoginPromptDialog from "../LoginPromptDialog";

import "./Navbar.css";
import toast from "react-hot-toast";

function Navbar() {

    const [mobileMenu, setMobileMenu] = useState(false);
    const [showProfile, setShowProfile] = useState(false);
    const [showLoginPrompt, setShowLoginPrompt] = useState(false);

    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogOut = async () => {
        try {
            await logout();
            toast.success("Logged out successfully!");
        } catch {
            toast.error("Unable to log out. Please try again.");
        }
    };

    const handleCartClick = (event) => {
        if (!user) {
            event.preventDefault();
            setShowLoginPrompt(true);
        }
    };

    const handleProfileClick = (event) => {
        if (!user) {
            event.preventDefault();
            setShowLoginPrompt(true);
        }
    };

    const handleLoginConfirm = () => {
        setShowLoginPrompt(false);
        navigate("/login");
    };

    return (

        <header className="navbar">

            <div className="navbar-container">

                {/* Logo */}

                <Link
                    to="/"
                    className="logo blend"
                >
                    <img src="https://res.cloudinary.com/drky4ztad/image/upload/v1792432703/JAY_Gruh_Udhyog_Heritage_Logo.png" alt="Jay Gruh Udhyog" srcset=""/>
                    
                </Link>

                {/* Desktop Menu */}

                <nav className={`nav-links ${mobileMenu ? "active" : ""}`}>

                    <NavLink to="/">
                        Home
                    </NavLink>

                    <NavLink to="/products">
                        Products
                    </NavLink>

                    {user && (
                        <NavLink to="/orders">
                            Orders
                        </NavLink>
                    )}

                    {/* <NavLink to="/profile">
                        Profile
                    </NavLink> */}

                </nav>

                {/* Right */}

                <div className="navbar-right">

                    <NavLink to="/cart" className="icon-btn" onClick={handleCartClick}>
                        <FiShoppingCart size={22}/>
                    </NavLink>

                    {user ? (
                        <>
                            <NavLink
                                to="/profile"
                                className="profile-btn"
                                onClick={() => setShowProfile(!showProfile)}
                            >
                                <FiUser/>
                                <span>{user.name || "Profile"}</span>
                            </NavLink>

                            <button className="icon-btn" onClick={handleLogOut}>
                                <FiLogOut size={22}/>
                            </button>
                        </>
                    ) : (
                        <NavLink
                            to="/profile"
                            className="profile-btn"
                            onClick={handleProfileClick}
                        >
                            <FiUser/>
                            <span>Profile</span>
                        </NavLink>
                    )}

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

            <LoginPromptDialog
                open={showLoginPrompt}
                onConfirm={handleLoginConfirm}
                onCancel={() => setShowLoginPrompt(false)}
            />

        </header>

    );

}

export default Navbar;