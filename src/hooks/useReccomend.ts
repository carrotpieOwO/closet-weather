import dayjs from "dayjs";
import { useEffect, useState } from "react"
import { ClothItem, DefaultClothType, QueryProps } from "../index.d"
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

interface warnMessageType {
    head: string,
    content: string[]
}
type RecommendClothType = string | ClothItem[] | string[] | DefaultClothType;
type clothType = ClothItem | string | null;

export const useRecommend = (uid:string, temp:number) => {
    // 추천되서 최종적으로 화면에 보여지는 outer, top, bottom
    const [ outfit, setOutfit ] = useState<ClothItem[]>(defaultClothItemList);

    const [ myQuery, setMyQuery ] = useState<QueryProps[]>(getQuery({ uid: uid }));
    const [ ootdQuery, setOotdQuery ] = useState<QueryProps[]>(getQuery({ uid: uid, path:'id', search: dayjs().format('YYYYMMDD')}))

    const { documents : closetDocuments } = useCollection('closet', myQuery) //closet 목록 불러오기
    const { documents : ootdDocument } = useCollection('ootd', ootdQuery) // ootd 불러오기
    
    // 추천목록의 각 카테고리별로 옷을 변경할 때 필요한 추천리스트
    const [ recommendedOuterList, setRecommendedOuterList ] = useState<ClothItem[] | string>([]);
    const [ recommendedTopList, setRecommendedTopList ] = useState<ClothItem[] | string>([]);
    const [ recommendedBottomList, setRecommendedBottomList ] = useState<ClothItem[] | string>([]);

    // 변경하기 클릭한 카테고리가 저장됨 => 모달오픈 시, 선택한 카테고리의 추천리스트를 보여주기 위함
    const [ selectedCats, setSelectedCats ] = useState <ClothItem[]>(defaultClothItemList)

    // 선택된 코디에 따른 메시지
    const [ stateMessage, setStateMessage ] = useState('');
    const [ warnMessage, setWarnMessage ] = useState<warnMessageType[]>([]);

    // 추천 옷 리스트를 생성한다. 
    const recommendClothList = (clothList:RecommendClothType, type:string) => {
        if( Array.isArray(clothList)) {
            // 추천된 옷 리스트가 존재하는 경우
            type === '아우터' && clothList.length > 0 && setRecommendedOuterList(clothList as ClothItem[])
            type === '상의' && clothList.length > 0 && setRecommendedTopList(clothList as ClothItem[])
            type === '하의' && clothList.length > 0 && setRecommendedBottomList(clothList as ClothItem[])
        } else {
            // 추천옷이 없는 경우(기온별로 추천된 기본아이콘 주소값이 들어가있음)
            if (typeof clothList !== 'string') {
                type === '아우터' && setRecommendedOuterList(clothList.image)
                type === '상의' && setRecommendedTopList(clothList.image)
                type === '하의' && setRecommendedBottomList(clothList.image)
                
                // 추천옷이 없는 경우 warning message를 생성하여 text로 옷을 추천한다. 
                setWarnMessage(prev => [...prev, { head: `오늘 기온에 맞는 ${type}가 없습니다. 오늘의 추천 ${type}는 `, 
                content: clothList.description}])
            } 
        }
    }

    useEffect(() => {
        if (closetDocuments) {
            // documents를 불러오면, 의상리스트에서 기온에 맞는 outer, top, bottom리스트를 fitler한다.
            setWarnMessage([]); // warning message 초기화
            let { outerList, topList, bottomList } = recommendCloths(temp, closetDocuments)

            // outer는 더운날 undefined로 들어온다.
            outerList && recommendClothList(outerList, '아우터')
            recommendClothList(topList, '상의')
            recommendClothList(bottomList, '하의')
            
        }
    }, [closetDocuments])

    useEffect(() => {
        // 저장된 ootd가 있다면, 저장된걸 보여주고
        if(ootdDocument && ootdDocument.length >= 1) {
            const savedOutfit = Object.values(ootdDocument[0])
                .filter(item => item instanceof Object && 'title' in item) as ClothItem[]
            
            setOutfit(savedOutfit)
            setStateMessage('오늘 입은 옷이에요! ✨')
        } else {
            // 없으면 랜덤으로 보여준다. 
            randomizeCloth()
            setStateMessage('오늘의 추천 옷! 👀')
        }
    }, [recommendedOuterList, recommendedTopList, recommendedBottomList, ootdDocument])
    
    const randomizeCloth = () => {
        // array일 경우(추천옷 리스트가 있는 경우) 추천리스트 중 하나를 선택하고, 
        // string일 경우(추천옷이 없어서 기본아이콘을 보여줄 경우) 기본아이콘을 보여준다.)
        const outerList:clothType = Array.isArray(recommendedOuterList) ? getRandomCloth(recommendedOuterList) : recommendedOuterList
        const topList:clothType = Array.isArray(recommendedTopList) ? getRandomCloth(recommendedTopList) : recommendedTopList
        const bottomList:clothType = Array.isArray(recommendedBottomList) ? getRandomCloth(recommendedBottomList) : recommendedBottomList

        const outfitList = [outerList, topList, bottomList]

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
        setStateMessage('랜덤으로 골라봐요! 🎲');
    }
    
    // 카테고리별 추천리스트 모달창에 표시될 데이터
    const changeCloth = (item:ClothItem) => {
        if(item) {
            const key = findParentLabel(item.category!);
            
            key === 'outer' && Array.isArray(recommendedOuterList) && setSelectedCats(recommendedOuterList);
            key === 'top' && Array.isArray(recommendedTopList) &&  setSelectedCats(recommendedTopList);
            key === 'bottom' && Array.isArray(recommendedBottomList) &&  setSelectedCats(recommendedBottomList);
        }
    }
    // 카테고리별 추천리스트에서 의상 선택 시, 최종 추천리스트를 업데이트한다.
    const chooseCloth = (item:ClothItem) => {
        const key = findParentLabel(item.category!);
        let newOutfit = updateItemInArray(outfit, key ,item)
        
        // 최종 추천리스트가 1개이고(원피스일 경우), 원피스가 아닌 항목을 선택한다면, 상의를 최종추천리스트에 넣는다.
        if( outfit.length === 1 && 
            typeof outfit[0] !== 'string' && 
            (item.category !== '원피스' && item.category !== '점프슈트' )) {
                const top =  getRandomCloth(recommendedTopList as ClothItem[]);
                top && newOutfit.unshift(top)
        }
        
        // 최종 추천리스트가 1개 이상일 경우, 원피스를 선택하고 25도가 넘는다면 상의를 제거한다.
        if ((item.category === '원피스' || item.category === '점프슈트' ) && temp >= 25 && outfit.length > 1) {
            newOutfit.shift()
        }
        
        setOutfit(newOutfit)
        temp < 8 ? setStateMessage('히트텍과 기타 방한용품도 함께 착용해주세요 🥶')
        : setStateMessage('좋은 선택입니다 😊')
    }

    return { outfit, randomizeCloth, changeCloth, chooseCloth, selectedCats, stateMessage, warnMessage }
}