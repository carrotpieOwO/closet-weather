import { ClothItem } from "../../index.d";
import ECharts from 'echarts-for-react';
import { useStatistic } from "../../hooks/useStatistic";
import { Badge, Card, Col, Row, Typography } from "antd";
import clothIcons from "../../utils/clothIcons";
import styled from "styled-components";
import '../../utils/echart-theme'

const { Title, Text } = Typography;
const { outer, top, bottom } = clothIcons;
const CoverImage = styled.div<{image:string}>`
    overflow: hidden;
    height: 30px; 
    width: 20%;
    background-image: ${props => `url(${props.image})`};
    background-size:cover;
    background-repeat: no-repeat;
    background-position: center center;
    box-shadow: 0 1px 2px 0 rgb(0 0 0 / 3%), 0 1px 6px -1px rgb(0 0 0 / 2%), 0 2px 4px 0 rgb(0 0 0 / 2%);
`
export default function Dashboard({documents}:{documents:ClothItem[]}) {
    const { categoryCountsArr, pieOption, pieOption1, barOption, bestWorstCloth } = useStatistic(documents);

    return (
        <div >
            <Row gutter={30}>
                <Col xs={24} sm={17}>
                    <Title level={2}>내 옷장 점유율</Title>
                    <Row gutter={8}>
                        {
                            categoryCountsArr &&
                            categoryCountsArr.map(category => 
                                <Col xs={24} sm={8} key={category.name}>
                                    <Card bordered={false} style={{marginBottom: '10px'}}>
                                        <Row justify="space-between" align="middle" style={{margin: '0.2em 0'}}>
                                            <img src={
                                                category.name === 'outer' ? outer 
                                                : category.name === 'top' ? top
                                                : bottom} alt="outer" width='15%'/>
                                            <Title level={5} type="success" style={{margin:'0px'}}>{category.count}개</Title>
                                        </Row>    
                                        <Title>{category.percent}%</Title>
                                        <Text type="secondary">{category.name}</Text>
                                    </Card>
                                </Col>
                            )
                        }  
                    </Row>
                    {
                        pieOption && pieOption1 &&
                            <Card bordered={false} bodyStyle={{width: '100%'}}>
                                <Row>
                                    <Col xs={24} sm={12}>
                                        <ECharts 
                                            theme="myTheme"
                                            option={pieOption}
                                            opts={{  width: 'auto' }}
                                            style={{minWidth: '50%'}}
                                        />
                                    </Col>
                                        <Col xs={24} sm={12}>
                                        <ECharts 
                                            theme="myTheme"
                                            option={pieOption1}
                                            opts={{  width: 'auto' }}
                                            style={{minWidth: '50%'}}
                                        />
                                    </Col>
                                </Row>
                            </Card>
                    }
                    <Title level={2}>브랜드별 착용 횟수</Title>
                    {
                        barOption &&
                        <Card bordered={false} style={{margin: '10px 0'}}>
                            <ECharts
                                theme="myTheme"
                                option={barOption}
                            />
                        </Card>
                    }
                </Col>
                <Col xs={24} sm={7} style={{ minHeight: 'calc(100vh - 112px'}}>
                    <Title level={3}>가장 많이 입었어요</Title>
                    {
                        bestWorstCloth.bestCloth.map( (cloth, i) =>
                            cloth.wearCount! > 0 &&
                            <div key={`best-${i}`}>
                                <Badge.Ribbon text={i+1} color="purple" placement="start">
                                    <Card bordered={false} style={{margin: '10px 0'}}
                                        bodyStyle={{display: 'flex', alignItems: 'center', gap: '10px'}}
                                    >
                                    <CoverImage image={cloth.image}/>
                                       <Text strong>{cloth.title}</Text>
                                    </Card>
                                   
                                </Badge.Ribbon>
                                <div style={{textAlign:'right'}}>{cloth.wearCount}회 입었어요! 💜</div>
                            </div>
                        )
                    }
                    <Title level={3}>가장 적게 입었어요</Title>
                    {
                        bestWorstCloth.worstCloth.map((cloth, i) =>
                        <Badge.Ribbon text={i+1} color="pink" placement="start" key={`worst-${i}`}>
                            <Card bordered={false} style={{margin: '10px 0'}}
                                bodyStyle={{display: 'flex', alignItems: 'center', gap: '10px'}}
                            >
                                <CoverImage image={cloth.image}/>
                                <Text strong>{cloth.title}</Text>
                            </Card>
                            {
                                cloth.wearCount === 0 ?
                                <div style={{textAlign:'right'}}>
                                    한번도 안입었어요..🥲
                                </div> :
                                <div style={{textAlign:'right'}}>
                                    {cloth.wearCount}회 입었어요! 😔
                                </div> 
                            }
                        </Badge.Ribbon>
                        )
                    }
                </Col>
            </Row>
        </div>
    )
}