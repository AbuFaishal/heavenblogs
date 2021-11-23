import React, { useState, useEffect, createContext } from 'react'
import axios from "axios"
import Home from './Home'
import Signup from './Signup'
import Login from './Login'
import AddPost from './AddPost'
import ShowPost from './ShowPost'
import CategoryPost from './CategoryPost'
import AuthorPost from './AuthorPost'
import Footer from './Footer'
import Navbar from './Navbar'
import Logout from './Logout'
import Profile from './Profile'
import ErrorRedirect from './ErrorRedirect'
import ContactUs from './ContactUs'
import { Route, Switch } from 'react-router-dom'
export const userContext = createContext();
function App() {

  const [user, setuser] = useState(false);
  const [userdata, setuserdata] = useState({
    id: "",
    username: ""
  });
  const isLogin = async () => {
    try {
      const res = await axios.get("http://localhost:8000/islogin", { withCredentials: true });
      if (res.data !== "no") {
        setuserdata({
          id: res.data.id,
          username: res.data.username
        })
        setuser(true);
      }
    } catch (error) {
      alert("server not responding!");
    }
  }
  useEffect(() => {
    isLogin();
  }, [user])
  return (
    <>
      {/* to toggle the login */}
      <userContext.Provider value={{ user, setuser, userdata, setuserdata }}>
        <div className="container-fluid pb-5" style={{ height: "100%" }}>
          <div className="row position-sticky sticky-top bg-light">
            <div className="col">
              <Navbar />
            </div>
          </div>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/signup" component={Signup} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/logout" component={Logout} />
            <Route exact path="/error" component={ErrorRedirect} />
            <Route exact path="/addpost" component={AddPost} />
            <Route exact path="/showpost/:postid" component={ShowPost} />
            <Route exact path="/categoryposts/:category" component={CategoryPost} />
            <Route exact path="/authorpost/:authorId/:authorname" component={AuthorPost} />
            <Route exact path="/profile" component={Profile} />
            <Route exact path="/contact" component={ContactUs} />
          </Switch>
          {/* <!-- footer --> */}
          <Footer />
        </div>
      </userContext.Provider>
    </>
  )
}

export default App
