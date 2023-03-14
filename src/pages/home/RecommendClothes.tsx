import { useEffect, useState } from "react";
import { useCollection } from "../../hooks/useCollection";
import { ClothItem, QueryProps } from "../../index.d";
import { getQuery, recommendCloths, updateItemInArray } from "../../utils/utils";
import { findParentLabel } from "../../utils/category";
import { Button, Col, Modal, Row, Tooltip, message } from "antd";
import styled from "styled-components";
import { ReloadOutlined, CheckOutlined } from '@ant-design/icons';
import { useFirestore } from "../../hooks/useFirestore";
import dayjs from "dayjs";

const Container = styled.div`
    width: 70%;
    padding: 30px;
    margin-top: 20px;
    justify-content: center;
    margin-left: auto;
    margin-right: auto;
`
const RecommendCltohImage = styled.img`
    width:100%;
    height: 100%;
    max-height: 300px;
    border-radius: 20px;
    box-shadow: 0 1px 2px 0 rgb(0 0 0 / 3%), 0 1px 6px -1px rgb(0 0 0 / 2%), 0 2px 4px 0 rgb(0 0 0 / 2%);
`
const ModalImage = styled.img`
    width: 100%;
    height: 100%;
    max-height: 200px;
    border-radius: 20px;
`
interface TempProps {
    temp: number
    uid: string
}

const getRandomCloth = ( clothList:ClothItem[]|[]) => {
    if ( clothList.length > 0) {
        return clothList[Math.floor(Math.random() * clothList.length)]
    } else {
        return null
    }
}

const defaultClothItemList = [{
    title: '',
    image: '',
    category: '',
    subCategory: '',
    brand: '',
    uid: '',
    id: '',
}];

export default function RecommendClothes({temp, uid}:TempProps) {
    const [ myQuery, setMyQuery ] = useState<QueryProps[]>(getQuery({ uid: uid }));
    const { documents, error, isLoading } = useCollection('closet', myQuery)
    const { setDocument, response : ootdResponse} = useFirestore('ootd');
    const { updateDocument, response : closetResponse } = useFirestore('closet');
    const [ messageApi, contextHolder ] = message.useMessage();

    // 추천목록의 각 카테고리별로 옷을 변경할 때 필요한 추천리스트
    const [ recommendedOuterList, setRecommendedOuterList ] = useState<ClothItem[]>([]);
    const [ recommendedTopList, setRecommendedTopList ] = useState<ClothItem[]>([]);
    const [ bottomList, setBottomList ] = useState<ClothItem[]>([]);

    // 추천되서 화면에 보여지는 outer, top, bottom
    const [ outfit, setOutfit ] = useState<ClothItem[]>(defaultClothItemList)

    // 추천목록 보여주는 모달
    const [ modalOpen, setModalOpen ] = useState(false);

    // 변경하기 클릭한 카테고리가 저장됨 => 모달오픈 시, 선택한 카테고리의 추천리스트를 보여주기 위함
    const [ selectedCats, setSelectedCats ] = useState <ClothItem[]>(defaultClothItemList)

    useEffect(() => {
        if (documents) {
            // documents를 불러오면, 의상리스트에서 기온에 맞는 outer, top, bottom리스트를 fitler한다.
            const { outerList, topList, bottomList } = recommendCloths(temp, documents)
            
            // 각 카테고리리를 state로 관리한다. => 카테고리별 추천리스트 모달에서 사용됨
            // 날이 더울 경우, outerlist는 생성되지 않으므로 예외처리해준다. 
            outerList.length > 0 && setRecommendedOuterList(outerList)
            setRecommendedTopList(topList)
            setBottomList(bottomList)
        }
    }, [documents])

    useEffect(() => {
        randomizeCloth()
    }, [recommendedOuterList, recommendedTopList, bottomList])

    // 카테고리별로 하나씩 랜덤으로 선택하여 최종 추천리스트를 완성한다.
    const randomizeCloth = () => {
        const outfitList = [getRandomCloth(recommendedOuterList), getRandomCloth(recommendedTopList), getRandomCloth(bottomList)];

        // null인 카테고리 최종목록에서 제거
        const newOutfitList: ClothItem[] = outfitList?.filter(outfit => outfit !== null) as ClothItem[]
        
        const keywords = ['나시', '슬립', '슬리브리스', 'sleeveless', '오버롤', '멜빵', 'overall', '뷔스티에', 'bustier']
        const bottomIndex = newOutfitList.length === 3 ? 2 : 1 
        
        if(newOutfitList[bottomIndex]) {
            const bottom = newOutfitList[bottomIndex]

            if (bottom.category === '원피스' || bottom.category === '점프슈트') {
                // 최종추천된 bottom이 나시원피스가 아닐경우 || 나시원피스이지만 25도 이상일 경우 top을 제거한다.
                const hasKeyword = keywords.some(keyword => bottom.title.toLowerCase().includes(keyword))

                if (!hasKeyword || (hasKeyword && temp >= 25)) {
                  newOutfitList.splice(bottomIndex-1, 1)
                }
            }
        }
        setOutfit(newOutfitList)
    }

    // 카테고리별 추천리스트 모달창을 연다.
    const changeCloth = (item:ClothItem) => {
        if(item) {
            const key = findParentLabel(item.category!);
            
            key === 'outer' &&  setSelectedCats(recommendedOuterList);
            key === 'top' && setSelectedCats(recommendedTopList);
            key === 'bottom' && setSelectedCats(bottomList);
    
            setModalOpen(true)
        }
    }

    // 카테고리별 추천리스트에서 의상 선택 시, 최종 추천리스트를 업데이트한다.
    const chooseCloth = (item:ClothItem) => {
        const key = findParentLabel(item.category!);
        let newOutfit = updateItemInArray(outfit, key ,item)
        
        // 최종 추천리스트가 1개이고(원피스일 경우), 원피스가 아닌 항목을 선택한다면, 상의를 최종추천리스트에 넣는다.
        if(outfit.length === 1 && (item.category !== '원피스' && item.category !== '점프슈트' )) {
            const top =  getRandomCloth(recommendedTopList);
            top && newOutfit.unshift(top)
        }
        
        // 최종 추천리스트가 1개 이상일 경우, 원피스를 선택하고 25도가 넘는다면 상의를 제거한다.
        if ((item.category === '원피스' || item.category === '점프슈트' ) && temp >= 25 && outfit.length > 1) {
            newOutfit.shift()
        }
        
        setOutfit(newOutfit)
        setModalOpen(false);
    }

    // 오늘 입은 옷 기록
    const saveOotd = (item:ClothItem[]) => {
        setDocument( dayjs().format('YYYYMMDD'), uid, { ...item})
    }

    useEffect(() => {
        if(ootdResponse.success) {            
            // 착용한 아이템의 wearCount를 증가시킨다. 
            const ids = outfit.map(cloth => cloth.id);
            ids.forEach(id => id && updateDocument(id));

            messageApi.open({
                type: 'success',
                content: '성공적으로 저장하였습니다!',
            });
        }
        
        ootdResponse.error && messageApi.open({
            type: 'error',
            content: error,
        });
    }, [ootdResponse])


    useEffect(() => {
        closetResponse.error && messageApi.open({
            type: 'error',
            content: error,
        });
    }, [closetResponse])

    return (
        <>
            {contextHolder}
            <Container>
                { isLoading && <div>날씨 데이터 받아오는 중</div> }
                {
                    outfit &&
                    <>
                        <Row style={{justifyContent:'center'}}>
                            {
                                outfit.map(item => 
                                    <Col xs={24} sm={24} md={7} key={item.id} style={{marginRight: '10px'}}>
                                        <h3>{item.category}</h3>
                                        <RecommendCltohImage src={item.image} alt={item.title}/>
                                        <Button shape="round" style={{position:'relative', bottom:'50px'}} 
                                        onClick={() => changeCloth(item)}>
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
        <Modal title="오늘의 추천 목록 🧶" centered open={modalOpen} width={'70%'}
            onCancel={() => setModalOpen(false)} footer={[]}
            bodyStyle={{ overflow: 'auto', maxHeight: '60vh' }}
        >
            <Row style={{justifyContent:'center'}}>
                {
                    selectedCats.map( item => 
                        <Col xs={12} sm={12} md={7} key={`modal-${item.id}`} style={{display:'grid', margin:'20px 10px 20px 0'}}>
                            <ModalImage src={item.image} alt={item.title} />
                            <Tooltip placement="top" title={item.title} >
                                <Button style={{marginLeft:'auto', marginRight:'auto', marginTop:'10px'}}
                                onClick={() => chooseCloth(item)}>이거 입을래</Button>
                            </Tooltip>
                        </Col>        
                    )    
                }
            </Row>
        </Modal>
    </>
    );
  }