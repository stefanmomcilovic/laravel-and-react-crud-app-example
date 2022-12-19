import { useEffect, useState } from "react";
import axiosClient from "../axios-client";
import { Link } from "react-router-dom";
import { useStateContext } from "../context/ContextProvider";
export default function Users(){
    const { setNotification } = useStateContext();
    const [errors, setErrors] = useState(null);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        getUsers();
    }, []);

    const getUsers = () => {
        setLoading(true);
        setErrors(null);
        axiosClient.get('/users')
            .then(({data}) => {
                setUsers(data.data);
                setLoading(false);
            })
            .catch((error) => {
                setLoading(false);
                setErrors(error.response.data.errors);
            });
    };

    const onDelete = (user) => {
        if(confirm('Are you sure you want to delete this user?')){
            const id = user.id;
            setErrors(null);
            axiosClient.delete(`/users/${id}`)
                .then(({data}) => {
                    setNotification({
                        class: 'notification success',
                        type: 'success',
                        message: 'User deleted successfully'
                    });
                    getUsers();
                })
                .catch((error) => {
                    setErrors(error.response);
                });
        }
    };

    return (
        <div>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <h1>Users</h1>
                <Link to="/users/new" className="btn-add">Add User</Link>
            </div>
            <div className="card animated fadeInDown">
                {errors && <div className="alert"> {Object.keys(errors).map((key) => ( <p key={key}>{errors[key][0]}</p> ))}  </div>}
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Create Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading && (
                            <tr>
                                <td colSpan="5" className="text-center">Loading...</td>
                            </tr>
                        )}
                        {!loading && users.length === 0 && (
                            <tr>
                                <td colSpan="5" className="text-center">No users found.</td>
                            </tr>
                        )}
                        {!loading && users.length > 0 && users.map((user) => (
                            <tr key={user.id}>
                                <td>{user.id}</td>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>{user.created_at}</td>
                                <td>
                                    <Link to={`/users/${user.id}`} className="btn-edit">Edit</Link>
                                    &nbsp;
                                    <button onClick={e => onDelete(user)} className="btn-delete">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}