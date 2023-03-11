import weatherIcons from "../../utils/weatherIcons";
import { Col, Row } from "antd";
import { Typography } from 'antd';

const { Title } = Typography;

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
        <Row align='middle'>
            <Col xs={24} md={16}>
                <img src={weatherIcons[`${data.icon}`]} alt={data.description} width='100%'/>
            </Col>
            <Col xs={24} md={8}>
                <div>{data.description}</div>
                <Title>{data.currentTemp}°</Title>
                <p>체감온도 🌡️{data.feelsLikeTemp}°</p>
            </Col>
        </Row>
    );
}