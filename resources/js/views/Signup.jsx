import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import axiosClient from "../axios-client";
import { useStateContext } from "../context/ContextProvider";
export default function Signup(){
    const [errors, setErrors] = useState(null);

    const nameRef = useRef();
    const emailRef = useRef();
    const passwordRef = useRef();
    const passwordConfirmRef = useRef();

    const {setUser, setToken} = useStateContext();

    const onSubmit = (e) => {
        e.preventDefault();
        const payload = {
            name: nameRef.current.value,
            email: emailRef.current.value,
            password: passwordRef.current.value,
            password_confirmation: passwordConfirmRef.current.value
        };
        setErrors(null);
        axiosClient.post('/signup', payload)
        .then(({data}) => {
            setUser(data.user);
            setToken(data.token);
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
        });       
    };

    return (
        <form onSubmit={onSubmit} className="animated fadeInDown">
            <h1 className="title">Sign up for free</h1>
            {errors && <div className="alert"> {Object.keys(errors).map((key) => ( <p key={key}>{errors[key][0]}</p> ))}  </div>}
            <input type="text" name="name" placeholder="Full Name" ref={nameRef} />
            <input type="email" name="email" placeholder="Email Address" ref={emailRef} />
            <input type="password" name="password" placeholder="Password" ref={passwordRef} />
            <input type="password" name="password" placeholder="Password Confirmation" ref={passwordConfirmRef} />
            <button className="btn btn-block">Sign up</button>
            <p className="message">Already have an account? <Link to="/login">Sign in</Link> </p>
        </form>
    );
}