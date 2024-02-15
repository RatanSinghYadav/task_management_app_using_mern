import React from 'react'
import { Outlet } from 'react-router-dom'
import Nav from './nav'
import Sidebar from './Sidebar'


function Layout() {
  return (
    <>
      <Nav/>
      <Outlet />
      <Sidebar/>
    </>
  )
}

export default Layout