import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
// css
import './App.css';
import '@fontsource/roboto';
import SearchIcon from '@material-ui/icons/Search';
// pages
import ListingCreate from './pages/ListingCreate';
import Login from './pages/Login';
import Register from './pages/Register';
import ListingsHosted from './pages/ListingsHosted';
import Homepage from './pages/Homepage';
import ListingEdit from './pages/ListingEdit';
import ListingPage from './pages/ListingPage';
// components
import LogoutBtn from './components/LogoutBtn';
import { getLocalStorageValue } from './hooks/useLocalStorage';

function App () {
  return (
    <Router>
      <div>
        <div className='header'>
          <div className='navbar'>
          <h1>AirBrb</h1>
          {getLocalStorageValue('token') === ''
            ? <><nav>
              <Link to='/'>Home</Link>
              <Link to='/user/auth/login'>Login</Link>
              <Link to='/user/auth/register'>Register</Link>
            </nav></>
            : <><nav>
              <Link to='/'>Home</Link>
              <Link to='/listings/hosted'>My Listings</Link>
              <LogoutBtn />
            </nav></>}
          </div>
          <div className='searchbar'>
            <h3>Search here:</h3>
            <input type='text'/>
            <div className='icon'><SearchIcon /></div>
          </div>
        </div>
        <Routes>
          <Route path='/' element={<Homepage />} />
          <Route path='/listings/hosted' element={<ListingsHosted />} />
          <Route path='/listings/create' element={<ListingCreate />} />
          <Route path='/listings/edit/:listingid' element={<ListingEdit />} />
          <Route path='/listings/:listingid' element={<ListingPage />} />
          <Route path='/user/auth/login' element={<Login />} />
          <Route path='/user/auth/register' element={<Register />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
