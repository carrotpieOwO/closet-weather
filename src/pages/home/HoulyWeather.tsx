interface HourDataProps {
    data: {
        time: string;
        temp: number;
        icon: string;
    }[]
}
  
export default function HourlyWeather({data}:HourDataProps) {
    return (
        <div>
            { 
                data.map( d => 
                    <div key={d.time}>
                        <p>icon: {d.icon}</p>
                        <p>temp: {d.temp}</p>
                        <p>time: {d.time}</p>
                    </div>
                )                
            }
        </div>
    );
}