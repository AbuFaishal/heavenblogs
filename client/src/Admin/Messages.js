import axios from 'axios';
import React, { useState, useContext, useEffect } from 'react'
import { NavLink, useHistory } from "react-router-dom";
import { adminContext } from "./AdminRoute";

function Messages() {
    const { admin } = useContext(adminContext);
    const history = useHistory();
    const [message, setmessage] = useState([]);
    const [filterM, setfilterM] = useState([]);
    const [count, setcount] = useState(0);
    const loadMessages = async () => {
        try {
            const res = await axios.get("http://localhost:8000/getmessages");
            setmessage(res.data);
            console.log(res.data);
            let c = 0;
            for (let i = 0; i < res.data.length; i++) {
                console.log(res.data[i].read);
                if (!res.data[i].read) {
                    c++;
                }
            }
            setcount(c);
        } catch (error) {
            console.log(error);
            alert("Server not responding!");
        }
    }
    const deleteMessage = async (messageId) => {
        try {
            const res = await axios.delete(`http://localhost:8000/deletemessage/${messageId}`);
            if (res.data === "deleted") {
                loadMessages();
                setfilterM([]);
            } else {
                alert("failed to delete");
            }
        } catch (error) {
            console.log(error);
            alert("Server not responding!");
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
    const filterShow = async (messageId) => {
        try {
            const filtdata = message.filter(val => val._id === messageId);
            setfilterM(filtdata);
            const res = await axios.patch(`http://localhost:8000/setread/${messageId}`);
            if (res.data === "updated")
                loadMessages();
        } catch (error) {
            console.log(error);
            alert("Server not responding!");
        }
    }
    useEffect(() => {
        if (!admin)
            history.push("/adminlogin");
        loadMessages();
    }, [])
    return (
        <>
            <div className="rightbar">
                <h4 className="text-muted my-3">Messages -</h4>
                {message.length > 0 ? <>
                    <p className="text-info mt-2">Unread Messages : {count}</p>
                    <div className="show_user_blogs border">
                        <div className="table-responsive">
                            <table className="table text-center table-sm table-bordered">
                                <thead className="thead-dark">
                                    <tr>
                                        <th>S.no</th>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Date</th>
                                        <th>Time</th>
                                        <th>Show message</th>
                                        <th>Status</th>
                                        <th>Delete</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {message.map((val, index) => {
                                        return (
                                            <>
                                                <tr>
                                                    <td>{index + 1}</td>
                                                    <td>{val.name}</td>
                                                    <td>{val.email}</td>
                                                    <td>{new Date(val.date).toDateString()}</td>
                                                    <td>{formatAMPM(new Date(val.date))}</td>
                                                    <td><button onClick={() => filterShow(val._id)} className="btn btn-sm btn-success">Show</button></td>
                                                    <td><span className={val.read ? "text-success" : "text-warning"}>{val.read ? "Read" : "Unread"}</span></td>
                                                    <td><i onClick={() => deleteMessage(val._id)} style={{ cursor: "pointer" }} className="fas fa-trash text-danger"></i></td>
                                                </tr>
                                            </>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
                    :
                    <h5 className="text-danger">* no any message yet</h5>
                }
                {filterM.length > 0 ?
                    <div className="messagediv border p-2 m-2" style={{ maxWidth: "600px", background: "rgb(199, 199, 238)" }}>
                        <div className="top" style={{ lineHeight: "5px" }}>
                            <h5 style={{ color: "teal" }}>{filterM[0].name}</h5>
                            <small className="text-muted">{formatAMPM(new Date(filterM[0].date))} {new Date(filterM[0].date).toDateString()} </small>
                        </div>
                        <h6 className="mt-3">Message-</h6>
                        <p>{filterM[0].message}</p>
                    </div> : null}
            </div>
        </>
    )
}

export default Messages
