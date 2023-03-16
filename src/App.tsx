import { useEffect, useState } from 'react';
import './App.css';
import Home from './pages/home/Home';
import 'normalize.css'
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import Login from './pages/login/Login';
import Signup from './pages/signup/Signup';
import Nav from './components/Nav';
import { useAuthContext } from './hooks/useAuthContext';
import Closet from './pages/closet/Closet';
import styled from 'styled-components';
import OotdCalendar from './pages/calendar/OotdCalendar';
import Loading from './pages/home/Loading';

const Container = styled.div`
  background: linear-gradient(to bottom, rgb(43, 192, 228), rgb(234, 236, 198));
  min-height: 100vh;
`
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
    <Container>
      <BrowserRouter>
        <Nav />
        <Routes>
          <Route path='/' element={lat && lon ? <Home lat={lat} lon={lon} /> : <Loading/> } />
          <Route path='/login' element={state?.user ? <Navigate replace={true} to="/" /> : <Login/>} />
          <Route path='/signup' element={state?.user ? <Navigate replace={true} to="/" /> : <Signup/>} />
          <Route path='/closet' element={ state?.user && <Closet/>}/>
          <Route path='/calendar'element={state?.user?.uid && <OotdCalendar uid={state.user.uid}/>} />
        </Routes>
      </BrowserRouter>
    </Container>
  );
}

export default App;
