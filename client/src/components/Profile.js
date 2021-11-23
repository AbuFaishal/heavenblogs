import React, { useState, useEffect, useContext } from 'react'
import axios from "axios"
import icon from './images/edit.png'
import { userContext } from "./App";
import { useHistory } from 'react-router';
import { NavLink } from "react-router-dom";

function Profile() {
    const history = useHistory();
    const { userdata, setuserdata } = useContext(userContext);
    // const [data, setdata] = useState({});
    const [edit, setedit] = useState(0);
    const [editimg, seteditimg] = useState(0);
    const [postcount, setpostcount] = useState(0);
    const [profilepic, setprofilepic] = useState("https://st.depositphotos.com/2101611/3925/v/600/depositphotos_39258143-stock-illustration-businessman-avatar-profile-picture.jpg");
    const [newpropic, setnewprofpic] = useState({});
    const [detail, updetail] = useState({
        username: "",
        gender: "",
        email: ""
    })
    const val = edit === 0 ? true : false;
    const handlechange = (event) => {
        updetail({ ...detail, [event.target.name]: event.target.value });
    }

    const getDetail = async () => {
        try {
            const response = await axios.get(`http://localhost:8000/getuser/${userdata.id}`);
            updetail({
                username: response.data.username,
                gender: response.data.gender,
                email: response.data.email
            });

            if (response.data.profilepic !== "") {
                setprofilepic(response.data.profilepic);
            }
            const response2 = await axios.get(`http://localhost:8000/userpostscount/${userdata.id}`);
            setpostcount(response2.data);
        } catch (error) {
            console.log(error);
            history.push("/error");
        }
    }
    const updateDetail = async () => {
        try {
            const response = await axios.post(`http://localhost:8000/updateuser/${userdata.id}`, detail);
            if (response.data === "updated") {
                setuserdata({ ...userdata, username: detail.username })//updating navbar name
                setedit(0);
                getDetail();
            }
        } catch (error) {
            console.log(error);
            // history.goBack();
        }
    }
    const handlephoto = (e) => {
        setnewprofpic(e.target.files[0]);
        seteditimg(1);
    }
    const updatePhoto = async () => {
        try {
            document.getElementById("updatenow").disabled=true;
            const imageformat = ["image/jpg", "image/jpeg", "image/png"];
            if (imageformat.indexOf(newpropic.type) === -1) {
                alert('please select proper image file');
                document.getElementById("updatenow").disabled=false;
                seteditimg(0);
            } else {
                const formdata = new FormData();
                formdata.append('photo', newpropic);
                await axios.patch(`http://localhost:8000/updateprofileimage/${userdata.id}`, formdata);
                document.getElementById("updatenow").disabled=true;
                seteditimg(0);
                getDetail();
            }
        } catch (error) {
            console.log(error);
            // history.goBack();
        }
    }
    useEffect(() => {
        getDetail();
    }, [])
    return (
        <>
            <div className="container mt-5">
                <div className="row">
                    <div className="col-md-4" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                        <div className="profimg">
                            <img src={profilepic} />
                            <div className="upicon">
                                {editimg === 0 ?
                                    <img src={icon} alt="Edit" title="Edit or upload profile Image" onClick={() => { document.getElementById('photo').click() }} />
                                    : null}
                                <input type="file" name="photo" id="photo" className="d-none" onChange={handlephoto} />
                                {editimg === 1 ?
                                    <button id="updatenow" onClick={updatePhoto} className="btn btn-success btn-sm">Update photo</button>
                                    : null}
                            </div>
                        </div>
                    </div>
                    <div className="col-md-8 ">
                        <div className="profdetail p-3 mt-2">
                            <h5>Details-</h5>
                            <input type="text" className={edit === 1 ? "editmode" : ""} name="username" value={detail.username} onChange={handlechange} readOnly={val} />
                            {!val ?
                                <div className="gender">
                                    <label className={edit === 1 ? "editmode mx-2" : "mx-2"} htmlFor="">Male: </label><input type="radio" onChange={handlechange} name="gender" value="male" />
                                    <label className={edit === 1 ? "editmode mx-2" : "mx-2"} htmlFor="">Female: </label><input type="radio" onChange={handlechange} name="gender" value="female" />
                                </div> :
                                <input type="text" name="" value={detail.gender} readOnly={val} />
                            }
                            <input type="text" className={edit === 1 ? "editmode" : ""} name="email" value={detail.email} onChange={handlechange} readOnly={val} />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col p-3">
                            <h5 className="text-muted">Total Blogs Posted: {postcount}</h5>
                            <NavLink className="btn btn-outline-info btn-sm" to={`/authorpost/${userdata.id}/My`} >Show my Blogs</NavLink>
                            {!val ?
                                <button className="btn btn-warning btn-sm ml-2" onClick={updateDetail}>Update</button>
                                : <button onClick={() => setedit(1)} className="btn btn-danger btn-sm ml-2">Edit Details</button>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Profile
