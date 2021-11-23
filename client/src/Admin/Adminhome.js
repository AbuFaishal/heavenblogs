import axios from 'axios';
import React, { useState, useContext, useEffect } from 'react'
import { NavLink, useHistory } from "react-router-dom";
import { adminContext } from "./AdminRoute";
import Pagination from '../components/Pagination';
function Adminhome() {
    const { admin } = useContext(adminContext);
    const history = useHistory();
    const [cat, setCat] = useState("");
    const [catlist, setcatlist] = useState([]);
    const [sort, setsort] = useState({
        currenttype: "normal",
        category: "normal"
    })
    // const [alert, setalert] = useState("Loading...");
    const submitCat = async () => {
        try {
            if(cat!==""){
                const res = await axios.post("http://localhost:8000/addcategory", { category: cat });
                if (res.data === "added")
                    setCat("");
            }
        } catch (error) {
            console.log(error);
            alert("server not responding!");
        }
    }
    const loadCategory = async () => {
        try {
            const res = await axios.get("http://localhost:8000/getcategories");
            setcatlist(res.data);
        } catch (error) {
            console.log(error);
            alert("server not responding!");
        }
    }
    const deleteCategory = async (id) => {
        try {
            const res = await axios.delete(`http://localhost:8000/deletecategory/${id}`);
            loadCategory();
            // console.log(res);
        } catch (error) {
            console.log(error);
            alert("server not responding!");
        }
    }
    const disableEnableToggle = async (id) => {
        try {
            const res = await axios.get(`http://localhost:8000/disableenabletoggle/${id}`);
            loadCategory();
        } catch (error) {
            console.log(error);
            alert("server not responding!");
        }
    }
    const handleSort = (e) => {
        setsort({ ...sort, [e.target.name]: e.target.value });
    }
    //post part----
    const [post, setpost] = useState([]);
    const loadPosts = async () => {
        try {
            const res = await axios.get(`http://localhost:8000/getpostbycateory/${sort.category}`);
            if (sort.currenttype === "normal") {
                if (res.data !== "no") {
                    setpost(res.data);
                } else {
                    setpost([]);
                    // setalert("*no data found");
                }
            } else if (sort.currenttype === "today") {
                if (res.data !== "no") {
                    let todaydate = new Date().toJSON().slice(0, 10);
                    const filterpost = res.data.filter((val) => {
                        let postdate = new Date(val.date).toJSON().slice(0, 10);
                        if (postdate === todaydate)
                            return val;
                    })
                    setpost(filterpost);
                } else {
                    // setalert("*no data found");
                    setpost([]);
                }
            }

        } catch (error) {
            alert("server not responding!");
            console.log(error);
        }
    }
    //pagination part
    const [currentpage, updatecurrentpage] = useState(1);
    const [postperpage, setpostperpage] = useState(6);
    //for numbers in pagination
    const [pagenumlimit, updatepagenumlimit] = useState(3);
    const [maxpagelimit, updatemaxpagelimit] = useState(3);
    const [minpagelimit, updateminpagelimit] = useState(0);
    //search button active when true deactive when false
    const [active, update] = useState(false);
    //page dividing code
    const indexoflastpage = currentpage * postperpage;
    const indexoffirstpage = indexoflastpage - postperpage;
    const currentlist = post.slice(indexoffirstpage, indexoflastpage);
    let datacome = [];
    datacome = currentlist;
    //next and previous button
    const paginate = (pagenum) => {
        updatecurrentpage(pagenum);
    }
    let prevBut = () => {
        updatecurrentpage(currentpage - 1);
        if ((currentpage - 1) % pagenumlimit == 0) {
            updatemaxpagelimit(maxpagelimit - pagenumlimit);
            updateminpagelimit(minpagelimit - pagenumlimit);
        }
    }
    let nextBut = (maxpagenum) => {
        updatecurrentpage(currentpage + 1);
        if (currentpage + 1 > pagenumlimit && maxpagelimit < maxpagenum) {
            updatemaxpagelimit(maxpagelimit + pagenumlimit);
            updateminpagelimit(minpagelimit + pagenumlimit);
        }
    }
    useEffect(() => {
        if (!admin)
            history.push("/adminlogin");

        loadCategory();
        loadPosts();
    }, [sort, cat])
    return (
        <>
            <div className="rightbar">
                <div className="categorymanage ">
                    <div className="add">
                        <input type="text" placeholder="Add Category.." onChange={(e) => setCat(e.target.value)} value={cat} />
                        <button className="btn btn-sm btn-success" onClick={submitCat}>Add</button>
                    </div>
                    <div className="list border mt-3">
                        {catlist.map((data) => {
                            return (
                                <>
                                    <li>
                                        <a href="#">{data.category}</a>
                                        <label style={{ color: "crimson", float: "right", cursor: "pointer" }} onClick={() => { deleteCategory(data._id) }}><i
                                            className="fas fa-trash"></i></label>
                                        <button className={`btn btn-sm px-1 py-0 ${!data.disable?'btn-danger':'btn-success'}`} style={{ float: "right", marginRight: "5px", cursor: "pointer",fontWeight:"bold" }} onClick={() => { disableEnableToggle(data._id) }}>{!data.disable ? "Disable" : "Enable"}</button>
                                    </li>
                                </>
                            )
                        })}
                    </div>
                </div>
                <div className="sort">
                    <div className="titleshow">
                        <h4 className="text-muted mt-2">Blogs -</h4>
                    </div>
                    <div className="selectboxs">
                        <select name="currenttype" style={{ maxWidth: "fit-content" }} onChange={handleSort}>
                            <option value="normal" selected>Sort By Date</option>
                            <option value="today">Today's Blogs</option>
                        </select>
                        <select name="category" style={{ maxWidth: "fit-content" }} onChange={handleSort}>
                            <option value="all" selected>All</option>
                            {catlist.map((data) => {
                                if (!data.disable)//if category is enable
                                    return (
                                        <>
                                            <option value={data.category}>{data.category}</option>
                                        </>
                                    )
                            })}
                        </select>
                    </div>
                </div>
                <hr />
                <div className="blogs mb-5">
                    <div className="container">
                        <small className="text-danger">Note: Blocked post will appear red</small>
                        <div className="row">
                            {post.length === 0 ?
                                <h4 className="text-danger m-2" id="alert">* No data found..</h4>
                                :
                                datacome.map((data) => {
                                    return (
                                        <>
                                            <div className="col-lg-4 col-sm-6 py-3">
                                                <div className={`card mx-auto ${data.disable ? 'blockedcard' : null}`} title="open blog" style={{ maxWidth: "18rem", position: "relative" }}>
                                                    <button id="open" onClick={() => { history.push('/adminshowpost', { postdata: data }); }}><i className="fas fa-arrow-alt-circle-right" style={{cursor:"pointer"}}></i></button>
                                                    <img className="card-img-top" src={data.blogimage} alt="Card image cap" />
                                                    <div className="card-body">
                                                        <h6 className="card-title">{data.title.length > 60 ? data.title.substring(0, 60) + "..." : data.title}</h6>
                                                        <p style={{ fontSize: "14px" }} className="card-text">{data.description.length > 80 ? data.description.substring(0, 80) + "..." : data.description}</p>
                                                    </div>
                                                    <small className="text-success mx-2 my-2">Author : <span className="text-muted">{data.username}</span><span className="text-muted float-right">{new Date(data.date).toDateString()}</span></small>
                                                </div>
                                            </div>
                                        </>
                                    )
                                })}
                        </div>
                        {/* <!-- pagination --> */}
                        {post.length > 6 ?
                            <Pagination
                                totalpage={post.length}
                                postperpage={postperpage}
                                paginate={paginate}
                                currentpage={currentpage}
                                maxpage={maxpagelimit}
                                minpage={minpagelimit}
                                prevBut={prevBut}
                                nextBut={nextBut}
                            /> : null}
                    </div>
                </div>
            </div>
        </>
    )
}

export default Adminhome
