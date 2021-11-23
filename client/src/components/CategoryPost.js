import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { useParams, useHistory } from 'react-router'
import Pagination from './Pagination';
import { NavLink } from 'react-router-dom'

function CategoryPost() {
    const history = useHistory();
    const { category } = useParams();
    const [post, setpost] = useState([]);
    const [malert, msetalert] = useState("Loading posts...");
    // console.log(category);
    const loadData = async () => {
        try {
            const res = await axios.get(`http://localhost:8000/getpostbycateory/${category}`);
            if (res.data === "no") {
                msetalert("* Posts not found..");
            } else {
                if (res.data.length > 0) {
                    const filtdata = res.data.filter(val => !val.disable);
                    setpost(filtdata);
                    if (post.length === 0)
                        msetalert("* Posts not found..");
                }
            }
            // console.log(res);
        } catch (error) {
            console.log(error);
            alert("server not responding");
        }
    }
    //pagination part
    const [currentpage, updatecurrentpage] = useState(1);
    const [postperpage, setpostperpage] = useState(10);
    //for numbers in pagination
    const [pagenumlimit, updatepagenumlimit] = useState(5);
    const [maxpagelimit, updatemaxpagelimit] = useState(5);
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
        loadData();
    }, [])
    return (
        <>
            <h4 class="text-muted mt-3 text-center">{category} Blogs</h4><hr />
            <div className="container mt-3">
                <div className="row">
                    {post.length === 0 ?
                        <h3 className="text-danger m-2">{malert}</h3>
                        :
                        post.map((data) => {
                            return (
                                <>
                                    <div className="col-lg-4 col-sm-6 py-3" >
                                        <div className="card mx-auto" title="open blog" style={{ maxWidth: "18rem" }}>
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
                    {/* <!-- pagination --> */}
                    {post.length > 10 ?
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

export default CategoryPost

