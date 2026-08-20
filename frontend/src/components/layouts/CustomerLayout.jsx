import { Outlet } from "react-router-dom";

import Navbar from "../common/Navbar/NavBar";
import Footer from "../common/Footer/Footer";

function CustomerLayout() {

    return (

        <>

            <Navbar />

            <main
                className="container my-4"
            >

                <Outlet />

            </main>

            <Footer />

        </>

    );

}

export default CustomerLayout;