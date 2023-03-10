import axios from "axios";
import dayjs from "dayjs";
import { useQueries } from "react-query";
import { positionProps } from "../pages/home/Home";


interface HourDataType {
    dt_txt: string;
    main: {
      temp: number;
      temp_max: number;
      temp_min: number;
      feels_like: number;
    };
    weather: {
      icon: string;
    }[];
}

const BASE_PATH = 'https://api.openweathermap.org/data/2.5';
const APP_KEY = process.env.REACT_APP_WEATHER_KEY;
const KELVIN_TO_CELSIUS = 273.15 // 절대온도 -> 섭씨로 변환하기 위한 상수값

export const useWeather = ({lat, lon}:positionProps) => {
    // 1. 현재 날씨정보 
    // 2. 5일/3시간 날씨정보
    const result = useQueries([
        {
            queryKey: 'currentWeather',
            queryFn: () => axios.get(`${BASE_PATH}/weather?lat=${lat}&lon=${lon}&appid=${APP_KEY}&lang=kr`),
            staleTime: 300000 

        },
        {
            queryKey: 'hourlyWeather',
            queryFn: () => axios.get(`${BASE_PATH}/forecast?lat=${lat}&lon=${lon}&appid=${APP_KEY}&lang=kr`),
            staleTime: 300000
        },  
    ])

    const isLoading = result.some((result) => result.isLoading);
    const isError = result.some((result) => result.error);

    let currentData;
    let hourlyData;

    if (!isLoading && !isError) {
        const currentResult = result[0].data?.data;
        const hourlyResult = result[1].data?.data;
        
        // 5일/3시간 날씨정보에서 오늘 날씨데이터 추출
        const todayList = hourlyResult.list.filter(
            (data: HourDataType) => dayjs(data.dt_txt).isSame(dayjs(), 'day')
        );

        // 시간별 기온, 아이콘 추출
        hourlyData = todayList.map((data :HourDataType) => ({
            time: dayjs(data.dt_txt).format('HH'),
            temp: (data.main.temp - KELVIN_TO_CELSIUS).toFixed(1),
            icon: data.weather[0].icon
        }));

        // 오늘 날씨데이터 중 최고온도, 최저온도 계산
        const maxTemp = (Math.max(...todayList.map((data:HourDataType) => data.main.temp_max)) - KELVIN_TO_CELSIUS).toFixed(1)
        const minTemp = (Math.min(...todayList.map((data:HourDataType) => data.main.temp_min)) - KELVIN_TO_CELSIUS).toFixed(1)
    
        // 현재 날씨데이터 중 화면에 쓸 데이터 추출
        currentData = {
            location: currentResult.name,
            description: currentResult.weather[0].description,
            icon: currentResult.weather[0].icon,
            currentTemp: (currentResult.main.temp - KELVIN_TO_CELSIUS).toFixed(1),
            todayMaxTmep: maxTemp,
            todayMinTemp: minTemp,
            feelsLikeTemp: (currentResult.main.feels_like - KELVIN_TO_CELSIUS).toFixed(1),
        }
    }

    return { isLoading, isError, currentData, hourlyData }
}