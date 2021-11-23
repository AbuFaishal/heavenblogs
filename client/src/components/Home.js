import React, { useEffect, useContext, useState } from 'react'
import axios from 'axios';
import { userContext } from "./App";
import { NavLink, useHistory } from "react-router-dom"
import Pagination from './Pagination';

function Home() {
    const history = useHistory();
    const { user } = useContext(userContext);
    // console.log(user);
    const [post, setpost] = useState([]);
    const [catlist, setcatlist] = useState([]);
    const [malert, msetalert] = useState("Loading posts...");

    const loadCategory = async () => {
        try {
            const res = await axios.get("http://localhost:8000/getcategories");
            setcatlist(res.data);
        } catch (error) {
            console.log(error);
            alert("server not responding!");
        }
    }
    const loadPosts = async () => {
        try {
            const res = await axios.get("http://localhost:8000/getposts");
            if (res.data === "no") {
                msetalert("* Posts not found..");
            } else {
                if (res.data.length > 0) {
                    const filtdata = res.data.filter(val => !val.disable);
                    setpost(filtdata);
                    if (post.length === 0)
                        msetalert("* Posts not found..");
                }else{
                    msetalert("* Posts not found..");
                }
            }
            loadCategory();
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
        loadPosts();
    }, [])
    return (
        <>
            <div className="row">
                <div className="col" style={{ position: "relative", overflow: "hidden" }}>
                    <div className="textpart">
                        <h1>Blog Website</h1>
                        <p style={{ color: "teal" }}>Start creating your blogs and showcase it to the world</p>
                    </div>
                    <div className="img"></div>
                </div>
            </div>
            <div className="row">
                <div className="col-md-3 ">
                    <div className="lm mt-2 border p-2">
                        {/* <NavLink to="/addpost" className="btn btn-info mb-2">CREATE BLOG</NavLink> */}
                        <button className="btn btn-info mb-2" onClick={() => {
                            if (user) {
                                history.push({ pathname: "/addpost", data: "" })
                            } else {
                                alert("please login to add post");
                                history.push("/login");
                            }
                        }}>CREATE BLOG</button>
                        {catlist.map((val) => {
                            return (
                                <>
                                    <li><NavLink to={`/categoryposts/${val.category}`}>{val.category}</NavLink></li>
                                </>
                            )
                        })}
                    </div>
                </div>
                <div className="col-md-9">
                    <div className="row mb-3">
                        {post.length === 0 ?
                            <h3 className="text-warning m-2">{malert}</h3>
                            :
                            datacome.map((data) => {
                                return (
                                    <>
                                        <div className="col-lg-4 col-sm-6 py-3">
                                            {/* <NavLink to={`/showpost/${data._id}`} id="go" className="d-none">click</NavLink> */}
                                            <div className="card mx-auto" title="open blog" style={{ maxWidth: "18rem", position: "relative" }}>
                                                <NavLink id="open" to={`/showpost/${data._id}`}><i class="fas fa-arrow-alt-circle-right"></i></NavLink>
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
        </>
    )
}

export default Home
