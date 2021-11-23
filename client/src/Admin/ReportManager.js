import axios from 'axios';
import React, { useState, useEffect, useContext } from 'react'
import { useHistory } from 'react-router';
import { adminContext } from "./AdminRoute";

function ReportManager() {
    const { admin } = useContext(adminContext);
    const history = useHistory();
    const [post, setpost] = useState([]);
    const [reports, setreports] = useState([]);
    const [filterR, setfilterR] = useState([]);
    const loadpost = async () => {
        try {
            const res = await axios.get("http://localhost:8000/getposts");
            setpost(res.data);
            const res2 = await axios.get("http://localhost:8000/getallreports");
            setreports(res2.data);
        } catch (error) {
            console.log(error);
            alert("server not responding!");
        }
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
                loadpost();
            }
        } catch (error) {
            alert("server not responding!");
            console.log(error);
        }
    }
    const deletePost = async (postid, userId) => {
        try {
            const res = await axios.delete(`http://localhost:8000/deletepost/${postid}`);
            if (res.data === "deleted") {
                loadpost();
            }
            else
                alert("failed to delete");
        } catch (error) {
            alert("server not responding!");
            console.log(error);
        }
    }
    const filterReports = (postId) => {
        const filtdata = reports.filter(val => val.postId === postId);
        setfilterR(filtdata);
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
    useEffect(() => {
        if (!admin)
            history.push("/adminlogin");

        loadpost();
    }, [])
    return (
        <>
            <div className="rightbar">
                <h4 className="text-muted my-3">Most Reported posts -</h4>
                <small className="text-danger">Note: If row appear's coloured means it is blocked</small>
                <div className="show_user_blogs border">
                    <div className="table-responsive">
                        <table className="table text-center table-sm table-bordered">
                            <thead className="thead-dark">
                                <tr>
                                    <th>S.no</th>
                                    <th>Title</th>
                                    <th>Category</th>
                                    <th>Date</th>
                                    <th>view post</th>
                                    <th>Total Reports</th>
                                    <th>view reports</th>
                                    <th>Block</th>
                                    <th>Delete</th>
                                </tr>
                            </thead>
                            <tbody>
                                {post.map((val, index) => {
                                    if (getReportCount(val._id) > 2)
                                        return (
                                            <>
                                                <tr style={val.disable ? { background: "rgb(214, 175, 101)" } : { background: "none" }}>
                                                    <td>{index + 1}</td>
                                                    <td>{val.title.length > 40 ? val.title.substring(0, 40) + "..." : val.title}</td>
                                                    <td>{val.category}</td>
                                                    <td>{new Date(val.date).toDateString()}</td>
                                                    <td><button className="btn btn-success btn-sm" onClick={() => { history.push('/adminshowpost', { postdata: val }); }}>Show</button></td>
                                                    <td style={getReportCount(val._id) > 0 ? { color: "red" } : { color: "green" }}><b>{getReportCount(val._id)}</b></td>
                                                    <td><button onClick={() => filterReports(val._id)} className="btn btn-primary btn-sm">view</button></td>
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
                {filterR.length > 0 ? <>
                    <h5 className="mt-3 text-muted mb-3">Reports on this post-</h5>
                    <div className="reports table-responsive text-center">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>s.no</th>
                                    <th>Username</th>
                                    <th>Report</th>
                                    <th>Date</th>
                                    <th>Time</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filterR.map((val, index) => {
                                    return (
                                        <>
                                            <tr>
                                                <td>{index + 1}</td>
                                                <td>{val.reporting_person_name}</td>
                                                <td>{val.report}</td>
                                                <td>{new Date(val.dor).toDateString()}</td>
                                                <td>{formatAMPM(new Date(val.dor))}</td>
                                            </tr>
                                        </>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </>
                    : null}
            </div>
        </>
    )
}

export default ReportManager
