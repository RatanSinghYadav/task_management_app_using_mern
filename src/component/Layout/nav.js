import React, { useEffect, useState } from 'react'
import logo from "../Assets/Media/Images/tick.png"
import { Link, useNavigate } from 'react-router-dom';
import '../Assets/Styles/userNav.css'
import { url } from '../utils/constant';


const Nav = () => {
  const navigate = useNavigate();

  const[user, setUser] = useState();

  const checkToken = async () => {
    try {
      const response = await fetch(`${url}/verifyuser`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'token': localStorage.getItem('token')
        },
      });
      const data = await response.json();
      setUser(data.data);
      // console.log(data);
    }
    catch (e) {
      console.log('error in verifying token:', e);
    }
  }


  //  fetch user profile 

  const [profile, setProfile] = useState('');

  const fetchProfile = async () => {
    try {
      const response = await fetch(`${url}/api/v1/user/getUserData`, {
        method: 'GET',
        headers: {
          'token': localStorage.getItem('token'),
          'Content-Type': 'application/json',
        },
      });
      const getResponse = await response.json();
      // console.log(getResponse);
      setProfile(getResponse.user);
    }
    catch (e) {
      console.log('error in verifying token:', e);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!localStorage.getItem("token")) {
        navigate("/login");
      } else {
        await checkToken();
      }
    };

    // fetchProfile();
    fetchData();
  }, []);

  const userLogout = () => {
    if (localStorage.getItem('token')) {
      localStorage.clear();
      navigate('/');
    }
  }

  return (
    <div className="jobapp-nav">
      <Link to={'/user/home'}>
        <img className="jobapp-logo" src={logo} alt="logo" />
      </Link>
      <div className="nav-right">
        <div className='top-desktop-nav'>
          <Link style={{ textDecoration: 'none' }} to={'/feed'}>
            <p className='top-desktop-nav-links' >Feed</p>
          </Link>
          <Link style={{ textDecoration: 'none' }} to={'/user/home'}>
            <p className='top-desktop-nav-links' >Home</p>
          </Link>
          <Link style={{ textDecoration: 'none' }} to={'/user/profile'}>
            <p className='top-desktop-nav-links' >Profile</p>
          </Link>
        </div>
        <p className='profileLogoName'>{user && user.fname ? user.fname[0].toUpperCase() : ""}</p>
        <div className="job-candidate">
          <div style={{ fontWeight: "500" }}> {user ? `${user.fname} ${user.lname === null ? "" : user.lname}` : ""}</div>
          <button onClick={userLogout} className="job-btn">Logout</button>
        </div>
      </div>
    </div>
  )
}

export default Nav
