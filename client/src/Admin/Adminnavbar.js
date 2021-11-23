import React, {  useContext } from 'react'
import { NavLink } from "react-router-dom";
import { adminContext } from "./AdminRoute";
function Adminnavbar() {
    const { admindata } = useContext(adminContext);
    return (
        <>
            <div className="leftbar">
                <input type="checkbox" id="ch" className="d-none" />
                <div className="navs">
                    <li><NavLink to="/admin">Manage Home</NavLink></li>
                    <li><NavLink to="/adminmanageusers">Manage Users</NavLink></li>
                    <li><NavLink to="/reportmanager">Manage Reports</NavLink></li>
                    <li><NavLink to="/messagemanager">Messages</NavLink></li>
                    <li className="p-0">
                        <div className="dropdown show m-2">
                            <a className="btn btn-outline-info btn-sm mr-auto dropdown-toggle" href="#" role="button"
                                id="dropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                {admindata.adminname}
                            </a>
                            <div className="dropdown-menu" aria-labelledby="dropdownMenuLink">
                                <NavLink className="dropdown-item" to="/adminlogout">Logout</NavLink>
                            </div>
                        </div>
                    </li>
                </div>
            </div>
        </>
    )
}

export default Adminnavbar
