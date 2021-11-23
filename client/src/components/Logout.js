import React, { useEffect, useContext } from 'react'
import { useHistory } from 'react-router';
import { userContext } from "./App";
import axios from 'axios';

function Logout() {
    const { setuser, setuserdata } = useContext(userContext);
    const history = useHistory();
    const logoutuser = async () => {
        try {
            const res = await axios.get("http://localhost:8000/logout", { withCredentials: true });
            if (res.data === "deleted") {
                setuser(false);
                setuserdata({
                    id: "",
                    username: ""
                })
                history.push("/")
            }
        } catch (error) {
            alert("server not responding!");
        }
    }
    useEffect(() => {
        logoutuser();
    }, [])
    return (
        <>

        </>
    )
}

export default Logout
