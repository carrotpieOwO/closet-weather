import { useEffect, useState } from 'react';
import './App.css';
import Home from './pages/home/Home';


function App() {
  const [ lat, setLat ] = useState<number | null>(null);
  const [ lon, setLon ] = useState<number | null>(null);

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
    <div className="App">
      {
        lat && lon ? <Home lat={lat} lon={lon}/>
        : <div>loading...</div>
      }
    </div>
  );
}

export default App;
