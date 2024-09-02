import { useState, useEffect } from 'react'
import './App.css'
import { BrowserRouter, Route, Routes, useNavigate, Navigate } from 'react-router-dom'

import { Navbar } from './components/Navbar'

import { HomeLayout, ConcertLayout, AboutLayout, LoginLayout, OrdersLayout, NotFoundLayout } from './components/Layout'

import UserContext from './contexts/UserContext'

import API from './API.js';

function App() {
  return (
    <BrowserRouter>
      <AppWithRouter />
    </BrowserRouter>
  );
}


function AppWithRouter(props) {
  const navigate = useNavigate();  // To be able to call useNavigate, the component must already be in BrowserRouter (see App)

  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  const [ConcertList, setConcertList] = useState([]);
  const [message, setMessage] = useState('');
  // const [dirty, setDirty] = useState(true);

// If an error occurs, the error message will be shown in a toast.
const handleErrors = (err) => {
  //console.log('DEBUG: err: '+JSON.stringify(err));
  let msg = '';
  if (err.error)
    msg = err.error;
  else if (err.errors) {
    if (err.errors[0].msg)
      msg = err.errors[0].msg + " : " + err.errors[0].path;
  } else if (Array.isArray(err))
    msg = err[0].msg + " : " + err[0].path;
  else if (typeof err === "string") msg = String(err);
  else msg = "Unknown Error";
  setMessage(msg); // WARNING: a more complex application requires a queue of messages. In this example only the last error is shown.
  console.log(err);

  setTimeout(() => setDirty(true), 2000);
}

useEffect(() => {
  const checkAuth = async() => {
    try {
      //user info if already logged in
      const user = await API.getUserInfo();
      setLoggedIn(true);
      setUser(user);
    } catch (err) {}
  };
  checkAuth();
}, []); 


  const handleLogin = async (credentials) => {
    try {
      const user = await API.logIn(credentials);
      setUser(user);
      setLoggedIn(true);
    } catch (err) { throw err; }
  };


  const handleLogout = async () => {
    await API.logout();
    setLoggedIn(false);
    // clean up everything
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, loggedIn }}>
    <Routes>
      <Route path="/" element={<Navbar logout={handleLogout}/>}>
        <Route index element={<HomeLayout setConcertList={setConcertList} ConcertList={ConcertList} handleErrors={handleErrors}/>} />
        <Route path="/concert/:concertId" element={<ConcertLayout />} />
        <Route path="/about" element={<AboutLayout />} />
        <Route path="/login" element={!loggedIn ? <LoginLayout login={handleLogin} /> : <Navigate replace to='/' />} />
        <Route path="/orders" element={<OrdersLayout />} />
        <Route path="*" element={<NotFoundLayout />} />
      </Route>
    </Routes>
    </UserContext.Provider>
  )
}

export default App
