import { Outlet } from "react-router-dom";

import Sidebar from "../admin/Sidebar/Sidebar";
import NavBar from "../admin/NavBar/NavBar";

function AdminLayout() {

    return (
        <div className="d-flex">
            <div> 
                 <Sidebar />
            </div>
            <div className="flex-grow-1">
                <div>
                <NavBar />
                </div>
                <div className="p-4 scrollable-content" style={{ height: "calc(100vh - 80px)", overflowY: "auto" }}>
                    <Outlet />
                </div>
            </div>
        </div>
    );
}

export default AdminLayout;