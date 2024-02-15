import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import '../Assets/Styles/sidebar.css'

function Sidebar() {
  const navigate = useNavigate();

  const userLogout = () => {
    if (localStorage.getItem('token')) {
      localStorage.clear();
      navigate('/login');
    }
  }

  return (
    <div >
      <div className="mobile-navbar">
        <div className='mobile-navbar-container'>
          <Link style={{ textDecoration: 'none' }} to={'/user/home'}>
            <p className='mobile-links'>Home</p>
          </Link>
          <Link style={{ textDecoration: 'none' }} to={'/user/profile'}>
            <p className='mobile-links'>Profile</p>
          </Link>
          <p className='mobile-links' onClick={userLogout}>Logout</p>
        </div>
      </div>
    </div>
  )
}

export default Sidebar