import { useEffect, useState } from "react";
import { ClothItem, CurrentDataType } from "../../index.d";
import { Button, Col, Row, message, Alert, Tag } from "antd";
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
const MyAlert = styled(Alert)`
    margin: 0 auto 10px auto;
    width: 90%;
    .ant-alert-content {
        flex: none;
    }
`
interface TempProps {
    temp: CurrentDataType
    uid: string
}

export default function RecommendClothes({temp, uid}:TempProps) {
    const { outfit, randomizeCloth, changeCloth, chooseCloth, selectedCats, stateMessage, warnMessage } = useRecommend(uid, 30)
    const { setDocument, response : ootdResponse} = useFirestore('ootd');
    const { updateDocument, response : closetResponse } = useFirestore('closet');
    const [ messageApi, contextHolder ] = message.useMessage();
    // ootd 저장 및 랜덤버튼 보여주기 여부
    const [ showBtns, setShowBtns ] = useState(false);
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
        setDocument( dayjs().format('YYYYMMDD'), uid, { ...item, ...temp})
    }

    // outfit이 모드 string일 경우(추천된 옷이 없을 경우) 랜덤/저장하기 버튼 숨김처리
    useEffect(() => {
        const isAllString = outfit.every((item) => typeof item === 'string');
        setShowBtns(!isAllString)
    }, [outfit])

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

    // warn message(추천할 옷이 없을 경우 발생) 스타일링
    const createWarnMessageStyle = (msg:{head:string, content:string[]}) => {
        return (
            <div style={{display: 'flex'}}>
                <div>{msg.head}&nbsp;</div>
                {
                    msg.content.map( (content, i) => <Tag key={`warn-${i}`}>{content}</Tag>)
                } 입니다.
            </div>
        )
    }

    return (
        <>
            {contextHolder}
            <Container>
                {
                    outfit &&
                    <>
                        <Row style={{justifyContent:'center', alignItems: 'center'}}>
                            {
                                outfit.map((item, i) => 
                                    typeof item === 'string' ?
                                    <Col xs={24} sm={24} md={24} lg={7} key={i} style={{marginRight: '10px'}}>
                                        <CoverImage image={item} style={{marginBottom: '20px'}}/>
                                    </Col>
                                    :
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
                        {
                            warnMessage &&
                                warnMessage.map( msg => 
                                    <MyAlert key={msg.head} message={createWarnMessageStyle(msg)} type="warning" showIcon/>        
                                )
                        }
                        <Alert message={stateMessage} type="success" style={{ width: '90%', margin: '0 auto 30px auto' }}/>
                        { 
                            showBtns &&
                            <Row style={{display:'flex', justifyContent:'center', gap:'10px'}}>
                                <Button size="large" shape="circle" onClick={randomizeCloth}><ReloadOutlined /></Button>
                                <Button size="large" onClick={() => saveOotd(outfit)}> 최종결정 <CheckOutlined /></Button>
                            </Row>
                        }
                    </>
                }         
            </Container>
            <RecommendModal selectedCats={selectedCats} modalOpen={modalOpen} 
                setModalOpen={setModalOpen} closeModal={closeModal} />
    </>
    );
  }