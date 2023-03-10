import { useWeather } from "../../hooks/useWeather";
import CurrentWeather from "./CurrentWeather";
import HourlyWeather from "./HoulyWeather";

export interface positionProps {
    lat: number
    lon: number
}

interface HourDataType {
    time: string
    temp: number
    icon: string
}
interface WeatherProps {
    isLoading: boolean
    isError: boolean
    currentData: any
    hourlyData: HourDataType[]
}

export default function Home({lat, lon}:positionProps) {
  const { isLoading, isError, currentData, hourlyData }:WeatherProps = useWeather({lat, lon})
  return (
    <div>
        { isLoading && <div>날씨 데이터 받아오는 중</div> }
        { isError && <div>에러남</div> }
        {
            currentData && hourlyData &&
            <>
                <CurrentWeather data={currentData}/>
                <HourlyWeather data={hourlyData}/>
            </>
        }      
    </div>
  );
}