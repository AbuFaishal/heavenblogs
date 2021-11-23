import axios from 'axios';
import React, { useContext, useState, useEffect } from 'react'
import { adminContext } from "./AdminRoute";
import { useHistory } from 'react-router';
import { NavLink } from 'react-router-dom';
function AdminShowPost(props) {
    const history = useHistory();
    const [data, setdata] = useState({});
    const { admin } = useContext(adminContext);
    const [commbyuser, setcommbyuser] = useState([]);
    // console.log(newpropic);
    const loadcomment = async () => {
        const res2 = await axios.get("http://localhost:8000/getcomments");
        const filtcomment = res2.data.filter(value => value.postId === data._id);
        setcommbyuser(filtcomment);
    }
    const deletePost = async (id) => {
        try {
            const res = await axios.delete(`http://localhost:8000/deletepost/${id}`);
            if (res.data === "deleted")
                history.push("/admin");
            else
                alert("failed to delete");
        } catch (error) {
            alert("server not responding!");
            console.log(error);
        }
    }
    const blockPost = async (id) => {
        try {
            const res = await axios.get(`http://localhost:8000/blockpost/${id}`);
            if (res.data === "blocked") {
                history.goBack();
            }
        } catch (error) {
            alert("server not responding!");
            console.log(error);
        }
    }
    useEffect(() => {
        // if (!admin)
        //     history.push("/adminlogin");

        setdata(props.location.state.postdata);
        loadcomment();
    })
    return (
        <>
            <div className="rightbar mb-3">
                {/* data is object so if its length is 0 means data is not arrived/initialized yet .so show loading */}
                {Object.keys(data).length === 0 ?
                    <h4 className="text-danger m-3">Loading post...</h4>
                    :
                    <div className="container mt-2">
                        <div className="row">
                            <div className="col" style={{ position: "relative" }}>
                                <div className="controls" style={{ position: "absolute", bottom: "-45px", right: "20px", zIndex: "1" }}>
                                    {!data.disable ?
                                        <label title="Block/unblock this post" onClick={() => { blockPost(data._id) }} className="mx-2" style={{ cursor: "pointer" }}>Block <i class="fa fa-ban text-danger mr-3" aria-hidden="true"></i></label>
                                        :
                                        <label title="Block/unblock this post" onClick={() => { blockPost(data._id) }} className="mx-2" style={{ cursor: "pointer" }}>Unblock <i class="fa fa-unlock text-success mr-3" aria-hidden="true"></i></label>
                                    }
                                    <label title="Delete post" onClick={() => deletePost(data._id)}><i style={{ fontSize: "20px", cursor: "pointer" }}
                                        className="fas fa-trash-alt text-dark" ></i></label>
                                </div>
                                <div className="image">
                                    <div className="userimage">
                                        <img src={data.blogimage} alt="post image" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row mt-3">
                            <div className="col">
                                <h3 className=" posttitle">{data.title}</h3>
                                <small className="text-muted" >Author: {data.username}</small>
                                <small className="text-muted float-right">{new Date(data.date).toDateString()}</small>
                                <hr />
                                <div className="desc text-left my-2">
                                    <p>{data.description}</p>
                                </div>
                                {/* <!--showing video--> */}
                                {data.vlink !== "" ?
                                    <div className="video">
                                        <iframe width="100%" className="d-block mx-auto mt-2" height="315"
                                            src={`https://www.youtube.com/embed/${data.vlink}`} title="YouTube video player" frameBorder="0"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen></iframe>
                                    </div>
                                    : null}
                            </div>
                        </div>
                        <div className="row mb-3">
                            <div className="col-sm-11">
                                <h5 className="text-secondary my-3"> {commbyuser.length} comments</h5>
                                {commbyuser.map((val) => {
                                    let image = "/images/Users/" + val.user_detail[0].profilepic;
                                    if (val.user_detail[0].profilepic === "")
                                        image = "https://st.depositphotos.com/2101611/3925/v/600/depositphotos_39258143-stock-illustration-businessman-avatar-profile-picture.jpg";
                                    return (
                                        <>
                                            <div className="row">
                                                <div className="col">
                                                    <div className="box">
                                                        <div className="image">
                                                            <img src={image} />
                                                        </div>
                                                        <div className="content">
                                                            <h5 style={{ margin: "0px" }}>{val.username}</h5>
                                                            <small className="text-muted">{new Date(val.date).toDateString()}</small>
                                                            <p>{val.comment}</p>

                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    )
                                }
                                )}
                            </div>
                        </div>
                    </div>
                }
            </div>
        </>
    )
}

export default AdminShowPost
