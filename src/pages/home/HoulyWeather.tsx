import { Col, Row } from "antd";
import dayjs from "dayjs";
import styled from "styled-components";
import { HourDataType } from "../../index.d";

const Container = styled(Row)`
    width: 70%;
    background-color: rgba(255, 255, 255, .2);
    border-radius: 20px;
    padding: 30px;
    margin-top: 20px;
    justify-content: space-evenly;
    box-shadow: 0 1px 2px 0 rgb(0 0 0 / 3%), 0 1px 6px -1px rgb(0 0 0 / 2%), 0 2px 4px 0 rgb(0 0 0 / 2%);
`

interface HourDataProps {
    data: HourDataType[]
}
  
export default function HourlyWeather({data}:HourDataProps) {
    return (
        <Container>
            { 
                data.map( d => 
                    <Col key={d.time} xs={24} sm={8} md={4}>
                        <div style={{fontSize:'14px'}}>{dayjs(d.time).format('HH')}시</div>
                        <img src={`https://openweathermap.org/img/wn/${d.icon}.png`} alt={d.description} />
                        <div>{d.temp}°</div>       
                    </Col>
                )
            }
        </Container>
    );
}