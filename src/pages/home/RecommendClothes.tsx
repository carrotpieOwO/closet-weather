import { useEffect, useState } from "react";
import { ClothItem } from "../../index.d";
import { Button, Col, Row, message } from "antd";
import styled from "styled-components";
import { ReloadOutlined, CheckOutlined } from '@ant-design/icons';
import { useFirestore } from "../../hooks/useFirestore";
import dayjs from "dayjs";
import { useRecommend } from "../../hooks/useReccomend";
import RecommendModal from "./RecommendModal";

const Container = styled.div`
    width: 70%;
    padding: 30px;
    margin-top: 20px;
    justify-content: center;
    margin-left: auto;
    margin-right: auto;
`
const CoverImage = styled.div<{image:string}>`
    overflow: hidden;
    height: 330px; 
    background-image: ${props => `url(${props.image})`};
    background-size:cover;
    border-radius: 20px;
    background-position: center;
    box-shadow: 0 1px 2px 0 rgb(0 0 0 / 3%), 0 1px 6px -1px rgb(0 0 0 / 2%), 0 2px 4px 0 rgb(0 0 0 / 2%);
`
interface TempProps {
    temp: number
    uid: string
}

export default function RecommendClothes({temp, uid}:TempProps) {
    const { outfit, randomizeCloth, changeCloth, chooseCloth, selectedCats } = useRecommend(uid, temp)
    const { setDocument, response : ootdResponse} = useFirestore('ootd');
    const { updateDocument, response : closetResponse } = useFirestore('closet');
    const [ messageApi, contextHolder ] = message.useMessage();

    // 추천목록 보여주는 모달
    const [ modalOpen, setModalOpen ] = useState(false);
   
    // 모달을 열고 선택한 카테고리의 추천리스트를 띄운다.
    const openModal = (item:ClothItem) => {
        changeCloth(item);
        setModalOpen(true);
    }

    // 바꿀 아이템을 선택하고 모달을 닫는다.
    const closeModal = (item:ClothItem) => {
        chooseCloth(item);
        setModalOpen(false);
    }

    // 오늘 입은 옷 기록
    const saveOotd = (item:ClothItem[]) => {
        setDocument( dayjs().format('YYYYMMDD'), uid, { ...item})
    }

    useEffect(() => {
        if(ootdResponse.success) {            
            // ootd를 성공적으로 저장하고 나면, 착용한 아이템의 wearCount를 증가시킨다. 
            const ids = outfit.map(cloth => cloth.id);
            ids.forEach(id => id && updateDocument(id));

            messageApi.open({
                type: 'success',
                content: '성공적으로 저장하였습니다!',
            });
        }
        
        ootdResponse.error && messageApi.open({
            type: 'error',
            content: ootdResponse.error as string,
        });
    }, [ootdResponse])


    useEffect(() => {
        closetResponse.error && messageApi.open({
            type: 'error',
            content: closetResponse.error as string,
        });
    }, [closetResponse])

    return (
        <>
            {contextHolder}
            <Container>
                {
                    outfit &&
                    <>
                        <Row style={{justifyContent:'center'}}>
                            {
                                outfit.map(item => 
                                    <Col xs={24} sm={24} md={24} lg={7} key={item.id} style={{marginRight: '10px'}}>
                                        <h3>{item.category}</h3>
                                        <CoverImage image={item.image}/>
                                        <Button shape="round" style={{position:'relative', bottom:'50px'}} 
                                        onClick={() => openModal(item)}>
                                            딴거 입을래 😥
                                        </Button>
                                    </Col>        
                                )
                            }
                        </Row>
                        <Row style={{display:'flex', justifyContent:'center', gap:'10px'}}>
                            <Button size="large" shape="circle" onClick={randomizeCloth}><ReloadOutlined /></Button>
                            <Button size="large" onClick={() => saveOotd(outfit)}> 최종결정 <CheckOutlined /></Button>
                        </Row>
                    </>
                }         
            </Container>
            <RecommendModal selectedCats={selectedCats} modalOpen={modalOpen} 
                setModalOpen={setModalOpen} closeModal={closeModal} />
    </>
    );
  }