import axios from "axios";
import dayjs from "dayjs";
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import { useQueries } from "react-query";
import { positionProps } from "../index.d";
import 'dayjs/locale/ko'

dayjs.extend(utc);
dayjs.extend(timezone)

interface HourDataType {
    dt_txt: string;
    dt: number,
    main: {
      temp: number;
      temp_max: number;
      temp_min: number;
      feels_like: number;
    };
    weather: {
      icon: string;
      description: string;
    }[];
}

const BASE_PATH = 'https://api.openweathermap.org/data/2.5';
const APP_KEY = process.env.REACT_APP_WEATHER_KEY;

export const useWeather = ({lat, lon}:positionProps) => {
    // 1. 현재 날씨정보 
    // 2. 5일/3시간 날씨정보
    const result = useQueries([
        {
            queryKey: 'currentWeather',
            queryFn: () => axios.get(`${BASE_PATH}/weather?lat=${lat}&lon=${lon}&appid=${APP_KEY}&lang=kr&units=metric`),
            staleTime: 300000 
        },
        {
            queryKey: 'hourlyWeather',
            queryFn: () => axios.get(`${BASE_PATH}/forecast?lat=${lat}&lon=${lon}&appid=${APP_KEY}&lang=kr&units=metric`),
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
        // icon list: https://openweathermap.org/weather-conditions
        hourlyData = hourlyResult.list.slice(0, 5).map((data :HourDataType) => ({
            time: dayjs.unix(data.dt).format('YYYY-MM-DD HH'),
            temp: data.main.temp,
            icon: data.weather[0].icon,
            description: data.weather[0].description
        }));

        // 오늘 날씨데이터 중 최고온도, 최저온도 계산
        const maxTemp = Math.max(...todayList.map((data:HourDataType) => data.main.temp_max));
        const minTemp = Math.min(...todayList.map((data:HourDataType) => data.main.temp_min));
    
        // 현재 날씨데이터 중 화면에 쓸 데이터 추출
        currentData = {
            location: currentResult.name,
            description: currentResult.weather[0].description,
            icon: currentResult.weather[0].icon,
            currentTemp: currentResult.main.temp,
            todayMaxTmep: maxTemp,
            todayMinTemp: minTemp,
            feelsLikeTemp: currentResult.main.feels_like,
        }
    }

    return { isLoading, isError, currentData, hourlyData }
}