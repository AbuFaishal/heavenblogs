import React, { useEffect, useContext } from 'react'
import { useHistory } from 'react-router';
import { adminContext } from "./AdminRoute";
import axios from 'axios';

function Adminlogout() {
    const { setadmin, setadmindata } = useContext(adminContext);
    const history = useHistory();
    const logoutuser = async () => {
        try {
            const res = await axios.get("http://localhost:8000/adminlogout", { withCredentials: true });
            if (res.data === "deleted") {
                setadmin(false);
                setadmindata({
                    id: "",
                    adminname: ""
                })
                history.push("/adminlogin");
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

export default Adminlogout
