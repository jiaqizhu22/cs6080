import React from 'react';
import { useNavigate } from 'react-router';
import { useLocalStorage } from '../hooks/useLocalStorage';

const LogoutBtn = () => {
  const [token, setToken] = useLocalStorage('token', '');
  const navigate = useNavigate();

  const logout = async () => {
    try {
      const r = await fetch('http://localhost:5005/user/auth/logout', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          Authorization: 'Bearer ' + token
        },
      });
      if (!r.ok) {
        throw Error(r.statusText);
      }
      setToken('');
      navigate('/');
    } catch (error) {
      alert(error);
    }
  };
  return (
    <button onClick={logout}>Logout</button>
  );
};

export default LogoutBtn;
