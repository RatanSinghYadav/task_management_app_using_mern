import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../Assets/Styles/UserLogin.css";
import UserImage from "../Assets/Media/Images/UserLogin.png";
import { useNavigate } from "react-router-dom";
import { url } from "../utils/constant";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loader, setLoader] = useState(false);


  const navigate = useNavigate();

  const handleLogin = async () => {
    if (email === '') {
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
        const response = await fetch(`${url}/api/v1/user/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
            password: password,
          }),
        });

        const data = await response.json();
        //   console.log(data.token)
        //   console.log(data.userlogin._id)
        localStorage.setItem('userId', data.userlogin._id)
        localStorage.setItem('token', data.token)

        if (response.ok) {
          console.log("Login Status:", data.message);
          navigate("/user/home");
        }
      } catch (error) {
        console.error("Error during login:", error);
      } finally {
        setLoader(false);

      }
    }

  };

  const handleGoogleSignup = () => {
    // Your Google signup logic goes here
    console.log("Google Signup clicked");
  };

  const handleCreateAccount = () => {
    navigate('/signup')
    // console.log("Create Account clicked");
  };

  useEffect(() => {
    if (localStorage.getItem('token')) {
      navigate('/user/home');
    }
  }, [])

  return (
    <div className="card-container">
      <div className="login-box">
        {/* {loader && (
          <div className='circle'>
            <div class="spinner-border"></div>
            <strong>Loading...</strong>
          </div>
        )} */}
        <form className="log-form">
          <label className="form-label">
            Email
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
          <label className="form-label">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={() => setRememberMe(!rememberMe)}
            />{" "}
            Remember Me
          </label>
          <a href="/forgot-password" className="form-label">
            <span className="frgt">Forgot Password?</span>{" "}
          </a>
          <br />

          {loader ?
            <div className='circle' style={{marginTop:'2.3rem'}}>
              <div class="spinner-border"></div>
              <strong>Loading...</strong>
            </div>
            :
            <button type="button" onClick={handleLogin} className="login-buttons mt-4">
              Login
            </button>
          }


          <br />

          <p className="or-tag">or</p>
          <div className="log-links">
            <br />
            <button
              type="button"
              onClick={handleCreateAccount}
              className="create-button"
            >
              Create New Account
            </button>
          </div>
        </form>
      </div>
      <div className="image-container">
        <img src={UserImage} alt="User Login" className="form-image" />
      </div>
      <ToastContainer />
    </div>
  );
};

export default Login;
