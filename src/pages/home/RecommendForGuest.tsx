
import { Col, Row, Typography } from "antd";
import styled from "styled-components";
import { recommendCloths } from "../../utils/utils"
import { InfoCircleTwoTone } from '@ant-design/icons';

const Container = styled(Row)`
    justify-content: center;
    width: 80%;
    margin-top: 50px;
`
const Description = styled.div`
    width: 65%;
    background-color: rgba(238, 205, 163, .5);
    color: #374957;
    border-radius: 10px;
    padding: 30px 15px;
    margin-top: 50px;
    box-shadow: 0 1px 2px 0 rgb(0 0 0 / 3%), 0 1px 6px -1px rgb(0 0 0 / 2%), 0 2px 4px 0 rgb(0 0 0 / 2%);
`
const { Title } = Typography;

export default function RecommendForGuest ({temp}:{temp:number}) {

    const cloths = recommendCloths(temp);
    const  visibleClothesList= Object.entries(cloths)
        .filter(([ key, value ]) => value !== 'not-exist' && key !== 'description')
        .map(([ key, value ]) => value)
    const description = Object.keys(cloths).filter(key => key === 'description');
    console.log('cloths',description)
    return (
        <>
            <Description>
                <Title level={5} style={{marginTop:0}}>
                    <InfoCircleTwoTone  twoToneColor="#eb2f96" style={{marginRight: '.5em'}}/>
                    로그인하면 등록한 옷으로 추천해줍니다! 
                </Title>
                🧢 오늘의 추천 의상: { cloths.description }
            </Description>
            
            <Container>
                {
                    visibleClothesList.map( (cloth, i) => 
                        <Col xs={24} sm={24} md={7} lg={7} key={i}>
                            <img src={cloth} alt='recommendCloth' width='70%'/>
                        </Col>
                    )
                }
            </Container>
        </>
        
    )
}