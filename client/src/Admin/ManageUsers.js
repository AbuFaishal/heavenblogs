import axios from 'axios';
import React, { useState, useEffect,useContext } from 'react'
import { useHistory } from 'react-router';
import { adminContext } from "./AdminRoute";

function ManageUsers() {
    const { admin } = useContext(adminContext);
    const history = useHistory();
    const [data, setdata] = useState([]);
    const [post, setpost] = useState([]);
    const [aalert, setaalert] = useState("");
    const [reports, setreports] = useState([]);
    const [username, setusername] = useState("");
    const loadUserdata = async () => {
        try {
            const res = await axios.get("http://localhost:8000/getallusers");
            setdata(res.data);
            const res2 = await axios.get("http://localhost:8000/getallreports");
            setreports(res2.data);
        } catch (error) {
            console.log(error);
            alert("server not responding!");
        }
    }
    const deleteUser = async (id) => {
        if (window.confirm("If you delete user then posts related to user will also get deleted")) {
            try {
                const res = await axios.delete(`http://localhost:8000/deleteuser/${id}`);
                if (res.data === "deleted") {
                    loadUserdata();
                } else {
                    alert("failed to delete!");
                }

            } catch (error) {
                console.log(error);
                alert("server not responding!");
            }
        }
    }
    const showUserPosts = async (id) => {
        try {
            const res = await axios.get(`http://localhost:8000/getpostbyauthor/${id}`);
            if (res.data !== "no") {
                setpost(res.data);
            }
            else {
                setpost([]);
                setaalert("* no post found");
            }
        } catch (error) {
            console.log(error);
            alert("server not responding!");
        }
    }
    //method to convert am/pm time from database
    const formatAMPM = (date) => {
        let hours = date.getHours();
        let minutes = date.getMinutes();
        let ampm = hours >= 12 ? 'pm' : 'am';
        hours = hours % 12;
        hours = hours ? hours : 12;
        minutes = minutes.toString().padStart(2, '0');
        let strTime = hours + ':' + minutes + ' ' + ampm;
        return strTime;
    }
    const getReportCount = (postId) => {
        let count = 0;
        for (let i = 0; i < reports.length; i++) {
            if (reports[i].postId === postId)
                count++;
        }
        return count;
    }
    const blockPost = async (postid, userId) => {
        try {
            const res = await axios.get(`http://localhost:8000/blockpost/${postid}`);
            if (res.data === "blocked") {
                showUserPosts(userId);//loading post again after block/unblock operation
            }
        } catch (error) {
            alert("server not responding!");
            console.log(error);
        }
    }
    const deletePost = async (postid, userId) => {
        try {
            const res = await axios.delete(`http://localhost:8000/deletepost/${postid}`);
            if (res.data === "deleted")
                showUserPosts(userId);//loading post again after delete operation
            else
                alert("failed to delete");
        } catch (error) {
            alert("server not responding!");
            console.log(error);
        }
    }
    useEffect(() => {
        if(!admin)
            history.push("/adminlogin");

        loadUserdata();
    }, [])
    return (
        <>
            <div className="rightbar">
                <h4 className="text-muted my-3">Registered Users -</h4>
                <div className="users_table border">
                    <div className="table-responsive">
                        <table className="table text-center table-sm table-bordered table-hover">
                            <thead className="thead-dark">
                                <tr>
                                    <th>S.no</th>
                                    <th>Profile</th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Gender</th>
                                    <th>View Blogs</th>
                                    <th>Remove user</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.map((val, index) => {
                                    let image = val.profilepic;
                                    if (val.profilepic === "")
                                        image = "https://st.depositphotos.com/2101611/3925/v/600/depositphotos_39258143-stock-illustration-businessman-avatar-profile-picture.jpg";
                                    return (
                                        <>
                                            <tr>
                                                <td>{index + 1}</td>
                                                <td><img src={image} alt="image" width="40px" height="30px" /></td>
                                                <td>{val.username}</td>
                                                <td>{val.email}</td>
                                                <td>{val.gender}</td>
                                                <td><button className="btn btn-success btn-sm" onClick={() => { showUserPosts(val._id); setusername(val.username) }}>View</button></td>
                                                <td><i className="fas fa-trash text-danger" style={{ cursor: "pointer" }} onClick={() => { deleteUser(val._id) }}></i></td>
                                            </tr>
                                        </>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
                {post.length !== 0 ? <>
                    <h4 className="text-muted my-3">Control {username} posts -</h4>
                    <small className="text-danger">Note: If row appear's coloured means it is blocked</small>
                    <div className="show_user_blogs border">
                        <div className="table-responsive">
                            <table className="table text-center table-sm table-bordered table-hover">
                                <thead className="thead-dark">
                                    <tr>
                                        <th>S.no</th>
                                        <th>Title</th>
                                        <th>Category</th>
                                        <th>Date</th>
                                        <th>Time</th>
                                        <th>view</th>
                                        <th>Reports</th>
                                        <th>Block</th>
                                        <th>Delete</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {post.map((val, index) => {
                                        return (
                                            <>
                                                <tr style={val.disable ? { background: "rgb(214, 175, 101)" } : { background: "none" }}>
                                                    <td>{index + 1}</td>
                                                    <td>{val.title.length > 40 ? val.title.substring(0, 40) + "..." : val.title}</td>
                                                    <td>{val.category}</td>
                                                    <td>{new Date(val.date).toDateString()}</td>
                                                    <td>{formatAMPM(new Date(val.date))}</td>
                                                    <td><button className="btn btn-success btn-sm" onClick={() => { history.push('/adminshowpost', { postdata: val }); }}>View</button></td>
                                                    <td style={getReportCount(val._id) > 0 ? { color: "red" } : { color: "green" }}><b>{getReportCount(val._id)}</b></td>
                                                    <td>
                                                        <button className={`btn btn-sm ${val.disable ? 'btn-success' : 'btn-danger'}`} onClick={() => { blockPost(val._id, val.userId) }}>{val.disable ? "Unblock" : "Block"}</button>
                                                    </td>
                                                    <td><i className="fas fa-trash text-danger" style={{ cursor: "pointer" }} title="Delete this post" onClick={() => deletePost(val._id, val.userId)}></i></td>
                                                </tr>
                                            </>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </> : <h4 className="text-danger my-3">{aalert}</h4>}
            </div>
        </>
    )
}

export default ManageUsers
