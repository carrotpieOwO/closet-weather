import { Col, Empty, Row, Tag, Typography } from "antd"
import styled from "styled-components"
import { ClockCircleOutlined } from '@ant-design/icons';
import dayjs, { Dayjs } from "dayjs";
import weatherIcons from "../../utils/weatherIcons";
import { SelectedDaysOotd } from "../../index.d";

const { Title } = Typography;

const CoverImage = styled.div<{image:string}>`
    overflow: hidden;
    height: 150px; 
    width: 100%;
    background-image: ${props => `url(${props.image})`};
    background-size:cover;
    border-radius: 20px;
    background-repeat: no-repeat;
    background-position: center center;
    box-shadow: 0 1px 2px 0 rgb(0 0 0 / 3%), 0 1px 6px -1px rgb(0 0 0 / 2%), 0 2px 4px 0 rgb(0 0 0 / 2%);
`
const Cotainer = styled.div`
    margin: 30px;
    padding: 20px 30px;
    background:rgba(255,255,255,.3);
    border-radius: 20px;
    box-shadow: 0 1px 2px 0 rgb(0 0 0 / 3%), 0 1px 6px -1px rgb(0 0 0 / 2%), 0 2px 4px 0 rgb(0 0 0 / 2%);
`
const EmptyContainer = styled.div`
    height: 150px;
    display: flex;
    align-items: center;
    justify-content: center;
`
interface DetailProps {
    selectedOotd?: SelectedDaysOotd,
    selectedDate?: Dayjs
}
export default function Detail( {selectedOotd, selectedDate}:DetailProps ) {
    return (
        <>
        {
            selectedOotd && selectedDate ?
            <Cotainer>
                <Row>
                    <Col xs={24} md={12}>
                        <Row gutter={10} style={{alignItems: 'center'}}>
                            {
                                
                                selectedOotd.ootd.map( ootd => 
                                    <Col xs={24} sm={8} md={7} key={`cal-${ootd.id}`}>
                                        <CoverImage image={ootd.image} />
                                    </Col>    
                                )
                            }
                        </Row>
                    </Col>
                    <Col xs={24} md={12}>
                        <Row style={{justifyContent:'flex-end'}}>
                            <Col xs={24} md={7}>
                            <Title level={4} style={{marginBottom:0}}>{ dayjs(selectedDate).format('YYYY-MM-DD') }</Title>
                            <Title level={5} style={{margin:'0 0 1em 0'}}>{ selectedOotd.location }</Title>
                                <Tag color={selectedOotd.temp! > 23 ? 'red' : selectedOotd.temp! < 10 ? 'blue' : 'orange'}>{ selectedOotd.temp }°</Tag>
                                <Tag icon={<ClockCircleOutlined />} color="magenta">{ selectedOotd.time }</Tag>
                            </Col>
                            <Col xs={24} md={7}>
                            <img src={weatherIcons[`${selectedOotd.icon}`]} alt='weatherIcon' style={{maxHeight:'150px'}}/>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Cotainer>
            :
            <Cotainer>
               <EmptyContainer>
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
               </EmptyContainer>
            </Cotainer>
        }
        </>
    )
}