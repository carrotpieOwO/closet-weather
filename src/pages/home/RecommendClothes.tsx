import { useEffect, useState } from "react";
import { useCollection } from "../../hooks/useCollection";
import { ClothItem, QueryProps } from "../../index.d";
import { filterCloth, getQuery } from "../../utils/utils";
import ClothList from "../closet/ClothList";
import { findParentLabel } from "../../utils/category";
import { Modal } from "antd";

interface TempProps {
    temp: number
    uid: string
}

const recommendCloths = (temp:number, documents:ClothItem[]):{outerList:ClothItem[], topList:ClothItem[], bottomList:ClothItem[]} => {
    let outerList, topList, bottomList = [];
    switch (true) {
        // todo : 하의, 원피스 조건 세분화하기
        case temp <= 5 :
            outerList = filterCloth(documents, '점퍼', ['패딩', '다운', '푸퍼', 'puffer', 'down'], true)
            
            let knitList = filterCloth(documents, '니트/스웨터', ['반팔', '숏', 'short'], false)
            let tshirtList = filterCloth(documents, '티셔츠', ['후드', '기모', 'hood'], true)
            topList = [...knitList, ...tshirtList]
            
            bottomList = filterCloth(documents, ['바지', '청바지'], [], false)
        
            return { outerList, topList, bottomList }
        
        case temp >= 5 && temp <= 8:
            let jumperList = filterCloth(documents, '점퍼', ['패딩', '다운', '푸퍼', 'puffer', 'down'], true)
            let coatList = filterCloth(documents, '코트', ['트렌치', 'trench', '바람막이', 'windbreak'], false)
            outerList = [...jumperList, ...coatList];
           
            let knitList2 = filterCloth(documents, '니트/스웨터', ['반팔', '숏', 'short'], false)
            let tshirtList2 = filterCloth(documents, '티셔츠', ['후드', 'hood', '맨투맨', 'sweatshirt'], true)
            topList = [...knitList2, ...tshirtList2]

            bottomList = filterCloth(documents, ['바지', '청바지'], [], false)

            return { outerList, topList, bottomList }
        
        case temp >= 8 && temp <= 11 :
            let jaketList = filterCloth(documents, '재킷', [], false)
            let coatList2 = filterCloth(documents, '코트', ['트렌치', 'trench', '바람막이', 'windbreak'], true)
            outerList = [...jaketList, ...coatList2];
           
            let knitList3 = filterCloth(documents, '니트/스웨터', ['반팔', '숏', 'short'], false)
            let tshirtList3 = filterCloth(documents, '티셔츠', ['후드', 'hood', '맨투맨', 'sweatshirt'], true)
            topList = [...knitList3, ...tshirtList3]

            bottomList = filterCloth(documents, ['바지', '청바지'], [], false)
        
            return { outerList, topList, bottomList }

        case temp >= 11 && temp <= 16 :
            let jaketList2 = filterCloth(documents, '재킷', [], false)
            let cardiganList = filterCloth(documents, '카디건', [],false)
            outerList = [...jaketList2, ...cardiganList];
           
            let knitList4 = filterCloth(documents, '니트/스웨터', [], false)
            let tshirtList4 = filterCloth(documents, '티셔츠', ['후드', 'hood', '맨투맨', 'sweatshirt'], true)
            topList = [...knitList4, ...tshirtList4]

            bottomList = filterCloth(documents, ['바지', '청바지', '스커트'], [], false)
        
            return { outerList, topList, bottomList }

        case temp >= 16 && temp <= 19 :            
            outerList = filterCloth(documents, '카디건', [],false)
            
            let knitList5 = filterCloth(documents, '니트/스웨터', [], false)
            let tshirtList5 = filterCloth(documents, '티셔츠', ['후드', 'hood', '기모', '반팔', '민소매', '나시', '슬리브리스', 'short', 'sleeveless'], false)
            topList = [...knitList5, ...tshirtList5]

            bottomList = filterCloth(documents, ['바지', '청바지', '스커트'], [], false)
        
            return { outerList, topList, bottomList }
        
        case temp >= 19 && temp <= 22 :  
            let tshirtList6 = filterCloth(documents, '티셔츠', ['후드', 'hood', '기모', '민소매', '나시', '슬리브리스', 'sleeveless'], false)
            let shirtList = filterCloth(documents, ['블라우스/셔츠', '셔츠/남방'], ['반팔', 'short'], false)
            let onepiceList = filterCloth(documents, ['원피스'], [], false)
            let jumpsuitList = filterCloth(documents, ['점프슈트'], [], false)
            topList = [...tshirtList6, ...shirtList, ...onepiceList, ...jumpsuitList]

            bottomList = filterCloth(documents, ['바지', '청바지', '스커트'], [], false)
        
            return { outerList: [], topList, bottomList }

        case temp >= 22 && temp <= 27 :  
            let tshirtList7 = filterCloth(documents, '티셔츠', ['반팔', 'short', '크롭', 'crop'], true)
            let shirtList2 = filterCloth(documents, ['블라우스/셔츠'], [], false)
            let onepiceList2 = filterCloth(documents, ['원피스'], [], false)
            let jumpsuitList2 = filterCloth(documents, ['점프슈트'], [], false)
            topList = [...tshirtList7, ...shirtList2, ...onepiceList2, ...jumpsuitList2]

            bottomList = filterCloth(documents, ['바지', '청바지', '스커트'], [], false)
        
            return { outerList: [], topList, bottomList }
        case temp >= 27 :  
            topList = filterCloth(documents, '티셔츠', ['반팔', 'short', '크롭', 'crop', '나시', '슬리브리스', '민소매', 'sleeveless'], true)
            bottomList = filterCloth(documents, ['바지', '청바지', '스커트'], [], false)
        
            return { outerList: [], topList, bottomList }
        default:
            return {outerList: [], topList: [], bottomList: []};
    }
}


const getRandomCloth = ( clothList:ClothItem[] ) => {
    return clothList[Math.floor(Math.random() * clothList.length)]
}

// 배열의 n번째 항목을 새로운 item으로 교체하는 함수 
const updateItemInArray = (array:ClothItem[], key:string, newItem:ClothItem) => {
    const index = key === 'outer' ? 0 : key === 'top' ? 1 : key === 'bottom' ? 2 : -1;

    return [
      ...array.slice(0, index),
      newItem,
      ...array.slice(index + 1)
    ];
  }

  
export default function RecommendClothes({temp, uid}:TempProps) {
    const [ myQuery, setMyQuery ] = useState<QueryProps[]>(getQuery({ uid: uid }));
    const { documents, error, isLoading } = useCollection('closet', myQuery)

    // 추천목록의 각 카테고리별로 옷을 변경할 때 필요한 추천리스트
    const [ outerlist, setOuterList ] = useState<ClothItem[] | null>(null);
    const [ toplist, setTopList ] = useState<ClothItem[] | null>(null);
    const [ bottomList, setBottomList ] = useState<ClothItem[] | null>(null);

    // 추천되서 화면에 보여지는 outer, top, bottom
    const [ outfit, setOutfit ] = useState<ClothItem[] | null>(null)

    // 추천목록 보여주는 모달
    const [ modalOpen, setModalOpen ] = useState(false);

    // 변경하기 클릭한 카테고리가 저장됨 => 모달오픈 시, 선택한 카테고리의 추천리스트를 보여주기 위함
    const [ selectedCategory, setSelectedCategory ] = useState('')

    useEffect(() => {
        if (documents) {
            const { outerList, topList, bottomList } = recommendCloths(temp, documents)
            setOuterList(outerList)
            setTopList(topList)
            setBottomList(bottomList)
            console.log('outerList',outerList, topList, bottomList )
            setOutfit([getRandomCloth(outerList), getRandomCloth(topList), getRandomCloth(bottomList)])
            // todo: top의 카테고리가 원피스로 나왔을 경우엔 bottom 빼주는 로직
        }
    }, [documents])

    const changeCloth = (item:ClothItem) => {
        if(item) {
            const key = findParentLabel(item.category!);
            setModalOpen(true)
            setSelectedCategory(key);
        }   
    }

    const chooseCloth = (item:ClothItem) => {
        if (outfit) {
            const key = findParentLabel(item.category!);

            const newOutfit = updateItemInArray(outfit, key ,item)
            
            setOutfit(newOutfit)
            setModalOpen(false);
        }
    }
 

    return (
      <div>
          {/* { isLoading && <div>날씨 데이터 받아오는 중</div> }
          { isError && <div>에러남</div> }
           */}
           {
                outfit &&
                <ClothList componentNm='reccomend' list={outfit} isLoading={isLoading} func={changeCloth} btnTitle='딴거 입을래'/>
           }
           
           <Modal
                title="Vertically centered modal dialog"
                centered
                open={modalOpen}
                // onOk={() => setModal2Open(false)}
                onCancel={() => setModalOpen(false)}
            >
                {
                    outerlist && selectedCategory === 'outer' ? <ClothList componentNm='reccomend-modal' list={outerlist} isLoading={isLoading} func={chooseCloth} btnTitle='이거 입을래'/>
                    : toplist && selectedCategory === 'top' ? <ClothList componentNm='reccomend-modal' list={toplist} isLoading={isLoading} func={chooseCloth} btnTitle='이거 입을래'/>
                    : bottomList && selectedCategory === 'bottom' && <ClothList componentNm='reccomend-modal' list={bottomList} isLoading={isLoading} func={chooseCloth} btnTitle='이거 입을래'/>

                }
            </Modal>
          
      </div>
    );
  }