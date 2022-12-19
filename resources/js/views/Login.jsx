import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import axiosClient from "../axios-client";
import { useStateContext } from "../context/ContextProvider";
export default function Login(){
    const [errors, setErrors] = useState(null);

    const emailRef = useRef();
    const passwordRef = useRef();

    const {setUser, setToken} = useStateContext();


    const onSubmit = (e) => {
        e.preventDefault();
        const payload = {
            email: emailRef.current.value,
            password: passwordRef.current.value,
        };
        setErrors(null);
        axiosClient.post('/login', payload)
        .then(({data}) => {
            setUser(data.user);
            setToken(data.token);
        }) 
        .catch((error) => {
            const response  = error.response;
            if(response && response.status === 422) {
                if(response.data.errors){
                    setErrors(response.data.errors);
                }else{
                    setErrors({
                        email: [response.data.message]
                    });
                }
            }
        });     
    };

    return (
        <form onSubmit={onSubmit} className="animated fadeInDown">
            <h1 className="title">Login into your account</h1>
            {errors && <div className="alert"> {Object.keys(errors).map((key) => ( <p key={key}>{errors[key][0]}</p> ))}  </div>}
            <input type="email" name="email" placeholder="Email Address" ref={emailRef} />
            <input type="password" name="password" placeholder="Password" ref={passwordRef} />
            <button className="btn btn-block">Login</button>
            <p className="message">Not Registered? <Link to="/signup">Create an account</Link> </p>
        </form>
    );
}