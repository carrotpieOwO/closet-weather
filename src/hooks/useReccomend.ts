import dayjs from "dayjs";
import { useEffect, useState } from "react"
import { ClothItem, QueryProps } from "../index.d"
import { findParentLabel } from "../utils/category";
import { getQuery, recommendCloths, updateItemInArray } from "../utils/utils";
import { useCollection } from "./useCollection";

const defaultClothItemList = [{
    title: '',
    image: '',
    category: '',
    subCategory: '',
    brand: '',
    uid: '',
    id: '',
}];

const getRandomCloth = ( clothList:ClothItem[]|[]) => {
    if ( clothList.length > 0) {
        return clothList[Math.floor(Math.random() * clothList.length)]
    } else {
        return null
    }
}

export const useRecommend = (uid:string, temp:number) => {
    // 추천되서 최종적으로 화면에 보여지는 outer, top, bottom
    const [ outfit, setOutfit ] = useState<ClothItem[]>(defaultClothItemList);

    const [ myQuery, setMyQuery ] = useState<QueryProps[]>(getQuery({ uid: uid }));
    const [ ootdQuery, setOotdQuery ] = useState<QueryProps[]>(getQuery({ uid: uid, path:'id', search: dayjs().format('YYYYMMDD')}))

    const { documents : closetDocuments } = useCollection('closet', myQuery) //closet 목록 불러오기
    const { documents : ootdDocument } = useCollection('ootd', ootdQuery) // ootd 불러오기
    
    // 추천목록의 각 카테고리별로 옷을 변경할 때 필요한 추천리스트
    const [ recommendedOuterList, setRecommendedOuterList ] = useState<ClothItem[]>([]);
    const [ recommendedTopList, setRecommendedTopList ] = useState<ClothItem[]>([]);
    const [ recommendedBottomList, setRecommendedBottomList ] = useState<ClothItem[]>([]);

    // 변경하기 클릭한 카테고리가 저장됨 => 모달오픈 시, 선택한 카테고리의 추천리스트를 보여주기 위함
    const [ selectedCats, setSelectedCats ] = useState <ClothItem[]>(defaultClothItemList)

    // 선택된 코디에 따른 메시지
    const [ stateMessage, setStateMessage ] = useState('');

    useEffect(() => {
        if (closetDocuments) {
            // documents를 불러오면, 의상리스트에서 기온에 맞는 outer, top, bottom리스트를 fitler한다.
            const { outerList, topList, bottomList } = recommendCloths(temp, closetDocuments)
            
            // 각 카테고리리를 state로 관리한다. => 카테고리별 추천리스트 모달에서 사용됨
            // 날이 더울 경우, outerlist는 생성되지 않으므로 예외처리해준다. 
            outerList.length > 0 && Array.isArray(outerList) && setRecommendedOuterList(outerList)
            Array.isArray(topList) && setRecommendedTopList(topList)
            Array.isArray(bottomList) && setRecommendedBottomList(bottomList)
        }
    }, [closetDocuments])

    useEffect(() => {
        // 저장된 ootd가 있다면, 저장된걸 보여주고
        if(ootdDocument && ootdDocument.length >= 1) {
            console.log('ootdDocument', ootdDocument)
            const savedOutfit = Object.values(ootdDocument[0])
                .filter(item => item instanceof Object && 'title' in item) as ClothItem[]
            
            setOutfit(savedOutfit)
            setStateMessage('오늘 입은 옷이에요! ✨')
        } else {
            // 없으면 랜덤으로 보여준다. 
            randomizeCloth()
            setStateMessage('오늘의 추천 옷!')
        }
    }, [recommendedOuterList, recommendedTopList, recommendedBottomList, ootdDocument])
    
    const randomizeCloth = () => {
        const outfitList = [
            getRandomCloth(recommendedOuterList), 
            getRandomCloth(recommendedTopList), 
            getRandomCloth(recommendedBottomList)
        ];

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
        setOutfit(newOutfitList);
        setStateMessage('랜덤으로 골라봐요!');
    }
    
    // 카테고리별 추천리스트 모달창에 표시될 데이터
    const changeCloth = (item:ClothItem) => {
        if(item) {
            const key = findParentLabel(item.category!);
            
            key === 'outer' &&  setSelectedCats(recommendedOuterList);
            key === 'top' && setSelectedCats(recommendedTopList);
            key === 'bottom' && setSelectedCats(recommendedBottomList);
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
        temp < 8 && setStateMessage('히트텍과 기타 방한용품도 함께 착용해주세요 🥶')
    }

    return { outfit, randomizeCloth, changeCloth, chooseCloth, selectedCats, stateMessage }
}