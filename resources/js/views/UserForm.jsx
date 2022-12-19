import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"
import axiosClient from "../axios-client";
import { useStateContext } from "../context/ContextProvider";

export default function UserForm() {
  const {id} = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState(null);
  const [user, setUser] = useState({
    id: null,
    name: '',
    email: '',
    password: '',
    password_confirmation: ''
  });
  const {setNotification} = useStateContext();

  if(id){
    useEffect(() => {
      setLoading(true);
      axiosClient.get(`/users/${id}`)
        .then(({data}) => {
          setUser(data.data);
          setLoading(false);
        })
        .catch((error) => {
          const response  = error.response;
            if(response.data.errors){
                setErrors(response.data.errors);
            }else{
                setErrors({
                    email: [response.data.message]
                });
            }
          setLoading(false);
        })
    }, []);
  }

  const onSubmit = (e) => {
    e.preventDefault();
    if(user.id){
      setErrors(null);
      axiosClient.put(`/users/${user.id}`, user)
        .then(({data}) => {
          setNotification({
            class: 'notification success',
            type: 'success',
            message: 'User updated successfully'
          });
          return navigate('/users');
        })
        .catch((error) => {
          setErrors(error.response.data.errors);
        });
    }else{
      setErrors(null);
      axiosClient.post('/users', user)
        .then(({data}) => {
          setNotification({
            class: 'notification success',
            type: 'success',
            message: 'User created successfully'
          });
          return navigate('/users');
        })
        .catch((error) => {
          setErrors(error.response.data.errors);
        });
    }
  };

  return (
    <>
      {user.id && <h1>Update User: {user.name}</h1>}
      {!user.id && <h1>Create User</h1>}
      <div className="card animated fadeInDown">
          {loading && <div className="text-center">Loading...</div>}
          {errors && <div className="alert"> {Object.keys(errors).map((key) => ( <p key={key}>{errors[key][0]}</p> ))}  </div>}
          {!loading && <form onSubmit={onSubmit}>
            <input type="text" placeholder="Full Name" name="name" value={user.name} onChange={e => setUser({...user, name: e.target.value})} />
            <input type="email" placeholder="Email Address" name="email" value={user.email} onChange={e => setUser({...user, email: e.target.value})} />
            <input type="password" placeholder="Password" name="password" onChange={e => setUser({...user, password: e.target.value})} />
            <input type="password" placeholder="Password Confirmation" name="password_confirmation" onChange={e => setUser({...user, password_confirmation: e.target.value})} />
            <button className="btn">Save</button>
          </form>}
      </div>
    </>
  )
}
