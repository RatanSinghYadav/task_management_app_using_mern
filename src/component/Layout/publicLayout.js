import React from 'react'
import { Outlet } from 'react-router-dom'
import PublicNav from './publicNav'


function PublicLayout() {
  return (
    <>
      <PublicNav/>
      <Outlet />
    </>
  )
}

export default PublicLayout;