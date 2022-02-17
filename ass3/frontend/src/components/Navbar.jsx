import React from 'react';
import LogoutBtn from './LogoutBtn';
import { BrowserRouter as Link } from 'react-router-dom';
import { getLocalStorageValue } from '../hooks/useLocalStorage';

// This component is not used.
const Navbar = () => {
  const token = getLocalStorageValue('token');
  console.log('token');

  if (token === '') {
    return (
      <nav>
        <span>AirBrb</span>
        <Link to='/listings'>All Listings</Link> |
        <Link to='/user/auth/login'>Login</Link> |
        <Link to='/user/auth/register'>Register</Link>
      </nav>
    )
  } else {
    return (
    <nav>
      <span>AirBrb</span>
      <Link to='/'>My Listings</Link> |
      <Link to='/listing/create'>Listing Create</Link> |
      <LogoutBtn />
    </nav>
    )
  }
};

export default Navbar;
