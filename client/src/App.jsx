import { useState, useEffect } from 'react'
import './styles//App.css'
import { BrowserRouter, Route, Routes, useNavigate, Navigate } from 'react-router-dom'

import { Navbar } from './components/Navbar'

import { HomeLayout, ConcertLayout, LoginLayout, NotFoundLayout, ReservationsLayout } from './components/Layout'

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
  const [authToken, setAuthToken] = useState(undefined);

  const [ConcertList, setConcertList] = useState([]);


  const [messageQueue, setMessageQueue] = useState([]);
  const [currentMessage, setCurrentMessage] = useState('');

  const handleErrors = (err) => {
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

    setMessageQueue(prevQueue => [...prevQueue, msg]);
    console.log(err);
  };

const renewToken = () => {
  API.getAuthToken().then((resp) => { setAuthToken(resp.token); } )
  .catch(err => {console.log("DEBUG: renewToken err: ",err)});
}

useEffect(() => {
  const checkAuth = async() => {
    try {
      //user info if already logged in
      const user = await API.getUserInfo();
      setLoggedIn(true);
      setUser(user);
      API.getAuthToken().then((resp) => { setAuthToken(resp.token); })
    } catch (err) {}
  };
  checkAuth();
}, []); 


  const handleLogin = (credentials) => {
    return new Promise(async (resolve, reject) => {
      try {
        const user = await API.logIn(credentials);
        setUser(user);
        setLoggedIn(true);
        renewToken();
        resolve({ code: 200, message: 'Login successful' });
      } catch (err) {
        reject(err);
      }
    });
  };


  const handleLogout = async () => {
    await API.logout();
    setLoggedIn(false);
    setAuthToken(undefined);
    // clean up everything
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, loggedIn }}>
    <Routes>
      <Route path="/" element={<Navbar logout={handleLogout} />}>
        <Route index element={<HomeLayout setConcertList={setConcertList} ConcertList={ConcertList} handleErrors={handleErrors}/>} />
        <Route path="/concert/:concertId" element={<ConcertLayout authToken={authToken} setAuthToken={setAuthToken} handleErrors={handleErrors} />} />
        <Route path="/login" element={!loggedIn ? <LoginLayout login={handleLogin} /> : <Navigate replace to='/' />} />
        <Route path="/reservations" element={ loggedIn ? <ReservationsLayout /> : <Navigate replace to='/' />} />
        <Route path="*" element={<NotFoundLayout />} />
      </Route>
    </Routes>
    </UserContext.Provider>
  )
}

export default App
