import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
// import { FcGoogle } from "react-icons/fc";
import "../Assets/Styles/UserLogin.css";
import UserSignup from "../Assets/Media/Images/UserSignup.png";
import { useNavigate } from "react-router-dom";
import swal from "sweetalert";
import { url } from "../utils/constant.js";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Signup = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    // const [confirmPassword, setConfirmPassword] = useState("");
    const [loader, setLoader] = useState(false);

    const navigate = useNavigate();

    const handleSignUp = async (e) => {
        e.preventDefault();

        if (name === '') {
            toast.warn('Name Required!', {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
            return
        } else if (email === '') {
            toast.warn('Email Required!', {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
            return
        } else if (phone === '') {
            toast.warn('Phone Number Required!', {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
            return
        } else if (password === '') {
            toast.warn('Password Required!', {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
            return
        } else {
            setLoader(true);
            try {
                const response = await fetch(`${url}/api/v1/user/signup`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        fname: name,
                        email: email,
                        password: password,
                        number: phone,
                        // confirmPassword: confirmPassword,
                    }),
                });
                const data = await response.json();

                if (response.ok) {
                    console.log("Login Status:", data.message);
                    swal({
                        title: "Success",
                        text: "You have Successfully Registered!",
                        icon: "success",
                        button: "Ok",
                    });
                    navigate("/login");
                }

                // console.log("Signup successful", data);

            } catch (error) {
                console.error("Error during signup:", error);
            } finally {
                setLoader(false);

            }
        }

    };

    const handleGoogleSignUp = () => {

        console.log("Signing up with Google...");
    };

    const candidateLogin = () => {
        navigate('/login')
    }

    useEffect(() => {
        if (localStorage.getItem('token')) {
            navigate('/');
        }
    }, [])

    return (
        <div className="card-container">
            <div className="login-box">
                <form className="log-form">
                    <label className="form-label">
                        Name
                        <br />
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="form-input"
                            placeholder="user name"
                        />
                    </label>
                    <br />

                    <label className="form-label">
                        Email:
                        <br />
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="form-input"
                            placeholder="user@gmail.com"
                        />
                    </label>
                    <br />

                    <label className="form-label">
                        Phone Number
                        <br />
                        <input
                            type="number"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="form-input"
                            placeholder="phone number"
                        />
                    </label>
                    <br />

                    <label className="form-label">
                        Password
                        <br />
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="form-input"
                            placeholder="********"
                        />
                    </label>
                    <br />

                    <button onClick={handleSignUp} className="login-buttons">Sign Up</button>
                    <p className="or-tag">or</p>




                    {loader ?
                        <div className='circle' style={{ marginTop: '2.3rem' }}>
                            <div class="spinner-border"></div>
                            <strong>Loading...</strong>
                        </div>
                        :
                        <button
                            type="button"
                            onClick={candidateLogin}
                            className="create-button"
                        >
                            Login
                        </button>
                    }
                </form>
            </div>
            <div className="image-container">
                <img src={UserSignup} alt="User Signup" className="form-image" />
            </div>
            <ToastContainer />
        </div>
    );
};

export default Signup;
