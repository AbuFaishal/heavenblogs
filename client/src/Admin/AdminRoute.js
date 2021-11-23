import React, { useState, useEffect, createContext } from 'react'
import axios from "axios"
import { Route, Switch } from 'react-router-dom'
import Adminhome from './Adminhome'
import Adminnavbar from './Adminnavbar'
import Adminlogin from "./Adminlogin"
import Footer from '../components/Footer'
import Adminlogout from './Adminlogout'
import AdminShowPost from './AdminShowPost'
import ManageUsers from './ManageUsers'
import ReportManager from './ReportManager'
import Messages from './Messages'

export const adminContext = createContext();
function AdminRoute() {
    const [admin, setadmin] = useState(false);
    const [admindata, setadmindata] = useState({
        id: "",
        adminname: ""
    });
    const isLogin = async () => {
        try {
            const res = await axios.get("http://localhost:8000/isadminlogin", { withCredentials: true });
            if (res.data !== "no") {
                setadmindata({
                    id: res.data.id,
                    adminname: res.data.adminname
                })
                setadmin(true);
            }
        } catch (error) {
            alert("server not responding!");
        }
    }
    useEffect(() => {
        isLogin();
    }, [admin])
    return (
        <>
            <adminContext.Provider value={{ admin, setadmin, admindata, setadmindata }}>
                <div className="heading bg-info">
                    <h4 className="m-2 text-white" style={{ fontFamily: "Pacifico, cursive" }}><span style={{ color: "orange" }}>H</span>eaven
                        <span style={{ color: "orange" }}>B</span>logs Admin panel
                    </h4>
                    <label htmlFor="ch"><i className="fas fa-bars text-white"></i></label>
                </div>
                <div className="parentbox pb-5">
                    {admin ?
                        <Adminnavbar />
                        : null}
                    <Switch>
                        <Route exact path="/admin" component={Adminhome} />
                        <Route exact path="/adminlogin" component={Adminlogin} />
                        <Route exact path="/adminlogout" component={Adminlogout} />
                        <Route exact path="/adminshowpost" component={AdminShowPost} />
                        <Route exact path="/adminmanageusers" component={ManageUsers} />
                        <Route exact path="/reportmanager" component={ReportManager} />
                        <Route exact path="/messagemanager" component={Messages} />
                    </Switch>
                    {/* <!-- footer-- > */}
                    <Footer />
                </div>
            </adminContext.Provider>
        </>
    )
}

export default AdminRoute
