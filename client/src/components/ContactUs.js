import axios from 'axios';
import React, { useState } from 'react'

function ContactUs() {
    const [data, setData] = useState({
        name: "",
        email: "",
        message: ""
    })
    const handleChange = (event) => {
        setData({ ...data, [event.target.name]: event.target.value });
    }
    const submitData = async () => {
        try {
            const { name, email, message } = data;
            const response = await axios.post("http://localhost:8000/contact", { name, email, message });
            console.log(response);
            setData({
                name: "",
                email: "",
                message: ""
            })
        } catch (error) {
            console.log(error);
            alert("server not responding!");
        }
    }
    return (
        <>
            <div className="container mt-3">
                <div className="row">
                    <div className="col-md-7 col-sm-10 mx-auto border p-3">
                        <h4>Contact Us</h4>
                        <div className="messagebox">
                            <label>Name:</label>
                            <input type="text" value={data.name} name="name" onChange={handleChange} />
                            <label>Email: </label>
                            <input type="email" value={data.email} name="email" onChange={handleChange} />
                            <label>Message: </label>
                            <textarea name="message" value={data.message} rows="4" cols="30" onChange={handleChange}></textarea>
                            <button className="btn btn-success mt-2" onClick={submitData}>Submit</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ContactUs
