import React, { useEffect, useState } from 'react'
import logo from "../Assets/Media/Images/tick.png"
import { Link, useNavigate } from 'react-router-dom';
import '../Assets/Styles/userNav.css'
import { url } from '../utils/constant';


const PublicNav = () => {
    const navigate = useNavigate();

    const [user, setUser] = useState();

    //   const checkToken = async () => {
    //     try {
    //       const response = await fetch(`${url}/verifyuser`, {
    //         method: 'POST',
    //         headers: {
    //           'Content-Type': 'application/json',
    //           'token': localStorage.getItem('token')
    //         },
    //       });
    //       const data = await response.json();
    //       setUser(data.data);
    //       // console.log(data);
    //     }
    //     catch (e) {
    //       console.log('error in verifying token:', e);
    //     }
    //   }


    //  fetch user profile 

    const [profile, setProfile] = useState('');

    //   const fetchProfile = async () => {
    //     try {
    //       const response = await fetch(`${url}/api/v1/user/getUserData`, {
    //         method: 'GET',
    //         headers: {
    //           'token': localStorage.getItem('token'),
    //           'Content-Type': 'application/json',
    //         },
    //       });
    //       const getResponse = await response.json();
    //       // console.log(getResponse);
    //       setProfile(getResponse.user);
    //     }
    //     catch (e) {
    //       console.log('error in verifying token:', e);
    //     }
    //   };

    //   useEffect(() => {
    //     const fetchData = async () => {
    //       if (!localStorage.getItem("token")) {
    //         navigate("/login");
    //       } else {
    //         await checkToken();
    //       }
    //     };

    //     // fetchProfile();
    //     fetchData();
    //   }, []);

    //   const userLogout = () => {
    //     if (localStorage.getItem('token')) {
    //       localStorage.clear();
    //       navigate('/login');
    //     }
    //   }

    return (
        <div className="jobapp-nav" style={{ height: '4rem' }}>
            <Link to={'/'}>
                <img className="jobapp-logo" src={logo} alt="logo" />
            </Link>
            <div className="nav-right">
                <div className='top-desktop-nav'>
                    <Link style={{ textDecoration: 'none' }} to={'/'}>
                        <p className='top-desktop-nav-links' >Home</p>
                    </Link>
                    <Link style={{ textDecoration: 'none' }} to={'/login'}>
                        <p className='top-desktop-nav-links' >Login</p>
                    </Link>
                    <Link style={{ textDecoration: 'none' }} to={'/signup'}>
                        <p className='top-desktop-nav-links' >Signup</p>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default PublicNav
