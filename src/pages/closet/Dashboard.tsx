import { useState } from "react";
import { ClothItem } from "../../index.d";
import ECharts from 'echarts-for-react';
import { EChartOption } from "echarts";
import { useStatistic } from "../../hooks/useStatistic";
import { Col, Row } from "antd";

export default function Dashboard({documents}:{documents:ClothItem[]}) {
    const { categoryCounts, pieOption, pieOption1, barOption, bestWorstCloth } = useStatistic(documents);

    return (
        <div >

            <Row>
                <Col span={16} style={{background: '#fff'}}>
                {
                    pieOption && pieOption1 && barOption &&
                    <>
                        <ECharts 
                            option={pieOption}
                            opts={{  width: 500 }}
                        />
                        <ECharts
                        option={pieOption1}
                        opts={{  width: 500 }}
                        />
                        <ECharts
                            option={barOption}
                            // opts={{  width: 600 }}
                            //theme="purple-passion"
                        />
                    </>
                }
                </Col>
                
                <Col span={8}>
                </Col>
            </Row>
        </div>
    )
}