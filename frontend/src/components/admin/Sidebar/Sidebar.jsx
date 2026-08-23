import { Navigate, NavLink, useNavigate } from "react-router-dom";

import "./Sidebar.css"
import { FaCross } from "react-icons/fa";
import { useEffect, useState } from "react";
import { logoutUser } from "../../../services/authService";


function Sidebar() {

    const [show, setShow] = useState(localStorage.getItem('showSidebar'));

    const navigate = useNavigate();
    const handleLogout = async () => {
        await logoutUser();
        navigate("/login");
    };


    const menuItems = [

        {
            title: "Dashboard",
            path: "/admin/dashboard"
        },

        {
            title: "Products",
            path: "/admin/products"
        },

        {
            title: "Orders",
            path: "/admin/orders"
        },

        {
            title: "Create Orders",
            path: "/admin/create-order"
        },

        {
            title: "Production Queue",
            path: "/admin/production-queue"
        },

        {
            title: "Credit Book",
            path: "/admin/credit-book"
        },

        {
            title: "Reports",
            path: "/admin/reports"
        }

    ];

    useEffect(() => {
        const handleStorageChange = () => {
            const showSidebar = localStorage.getItem('showSidebar');
            console.log("showSidebar", showSidebar);
            setShow(showSidebar === 'true');
            console.log("show", show);
        };
        handleStorageChange();

        // 3. Listen for changes made in OTHER tabs/windows
        window.addEventListener('storage', handleStorageChange);

        // 4. Clean up the listener when the component unmounts
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, [show]); 


return (
    <div>
        {show && (
            <div className="bg-dark text-white p-4"
                style={{
                    width: "200px",
                    minHeight: "100vh"
                }}>
                <h3 className="mb-4 side-main"> GruhUdyog CRM</h3>
                <hr className="bar" />
                {
                    menuItems.map((item) => (

                        <NavLink key={item.path} to={item.path} className="d-block text-decoration-none text-white mb-3">
                            {item.title}
                        </NavLink>

                    ))
                }

                <hr className="bar" />
                <div className="d-flex justify-content-center">
                    <button className="btn btn-danger" onClick={() => 
                    {
                       handleLogout();
                    }}>
                        LogOut
                    </button>
                </div>
            </div>
        )}
    </div>
);
}

export default Sidebar;