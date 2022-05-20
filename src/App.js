import React, { useEffect } from 'react';
import { Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import { fetchUser } from './utils/fetchUser';
import Login from './components/Login';
import Home from './container/Home';

const App = () => {
  const navigate = useNavigate();
  const user = fetchUser();

  useEffect(() => {

    if(!user) {
      navigate('/login')
    }

  }, [])

  return (
    <Routes>
      {user && (
        <Route path = '/login' element = {<Navigate replace to="/" />}/>
      )}
      <Route path="/login" element= {<Login />}/>
      <Route path="/*" element= {<Home />}/>
    </Routes>
  )
}

export default App;