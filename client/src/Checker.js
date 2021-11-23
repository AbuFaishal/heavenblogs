import React from 'react'
import App from './components/App'
import AdminRoute from './Admin/AdminRoute';
import { useLocation } from 'react-router'

function Checker() {
    const location = useLocation();
    // console.log(location.pathname);
    return (
        <>
            {location.pathname === "/admin" || location.pathname === "/adminlogin"
                || location.pathname === "/adminlogout" || location.pathname === "/adminshowpost"
                || location.pathname === "/adminmanageusers" || location.pathname === "/reportmanager"
                || location.pathname === "/messagemanager" ?
                <AdminRoute />
                :
                <App />
            }
        </>
    )
}

export default Checker
