import { useWeather } from "../../hooks/useWeather";
import CurrentWeather from "./CurrentWeather";
import HourlyWeather from "./HoulyWeather";
import { HourDataType, PositionProps, CurrentDataType } from "../../index.d";
import RecommendClothes from "./RecommendClothes";
import { useAuthContext } from "../../hooks/useAuthContext";
import styled from "styled-components";
import RecommendForGuest from "./RecommendForGuest";


interface WeatherProps {
  isLoading: boolean
  isError: boolean
  currentData: CurrentDataType | undefined
  hourlyData: HourDataType[]
}

const Container = styled.div`
  text-align: center;
  justify-content: center;
  display: flex;
  flex-direction: column;
  align-items: center;
`
export default function Home({lat, lon}:PositionProps) {
  const { isLoading, isError, currentData, hourlyData }:WeatherProps = useWeather({lat, lon})
  const { state } = useAuthContext();

  return (
    <div>
        { isLoading && <div>날씨 데이터 받아오는 중</div> }
        { isError && <div>에러남</div> }
        {
            currentData && hourlyData &&
            <Container>
                <h1>{currentData.location}</h1>
                <CurrentWeather data={currentData}/>
                <HourlyWeather data={hourlyData}/>
            </Container>
        }
         <Container>
          {
            currentData && state?.user && 
              <RecommendClothes temp={currentData.currentTemp} uid={state.user.uid}/>
          }
          {
            currentData && !state?.user &&
              <RecommendForGuest temp={currentData.currentTemp} />
          }
        </Container>
        
    </div>
  );
}