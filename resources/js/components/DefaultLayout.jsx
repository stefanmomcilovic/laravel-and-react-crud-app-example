import { Link, Navigate, Outlet, useNavigate } from "react-router-dom";
import { useStateContext } from "../context/ContextProvider";
import axiosClient from "../axios-client";
import { useEffect, useState } from "react";

export default function DefaultLayout() {
  const {user, token, setUser, setToken, notification} = useStateContext();
  const navigate = useNavigate();
  const [errors, setErrors] = useState(null);


  if(!token) {
    return <Navigate to="/login" />
  }

  const onLogout = (e) => {
    e.preventDefault();
    axiosClient.post('/logout')
      .then(() => {
        setUser({})
        setToken(null)
    }).catch((error) => {
        const response  = error.response;
        if(response && response.status === 401) {
          return navigate('/login')
        }
    });
  }

  useEffect(() => {
    axiosClient.get('/user')
      .then(({data}) => {
        setUser(data)
    }).catch((error) => {
        const response  = error.response;
        if(response && response.status === 401) {
          setErrors(response.data.errors)
          return navigate('/login')
        }
    });
  }, []);
  
  return (
    <div id="defaultLayout">
      <aside>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/users">Users</Link>
      </aside>
      <div className="content">
        <header>
          <div>
            Header
          </div>
          <div>
            {user.name}
            <a to="#" onClick={onLogout} className="btn-logout">Logout</a>
          </div>
        </header>
        <main>
          {errors && <div className="alert"> {Object.keys(errors).map((key) => ( <p key={key}>{errors[key][0]}</p> ))}  </div>}
          <Outlet/>
        </main>
        {(notification) && <div className={`${notification.class}`}>{notification.message}</div>}
      </div>
    </div>
  );
}
