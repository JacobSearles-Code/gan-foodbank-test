import {Outlet} from "react-router-dom";
import PageHeader from "./PageHeader.jsx";

const Layout = () => {
    return (
        <div>
            <PageHeader/>

            <Outlet/>
        </div>
    )
}
export default Layout