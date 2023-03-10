interface CurrentDataProps {
    data: {
        location: string;
        icon: string;
        description: string;
        currentTemp: number;
        todayMaxTmep: number;
        todayMinTemp: number;
        feelsLikeTemp: number;
    }
}

export default function CurrentWeather({data}:CurrentDataProps) {
    return (
        <div>
            <div>
                <h1>{data.location}</h1>
                <p>icon: {data.icon}</p>
                <p>description: {data.description}</p>
                <p>현재기온: {data.currentTemp}</p>
                <p>최고온도, 최저온도: {data.todayMaxTmep}, {data.todayMinTemp}</p>
                <p>체감온도: {data.feelsLikeTemp}</p>
            </div>  
        </div>
    );
}