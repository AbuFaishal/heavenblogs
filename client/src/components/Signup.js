import React, { useState, useRef, useEffect, useContext } from 'react'
import axios from "axios";
import { NavLink, useHistory } from "react-router-dom";
import { userContext } from "./App";

function Signup() {
    const { user } = useContext(userContext);
    const history = useHistory();
    // const ref = useRef();
    const [malert, msetalert] = useState("");
    const [data, setdata] = useState({
        username: "",
        password: "",
        gender: "",
        email: "",
        // photo: ""
    });
    const handleChange = (e) => {
        setdata({ ...data, [e.target.name]: e.target.value });
    }
    //eye button toggling
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
    //to uncheck gender value
    const uncheck = () => {
        var radio = document.querySelector('input[type=radio][name=gender]:checked');
        radio.checked = false;
    }
    const submitData = async (e) => {
        e.preventDefault();
        //distructuring values
        const { username, password, email, gender } = data;
        //DOM manupulation
        if (username === "" || password === "" || email === "" || gender === "") {
            alert("please enter all fields");
        }
        else {
            try {
                const response = await axios.get(`http://localhost:8000/checkRegistered?name=${username}&email=${email}`);
                //console.log(response.data);
                if (response.data === 0) {//means no existing data matched
                    const res = await axios.post("http://localhost:8000/register",{username, password, email, gender});
                    if (res.data === "Registered") {
                        setdata({
                            username: "",
                            password: "",
                            email: ""
                        });
                        uncheck();
                        msetalert("");
                        history.push("/login");
                    } else {
                        msetalert(res.data.message);
                    }
                } else {
                    msetalert(response.data);
                    //alert(response.data);
                }
            } catch (err) {
                msetalert("Server not responding try after some time!");
                console.log(err);
            }
        }
    }
    useEffect(() => {
        if (user)
            history.push("/");
    })
    return (
        <>
            <div className="row">
                <div className="col py-3">
                    <div className="form border mx-auto">
                        <p className="h2 text-capitalize text-muted mb-3">registration form</p>
                        {malert !== "" ?
                            <div className="alert alert-warning p-2" role="alert">
                                <small>{malert}</small>
                            </div>
                            : null}
                        <form id="form" method="post" encType="multipart/form-data">
                            <div className="container">
                                <div className="row gy-3">
                                    <div className="col-md-6">
                                        <label >User Name</label>
                                        <div className="form-group">
                                            <input type="text" name="username" value={data.username} onChange={handleChange} className="form-control" />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <label >Password</label>
                                        <div className="form-hroup" style={{ position: "relative" }}>
                                            <label htmlFor="in" id="hide" onClick={hidecheck}><i className="fa fa-eye"
                                                id="eye"></i></label>
                                            <input type="checkbox" name="check" id="in" hidden />
                                            <input type="password" value={data.password} name="password" onChange={handleChange} className="form-control" id="password" />
                                        </div>
                                    </div>
                                    <div className="col-md-6 mb-2">
                                        <label>Gender</label>
                                        <div className="row py-2">
                                            <div className="col-sm-5 col-6">
                                                <div className="form-check">
                                                    <label className="form-check-label">Male</label>
                                                    <input type="radio" name="gender" value="male" onChange={handleChange} id="" className="form-check-input ml-2 mt-2" />
                                                </div>
                                            </div>
                                            <div className="col-sm-5 col-6">
                                                <div className="form-check">
                                                    <label className="form-check-label">Female</label>
                                                    <input type="radio" name="gender" value="female" onChange={handleChange} id="" className="form-check-input  ml-2 mt-2" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <label>Email</label>
                                        <div className="form-group">
                                            <input type="email" name="email" value={data.email} onChange={handleChange} className="form-control" id="mail" />
                                        </div>
                                    </div>
                                </div>
                                <small style={{ color: "teal" }}>Already have an account ? <NavLink to="/login">Login</NavLink></small><br />
                                <input type="submit" onClick={submitData} value="Submit" className="btn btn-info px-5 mt-3" />
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Signup;
