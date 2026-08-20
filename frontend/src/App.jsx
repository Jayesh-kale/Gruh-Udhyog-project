import { useEffect } from "react";
import AppRoutes from "./routes/AppRoutes";
import AOS from "aos";
import Checkout from "./pages/customer/Checkout/Checkout";
import Dashboard from "./pages/admin/Dashboard/Dashboard";
import Orders from "./pages/admin/Orders/Orders";
import NavBar from "./components/admin/NavBar/NavBar";
import Sidebar from "./components/admin/Sidebar/Sidebar";

function App() {

    useEffect(() => {

        AOS.init({

            duration: 800,

            once: true

        });

    }, []);

    return (
        <>       
         <AppRoutes />
        </>

    );

}



export default App;