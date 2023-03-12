import { useEffect, useState } from 'react';
import './App.css';
import Home from './pages/home/Home';
import 'normalize.css'
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import Login from './pages/login/Login';
import Signup from './pages/signup/Signup';
import Nav from './components/Nav';
import { useAuthContext } from './hooks/useAuthContext';

function App() {
  const [ lat, setLat ] = useState<number | null>(null);
  const [ lon, setLon ] = useState<number | null>(null);
  const { state } = useAuthContext();

  useEffect(() => {
      if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition((position) => {
              setLat(position.coords.latitude);
              setLon(position.coords.longitude);
          },
          error => {
            // 위치를 허용하지 않았을 경우 기본값을 서울위치로 지정
            setLat(37.5665)
            setLon(126.9780)
          });
      } 
  }, [])

  return (
    <div style={{background: 'linear-gradient(to bottom, rgb(43, 192, 228), rgb(234, 236, 198))', height:'100vh'}}>
      <BrowserRouter>
        <Nav />
        <Routes>
          <Route path='/' element={lat && lon ? <Home lat={lat} lon={lon} /> : <div>loading...</div>} />
          <Route path='/login' element={state?.user ? <Navigate replace={true} to="/" /> : <Login/>} />
          <Route path='/signup' element={state?.user ? <Navigate replace={true} to="/" /> : <Signup/>} />
          <Route path='/closet' />
          <Route path='/calender' />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
