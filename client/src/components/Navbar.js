import React, { useEffect, useState, useContext } from 'react'
import { NavLink } from 'react-router-dom'
// import axios from 'axios';
import { userContext } from "./App";


function Navbar() {
    const { user, userdata } = useContext(userContext);
    return (
        <>
            <nav className="navbar navbar-expand-lg navbar-light bg-light" style={{ height: "60px;" }}>
                <a className="navbar-brand"><span style={{ color: "orange" }}>H</span>eaven <span style={{ color: "orange" }}>B</span>logs</a>
                <button className="navbar-toggler" style={{ outline: "none" }} type="button" data-toggle="collapse" data-target="#navbarNav"
                    aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse bg-light" id="navbarNav" >
                    <ul className="navbar-nav p-2">
                        <li className="nav-item active">
                            <NavLink className="nav-link" to="/">Home</NavLink>
                        </li>
                        {/* <li className="nav-item active">
                            <NavLink className="nav-link" to="#">About</NavLink>
                        </li> */}
                        <li className="nav-item active">
                            <NavLink className="nav-link" to="/contact">Contact</NavLink>
                        </li>
                        {user ?
                            <li className="nav-item active dropdown">
                                <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    {userdata.username}
                                </a>
                                <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                                    <NavLink className="dropdown-item" to="/profile">profile</NavLink>
                                    <NavLink className="dropdown-item" to="/logout">Logout</NavLink>
                                </div>
                            </li> :
                            <li className="nav-item active">
                                <NavLink className="nav-link" to="/signup">SignUp</NavLink>
                            </li>
                        }
                    </ul>
                </div>
            </nav>
        </>
    )
}

export default Navbar
