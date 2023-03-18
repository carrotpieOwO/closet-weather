import { useEffect, useState } from "react";
import { ClothItem } from "../../index.d";
import { Badge, Button, Col, Row, Typography } from 'antd';
import styled from "styled-components";
import ClothList from "./ClothList";
import Shop from "./Shop";
import { statistic } from "../../utils/statistic";

const { Title } = Typography;

const CoverImage = styled.div<{image:string}>`
    overflow: hidden;
    height: 200px; 
    width: 100%;
    background-image: ${props => `url(${props.image})`};
    background-size:cover;
    border-radius: 20px;
    background-repeat: no-repeat;
    background-position: center center;
    box-shadow: 0 1px 2px 0 rgb(0 0 0 / 3%), 0 1px 6px -1px rgb(0 0 0 / 2%), 0 2px 4px 0 rgb(0 0 0 / 2%);
`

interface ClosetContentPrams {
    documents: ClothItem[];
    deleteDoc: (item:ClothItem) => void;
    uid: string
}

export default function ClosetContent ({documents, deleteDoc, uid}:ClosetContentPrams) {
    const [ open, setOpen ] = useState(false);
    const [ bestCloth, setBestCloth ] = useState<ClothItem[]>([])
    const { bestWorstCloth } = statistic(documents);

    useEffect(() => {
        const best = bestWorstCloth.bestCloth.filter(cloth => cloth.wearCount)
        setBestCloth(best)
    }, [documents])
    
    return (
        <>
            <div style={{ padding: 24, minHeight: 360 }}>
                <Button onClick={() => setOpen(true)} style={{marginBottom: '30px'}}>👔 옷 넣기</Button>
                {
                    bestCloth.length > 0 &&
                    <>
                        <Title level={3}>가장 많이 입었어요! 👑</Title>
                        <Row style={{marginBottom:'30px'}}>
                        {
                            bestCloth.map((cloth, i) => 
                                <Col xs={24} sm={7} md={7} lg={7} key={`best-${cloth.id}`} style={{margin: '10px'}}>
                                    <Badge.Ribbon text={`${i+1} 등`} color="pink" placement='start'>
                                        <CoverImage image={cloth.image}/>
                                    </Badge.Ribbon>
                                </Col>
                            )
                        }
                        </Row>
                    <Title level={3}>모두보기 👇🏻</Title>
                    </>
                }
                {
                    documents &&
                    <ClothList componentNm='closet' list={documents} func={deleteDoc} btnTitle='삭제'/>         
                }
            </div>
            <Shop open={open} setOpen={setOpen} uid={uid}/>
        </>
    )
}