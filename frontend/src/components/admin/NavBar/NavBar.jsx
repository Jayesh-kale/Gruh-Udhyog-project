import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import "./NavBar.css";
import { logoutUser } from "../../../services/authService";
import { FaBell, FaBellSlash, FaBuysellads } from "react-icons/fa";

const NavBar = () => {

    const [showProfile, setShowProfile] = useState(false);

    const navigate = useNavigate();

    const handleSidebarToggle = () => {
        const currentState = localStorage.getItem('showSidebar');
        const newState = currentState === 'true' ? 'false' : 'true';
        localStorage.setItem('showSidebar', newState);
        window.dispatchEvent(new Event('storage')); // Trigger storage event to notify other components
    }

    const handleLogout = async () => {
        await logoutUser();
        navigate("/login");
    };

    return (
        <header className="admin-navbar">

            {/* Brand */}
            <div className="admin-navbar-brand">

                <button className="admin-menu-btn">
                    <i className="fa-solid fa-bars"></i>
                </button>

                <Link to="/admin/dashboard" className="admin-logo">

                    <span className="admin-logo-icon">
                        <i className="fa-solid fa-house"></i>
                    </span>

                    <div>
                        <span className="admin-logo-title">
                            GruhUdyog
                        </span>

                        <span className="admin-logo-subtitle">
                            CRM
                        </span>
                    </div>

                </Link>

            </div>

            {/* Right Section */}
            <div className="admin-navbar-actions flex items-center justify-end gap-4">

                {/* Notification */}
                <button className="admin-action-btn">

                    <i className="fa-regular fa-bell">🔔</i>

                    <span className="notification-dot"></span>

                </button>

                <button className="admin-action-btn" onClick={handleSidebarToggle}>
                    <button className="admin-action-btn">{localStorage.getItem('showSidebar') == 'true' ? "Hide SideBar" : "ShowSideBar" }</button>
                </button>

                {/* Profile */}
                <div className="admin-profile-wrapper">

                    <button
                        className="admin-profile"
                        onClick={() =>
                            setShowProfile(!showProfile)
                        }
                    >

                        <div className="admin-avatar">
                            A
                        </div>

                        <div className="admin-profile-info">

                            <span className="admin-profile-name">
                                Admin
                            </span>

                            <span className="admin-profile-role">
                                Administrator
                            </span>

                        </div>

                        <i className="fa-solid fa-chevron-down"></i>

                    </button>


                    {showProfile && (

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

                    )}

                </div>

            </div>

        </header>
    );
};

export default NavBar;