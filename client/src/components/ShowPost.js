import axios from 'axios';
import React, { useContext, useState, useEffect } from 'react'
import { userContext } from "./App";
import { useParams, useHistory } from 'react-router';
import { NavLink } from 'react-router-dom';
import icon from './images/edit.png'
function ShowPost() {
    const history = useHistory();
    const { postid } = useParams();
    const [data, setdata] = useState({});
    const { user, userdata } = useContext(userContext);
    const [comment, setcomment] = useState("");
    const [commbyuser, setcommbyuser] = useState([]);
    const [newpropic, setnewprofpic] = useState({});
    const [editimg, seteditimg] = useState(0);
    const [reportstatus, setreportstatus] = useState(false);
    // console.log(report);
    const loadData = async () => {
        try {
            const res1 = await axios.get(`http://localhost:8000/getpostbyid/${postid}`);
            setdata(res1.data);
            const res2 = await axios.get("http://localhost:8000/getcomments");
            const filtcomment = res2.data.filter(value => value.postId === res1.data._id);
            setcommbyuser(filtcomment);
            if (user) {
                const res3 = await axios.get(`http://localhost:8000/getreportbyid/${postid}/${userdata.id}`);
                if (res3.data.length !== 0)
                    setreportstatus(true);
            }
        } catch (error) {
            console.log(error);
            alert("server not responding!");
        }
    }
    const deletePost = async (id) => {
        try {
            const res = await axios.delete(`http://localhost:8000/deletepost/${id}`);
            if (res.data === "deleted")
                history.push("/");
            else
                alert("failed to delete");
        } catch (error) {
            alert("server not responding!");
            console.log(error);
        }
    }

    const delComment = async (id) => {
        try {
            const res = await axios.delete(`http://localhost:8000/deletecomment/${id}`);
            if (!res.data === "deleted")
                alert("failed to delete");
            loadData();
        } catch (error) {
            alert("server not responding!");
            console.log(error);
        }
    }

    const addComment = async () => {
        try {
            if (user) {
                if (comment !== "") {
                    const res = await axios.post(`http://localhost:8000/addcomment`, {
                        username: userdata.username,
                        userId: userdata.id,
                        postId: data._id,
                        comment: comment
                    });
                    // console.log(res);
                    setcomment("");
                    loadData();
                }
            } else {
                alert("please login before comment!");
                history.push("/login");
            }
        } catch (error) {
            console.log("server not responding!");
            console.log(error);
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
                formdata.append('blogimage', newpropic);
                await axios.patch(`http://localhost:8000/updateblogimage/${data._id}`, formdata);
                document.getElementById("updatenow").disabled=true;
                seteditimg(0);
                loadData();
            }
        } catch (error) {
            console.log(error);
        }
    }
    const handleReport = async (e) => {
        try {
            if (user) {
                const report = e.target.value;
                if (window.confirm("Do you really want to report ?")) {
                    const res = await axios.post("http://localhost:8000/report", {
                        postId: data._id,
                        report: report,
                        reporting_person_id: userdata.id,
                        reporting_person_name: userdata.username
                    });
                    if (res.data === "reported")
                        loadData();
                }
            } else {
                alert("please login!");
                history.push("/login");
            }
        } catch (error) {
            console.log("server not responding!");
            console.log(error);
        }
    }
    useEffect(() => {
        loadData();
    }, [])
    return (
        <>
            {/* data is object so if its length is 0 means data is not arrived/initialized yet .so show loading */}
            {Object.keys(data).length === 0 ?
                <h4 className="text-danger m-3">Loading post...</h4>
                :
                <div className="container mt-2">
                    <div className="row">
                        <div className="col" style={{ position: "relative" }}>
                            {data.message !== "" ?
                                <div class="alert alert-danger" role="alert">
                                    {data.message}
                                </div> : null}
                            {userdata.id === data.userId ?
                                <div className="controls" style={{ position: "absolute", bottom: "-45px", right: "20px", zIndex: "1" }}>
                                    <label title="Edit post" onClick={() => history.push({ pathname: "/addpost", data: data })}><i style={{ fontSize: "20px", margin: "0px 5px", cursor: "pointer" }}
                                        className="fas fa-edit text-success"></i></label>
                                    <label title="Delete post" onClick={() => deletePost(data._id)}><i style={{ fontSize: "20px", cursor: "pointer" }}
                                        className="fas fa-trash-alt text-danger" ></i></label>
                                </div>
                                : null}
                            <div className="image">
                                {userdata.id === data.userId && editimg === 0 ?
                                    <div className="edit">
                                        <img src={icon} alt="Edit" title="Edit or upload profile Image" onClick={() => { document.getElementById('blogimage').click() }} />
                                        <input type="file" name="blogimage" id="blogimage" className="d-none" onChange={handlephoto} />
                                    </div> : null}
                                {editimg === 1 ?
                                    <button id="updatenow" onClick={updatePhoto} className="btn btn-success btn-sm" style={{ zIndex: "2" }}>Update photo</button>
                                    : null}
                                <div className="userimage">
                                    <img src={data.blogimage} alt="post image" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {userdata.id !== data.userId ?
                        !reportstatus ?
                            <select name="report" id="report" className="mt-2" onChange={handleReport}>
                                <option >Report</option>
                                <option value="abusive content">abusive content</option>
                                <option value="hate content">Hateful content</option>
                                <option value="hate content">Fake information</option>
                            </select>
                            : <p style={{ color: "red", fontWeight: "bold", marginTop: "20px" }}>✓Reported</p>
                        : null}
                    <div className="row ">
                        <div className="col">
                            <h3 className=" posttitle">{data.title}</h3>
                            <small className="text-muted" >Author: <NavLink to={`/authorpost/${data.userId}/${data.username}`} >{data.username}</NavLink></small>
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
                    <div className="row mb-2">
                        <div className="col">
                            <h5 className="text-muted">Comment -</h5>
                            <div className="row">
                                <div className="col-sm-10 col-9">
                                    <div className="form-group">
                                        <input type="text" value={comment} onChange={(e) => setcomment(e.target.value)} placeholder="Add your comment.." name="" className="form-control" />
                                    </div>
                                </div>
                                <div className="col-sm-2 col-3">
                                    <button className="btn btn-info " onClick={addComment}>Add</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row mb-3">
                        <div className="col-sm-11">
                            <h5 className="text-secondary mb-3"> {commbyuser.length} comments</h5>
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
                                                        <h5 style={{ margin: "0px" }}>{val.username}{userdata.id === val.userId ? <span style={{ cursor: "pointer" }} onClick={() => delComment(val._id)}><i style={{ fontSize: "13px" }}
                                                            className="fas fa-trash-alt text-danger ml-2" ></i></span> : null}</h5>
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
        </>
    )
}

export default ShowPost
