import { ClothItem } from "../../index.d";
import ECharts from 'echarts-for-react';
import { statistic } from "../../utils/statistic";
import { Card, Col, Empty, Row, Typography } from "antd";
import clothIcons from "../../utils/clothIcons";
import styled from "styled-components";
import '../../utils/echart-theme'
import RankingCard from "./RankingCard";

const { Title, Text } = Typography;
const { outer, top, bottom } = clothIcons;
const EmptyContainer = styled.div`
    height: calc(100vh - 63px);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
`
export default function Dashboard({documents}:{documents:ClothItem[]}) {
    const { categoryCountsArr, categoryPieOption, brandPieOption, barOption, bestWorstCloth } = statistic(documents);
    
    return (
        <div >
            {
                documents.length > 0 ? 
                <Row gutter={30}>
                    <Col xs={24} sm={17}>
                        <Title level={2}>내 옷장 점유율</Title>
                        <Row gutter={8}>
                            {
                                categoryCountsArr &&
                                categoryCountsArr.map(category => 
                                    <Col xs={24} sm={8} key={category.name}>
                                        <Card bordered={false} style={{marginBottom: '1.5em'}}>
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
                            categoryPieOption && brandPieOption &&
                                <Card bordered={false} bodyStyle={{width: '100%'}}>
                                    <Row>
                                        <Col xs={24} sm={12}>
                                            <ECharts 
                                                theme="myTheme"
                                                option={categoryPieOption}
                                                style={{minWidth: '50%'}}
                                            />
                                        </Col>
                                            <Col xs={24} sm={12}>
                                            <ECharts 
                                                theme="myTheme"
                                                option={brandPieOption}
                                                style={{minWidth: '50%'}}
                                            />
                                        </Col>
                                    </Row>
                                </Card>
                        }
                        <Title level={2}>브랜드별 착용 횟수</Title>
                        {
                            barOption ?
                            <Card bordered={false} style={{margin: '10px 0'}}>
                                <ECharts
                                    theme="myTheme"
                                    option={barOption}
                                />
                            </Card>
                            :
                            <Card bordered={false} style={{margin: '10px 0', textAlign:'center'}}>
                                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                                <Text type="secondary">착용한 옷이 없습니다.</Text>
                            </Card>
                        }
                    </Col>
                    <Col xs={24} sm={7} style={{ minHeight: 'calc(100vh - 112px'}}>
                        <Title level={3}>가장 많이 입었어요</Title>
                        <RankingCard clothList={bestWorstCloth.bestCloth} type='best'/>
                        <Title level={3}>가장 적게 입었어요</Title>
                        <RankingCard clothList={bestWorstCloth.worstCloth} type='worst'/>
                    </Col>
                </Row>
                :
                <EmptyContainer>
                    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                    <Text type="secondary">옷장에 옷을 등록해 주세요.</Text>
               </EmptyContainer>
            }
            
        </div>
    )
}