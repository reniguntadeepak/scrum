import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './NavBar';

function Root() {
  return (
    <div>
      <Navbar/>
      <Outlet />
    </div>
  );
}

export default Root;
