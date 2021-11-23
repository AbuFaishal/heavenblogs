import React, { useState, useEffect, useContext, useRef } from 'react'
import axios from 'axios';
import { useHistory } from 'react-router';
import { userContext } from "./App"

function AddPost(props) {
    // console.log(props);
    const [edit, setEdit] = useState(false);
    const [preloader, setpreloader] = useState(false);
    const ref = useRef();
    const history = useHistory();
    const { user, userdata } = useContext(userContext);
    const [data, setdata] = useState({
        category: "",
        title: "",
        blogimage: "",
        vlink: "",
        description: ""
    });
    const [catlist, setcatlist] = useState([]);
    const loadCategory = async () => {
        try {
            const res = await axios.get("http://localhost:8000/getcategories");
            setcatlist(res.data);
        } catch (error) {
            console.log(error);
            alert("server not responding!");
        }
    }
    const checkEdit = () => {
        //if edit arrive then change the value
        if (props.location.data !== "") {
            console.log(props.location.data);
            setEdit(true);
            setdata({
                category: props.location.data.category,
                title: props.location.data.title,
                vlink: props.location.data.vlink !== "" ? "https://youtu.be/" + props.location.data.vlink : "",
                description: props.location.data.description
            })
        } else {
            history.push({ pathname: "/addpost", data: "" });//back to same page again
        }
    }


    const splitLinkCode = (link) => {
        let code = "";
        for (let i = link.length - 1; i >= 0; i--) {
            if (link.charAt(i) === '/') {
                break;
            }
            code += link.charAt(i);
        }
        code = code.split("").reverse().join("");
        return code;
    }
    const handleChange = (e) => {
        setdata({ ...data, [e.target.name]: e.target.value });
    }
    const handleFile = (e) => {
        setdata({ ...data, blogimage: e.target.files[0] });
    }
    // console.log(data);https://youtu.be/7il2CrBA5VY
    const submitData = async (event) => {
        event.preventDefault();
        //distructuring values
        let { category, title, vlink, blogimage, description } = data;
        //spliting video code and storing
        vlink = splitLinkCode(vlink);
        //DOM manupulation
        const imageformat = ["image/jpg", "image/jpeg", "image/png"];
        if (category === "" || title === "" || description === "") {
            alert("please enter all fields");
        }
        else if (!edit && blogimage === "") {
            alert("please select blog image");
        }
        else if (!edit && blogimage !== "" && imageformat.indexOf(blogimage.type) === -1) {
            alert('please select proper image file');
        }
        else {
            try {
                if (userdata.id === "") {
                    alert("Please Login to addpost");
                    history.push("/login");
                } else {
                    setpreloader(true);
                    // console.log(data.blogimage);
                    if (edit) {
                        await axios.patch(`http://localhost:8000/updatepost/${props.location.data._id}`, { category, title, vlink, description })
                            .then((res) => {
                                setpreloader(false);
                                setdata({
                                    title: "",
                                    blogimage: "",
                                    vlink: "",
                                    description: ""
                                });
                                ref.current.value = "";
                                history.goBack();
                                // history.push({ pathname: "/showpost", data: [res.data] });//return to showpost with modified data
                                // console.log(res);
                            })
                            .catch((err) => {
                                console.log(err);
                                history.push("/error");
                            });
                    } else {
                        const formdata = new FormData();
                        formdata.append('userid', userdata.id);
                        formdata.append('username', userdata.username);
                        formdata.append('category', category);
                        formdata.append('title', title);
                        formdata.append('vlink', vlink);
                        formdata.append('description', description);
                        formdata.append('blogimage', blogimage);
                        await axios.post("http://localhost:8000/addpost", formdata)
                            .then((res) => {
                                setpreloader(false);
                                console.log(res.data);
                                setdata({
                                    title: "",
                                    blogimage: "",
                                    vlink: "",
                                    description: ""
                                });
                                ref.current.value = "";
                            })
                            .catch((err) => {
                                setpreloader(false);
                                console.log(err);
                                history.push("/error");
                            });
                    }
                }
            } catch (err) {
                console.log(err);
            }
        }
    }
    useEffect(() => {
        loadCategory();
        //handling page refresh
        if (props.history.action === "POP") {
            history.goBack();
        } else {
            checkEdit();
        }
    }, [])
    return (
        <>
            <div className="container py-3">
                <div className="row">
                    <div className="col p-2 border bg-light" style={{ boxShadow: "5px 5px 10px gray" }}>
                        <h3 className="ml-2" style={{ color: "teal", opacity: "0.7" }}>{edit ? "Update Blog -" : "Create Blog -"}</h3>
                        <form className="addData mt-5" onSubmit={() => { return false }} method="post" encType="multipart/form-data">
                            <div className="form-group">
                            <small className="text-danger">Note: if any category is not showing means disabled by the admin.</small><br />
                                <select className="form-select p-2" onChange={handleChange} name="category" style={{ outline: "none", fontFamily: "sans-serif", borderRadius: "5px" }} aria-label="Default select example">
                                    {!edit ?
                                        <option>Select category of blog</option>
                                        : <option selected>Select category of blog</option>}
                                    {catlist.map((val) => {
                                        if (!val.disable)//if category is not disabled 
                                            return (
                                                val.category === data.category ?
                                                    <>
                                                        <option val={val.category} selected>{val.category}</option>
                                                    </> :
                                                    <>
                                                        <option value={val.category}>{val.category}</option>
                                                    </>
                                            )
                                    })}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Title :</label>
                                <input type="text" value={data.title} name="title" onChange={handleChange} className="form-control" placeholder="Blog Title.." />
                            </div>
                            {!edit ?
                                <div className="form-group">
                                    <label>Photo :</label><br />
                                    <small className="text-danger">* insert only good resolution image</small>
                                    <input type="file" ref={ref} name="blogimage" onChange={handleFile} className="form-control" />
                                </div> : null}
                            <div className="form-group">
                                <label>Video Link :</label>
                                <small className="text-danger">* Add only youtube video link</small>
                                <input type="text" value={data.vlink} name="vlink" onChange={handleChange} className="form-control" placeholder="eg :- https://www.youtube.com/" />
                            </div>
                            <div className="form-group">
                                <label>Description :</label>
                                <textarea className="form-control" value={data.description} name="description" onChange={handleChange} rows="5" placeholder="Describe your blog here..."></textarea>
                            </div>
                            <input type="submit" onClick={submitData} className="btn btn-info" value={edit ? "Update" : "Submit"} disabled={preloader ? true : false} />
                            {preloader ?
                                <label className="text-warning ml-2">Posting...</label>
                                : null}
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}

export default AddPost
