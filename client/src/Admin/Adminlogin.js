import axios from 'axios';
import React, { useState, useContext, useEffect } from 'react'
import { NavLink, useHistory } from "react-router-dom";
import { adminContext } from "./AdminRoute";
function Adminlogin() {
    const { admin, setadmin } = useContext(adminContext);
    const history = useHistory();
    function hidecheck() {//on clicking the eye button inside label we call this function
        let checkbox = document.getElementById('in');
        let eye = document.getElementById('eye');
        if (checkbox.checked) {//checking if checkbox is checked
            eye.classList.remove('fa-eye');//removing class
            eye.classList.add('fa-eye-slash');//adding class
            document.getElementById('password').setAttribute('type', 'text');//setting attribute
        }
        else {
            eye.classList.remove('fa-eye-slash');
            eye.classList.add('fa-eye');
            document.getElementById('password').setAttribute('type', 'password');
        }
    }
    const [data, setdata] = useState({
        username: "",
        password: ""
    });
    const [malert, msetalert] = useState("");
    const handleChange = (e) => {
        setdata({ ...data, [e.target.name]: e.target.value });
    }
    const submitData = async (e) => {
        e.preventDefault();
        if (data.username === "" || data.password === "") {
            msetalert("Please fill all the fields!");
        } else {
            try {
                const response = await axios.post("http://localhost:8000/adminlogin", {
                    username: data.username,
                    password: data.password
                }, { withCredentials: true }
                );

                if (response.data === "verified") {
                    // console.log(isChecked());
                    //push from here in future
                    setadmin(true);
                    history.push("/admin");
                    // history.goBack();//it push to the last visited location
                }
                msetalert(response.data);
            } catch (err) {
                console.log(err);
                msetalert("Server not responded please try after some time!");
            }
        }
    }
    useEffect(() => {
        if (admin)
            history.push("/admin");
    })
    return (
        <>
            <div className="container">
                <div className="row">
                    <div className="col py-5">
                        <div className="form border mx-auto">
                            <p className="h2 text-capitalize text-muted mb-3">login form</p>
                            {malert !== "" ?
                                <div className="alert alert-warning p-2" role="alert">
                                    <small>{malert}</small>
                                </div>
                                : null}
                            <form method="post" id="form">
                                <div className="container">
                                    <div className="row gy-3">
                                        <div className="col-md-6">
                                            <label>User Name</label>
                                            <div className="form-group">
                                                <input type="text" onChange={handleChange} name="username" className="form-control" id="fname" />
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <label>Password</label>
                                            <div className="form-hroup" style={{ position: "relative" }}>
                                                <label htmlFor="in" id="hide" onClick={hidecheck}><i className="fa fa-eye text-danger"
                                                    id="eye"></i></label>
                                                <input type="checkbox" id="in" hidden />
                                                <input type="password" onChange={handleChange} name="password" className="form-control" id="password" />
                                            </div>
                                        </div>
                                    </div>
                                    <input type="submit" onClick={submitData} value="Login" className="btn btn-success px-5 mt-3" />
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Adminlogin
