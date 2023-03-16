import { WhereFilterOp } from "firebase/firestore";
import { ClothItem, DefaultClothType, QueryProps } from "../index.d";
import clothIcons from "./clothIcons";

interface Props {
    uid: string,
    path?: string,
    where?: WhereFilterOp | WhereFilterOp[],
    search?: string | string[] | Date[]
}

function isStringrArray(arr: any[]): arr is string[] {
    return arr.every((item) => typeof item === "string");
}

function isDateArray(arr: any[]): arr is Date[] {
    return arr.every((item) => item instanceof Date);
}

// firebase 쿼리문 생성 함수
export const getQuery = ({uid, path, where, search}: Props):QueryProps[] => {
    if (search && typeof search === 'string' && path) {
        return [
            {fieldPath: 'uid', whereFilterOp: '==', search: uid}, 
            {fieldPath: path, whereFilterOp: '==', search: search}
        ]
    } else if(search && Array.isArray(search) && path && !where && isStringrArray(search)) {
        return [
            {fieldPath: 'uid', whereFilterOp: '==', search: uid},
            {fieldPath: path, whereFilterOp: 'in', search: search}
        ]
    } else if(search && Array.isArray(search) && path && Array.isArray(where) && isDateArray(search)) {
        let arrayQ:QueryProps[] = [{fieldPath: 'uid', whereFilterOp: '==', search: uid}]
        for(let i = 0; i < where.length;  i++) {
            arrayQ.push({
                fieldPath: path,
                whereFilterOp: where[i],
                search: search[i]
            })
        }
        return arrayQ
    } else {
        return [{fieldPath: 'uid', whereFilterOp: '==', search: uid}]
    }
}

// 주어진 의상리스트 중 특정 키워드가 포함되거나 포함되지 않은 리스트를 반환하는 함수
export const filterCloth = (documents:ClothItem[] | null, category:string|string[], keywords:string[], includes:boolean) => {
    if (documents) {
        return documents.filter( doc => 
            Array.isArray(category) ? 
            category.some(cat => cat === doc.category)
            : doc.category === category)
                .filter(doc => includes ? 
                    keywords.some(keyword => doc.title.toLowerCase().includes(keyword))
                    : !keywords.some(keyword => doc.title.toLowerCase().includes(keyword))
        )
    } else {
        return []
    }
}
interface RecommendReturnProps {
    outerList?: ClothItem[] | DefaultClothType | string,
    topList: ClothItem[] | DefaultClothType| string,
    bottomList: ClothItem[] | DefaultClothType | string,
    description?: string,
}

const { padding, coat, jacket, trench, knit, knit2, longSleeve, shortSleeve, sleeveLess, jean, short } = clothIcons;
// 키워드를 통한 기온별 옷 추천 로직
export const recommendCloths = (temp:number, documents?:ClothItem[]):RecommendReturnProps => {
    let outerList: ClothItem[] | string | DefaultClothType | undefined = []
    let topList:  ClothItem[] | string | DefaultClothType = []
    let bottomList:  ClothItem[] | string | DefaultClothType = []
    let outer:string;
    let top:string;
    let bottom:string;

    switch (true) {
        case temp <= 5 :
            // 보관된 옷이 없을 경우 기본 아이콘 설정
            outer = padding;
            top = knit;
            bottom = jean;

            if(documents) {
                // document에서 각 카테고리별로 추천되는 옷을 필터링한다.
                outerList = filterCloth(documents, '점퍼', ['패딩', '다운', '푸퍼', 'puffer', 'down'], true)
                // 카테고리별로 추천된 옷의 결과가 없을 경우 기본아이콘과 description을 제공한다.
                outerList = outerList.length > 0 ? outerList : {image: outer, description:['패딩', '두꺼운 코트']};

                let knitList = filterCloth(documents, '니트/스웨터', ['반팔', '숏', 'short', 'half'], false)
                let tshirtList = filterCloth(documents, '티셔츠', ['후드', '기모', 'hood'], true)
                topList = [...knitList, ...tshirtList]
                topList = topList.length > 0 ? topList : {image: top, description:['기모 후드티', '두꺼운 니트']};

                bottomList = filterCloth(documents, ['바지', '청바지'], ['반바지', 'short'], false)
                bottomList = bottomList.length > 0 ? bottomList : {image: bottom, description:['기모바지']};

                return { outerList, topList, bottomList }
            } else {
                return { outerList: outer, topList: top, bottomList:bottom, description: '패딩, 두꺼운 코트, 목도리, 기모제품' }
            }
            
        
        case temp >= 5 && temp <= 8:
            outer = coat;
            top = knit;
            bottom = jean;
            if (documents) {
                let jumperList = filterCloth(documents, '점퍼', ['패딩', '다운', '푸퍼', 'puffer', 'down'], true)
                let coatList = filterCloth(documents, '코트', ['트렌치', 'trench', '바람막이', 'windbreak'], false)
                outerList = [...jumperList, ...coatList];
                outerList = outerList.length > 0 ? outerList : {image: outer, description:['코트', '가죽자켓', '무스탕']};

                let knitList2 = filterCloth(documents, '니트/스웨터', ['반팔', '숏', 'short', 'half'], false)
                let tshirtList2 = filterCloth(documents, '티셔츠', ['후드', 'hood', '맨투맨', 'sweatshirt'], true)
                topList = [...knitList2, ...tshirtList2]
                topList = topList.length > 0 ? topList : {image: top, description:['긴소매 티셔츠', '니트']};

                bottomList = filterCloth(documents, ['바지', '청바지'], ['반바지', 'short'], false)
                bottomList = bottomList.length > 0 ? bottomList : {image: bottom, description:['기모바지', '두꺼운 청바지']};

                return { outerList, topList, bottomList }
            } else {
                return { outerList: outer, topList: top, bottomList:bottom, description: '코트, 가죽자켓, 히트텍, 니트, 레깅스' }
            }
            
        case temp >= 8 && temp <= 11 :
            outer = trench;
            top = knit;
            bottom = jean;
            if (documents) {
                let jaketList = filterCloth(documents, '재킷', [], false)
                let coatList2 = filterCloth(documents, '코트', ['트렌치', 'trench', '바람막이', 'windbreak'], true)
                outerList = [...jaketList, ...coatList2];
                outerList = outerList.length > 0 ? outerList : {image: outer, description:['자켓', '트렌치코트', '야상']};

                let knitList3 = filterCloth(documents, '니트/스웨터', ['반팔', '숏', 'short', 'half'], false)
                let tshirtList3 = filterCloth(documents, '티셔츠', ['후드', 'hood', '맨투맨', 'sweatshirt'], true)
                topList = [...knitList3, ...tshirtList3]
                topList = topList.length > 0 ? topList : {image: top, description:['긴소매 티셔츠', '니트']};

                bottomList = filterCloth(documents, ['바지', '청바지'], ['반바지', 'short'], false)
                bottomList = bottomList.length > 0 ? bottomList : {image: bottom, description:['청바지', '면바지']};

                return { outerList, topList, bottomList }
            } else {
                return { outerList: trench, topList: knit, bottomList:jean, description: '자켓, 트렌치코트, 야상, 니트, 청바지, 스타킹' }
            }
            

        case temp >= 11 && temp <= 16 :
            outer = jacket;
            top = knit2;
            bottom = jean;
            if (documents) {
                let jaketList2 = filterCloth(documents, '재킷', [], false)
                let cardiganList = filterCloth(documents, '카디건', [],false)
                outerList = [...jaketList2, ...cardiganList];
                outerList = outerList.length > 0 ? outerList : {image: outer, description:['자켓', '가디건', '야상']};

                
                let knitList4 = filterCloth(documents, '니트/스웨터', [], false)
                let tshirtList4 = filterCloth(documents, '티셔츠', ['후드', 'hood', '맨투맨', 'sweatshirt'], true)
                topList = [...knitList4, ...tshirtList4]
                topList = topList.length > 0 ? topList : {image: top, description:['긴소매 티셔츠', '니트']};

                bottomList = [...filterCloth(documents, ['바지', '청바지', '스커트'], ['반바지', 'short'], false)]    
                bottomList = bottomList.length > 0 ? bottomList : {image: bottom, description:['청바지', '면바지']};
                
                //if(outerList.length === 0 && )
                return { outerList, topList, bottomList }
            } else {
                return { outerList: outer, topList: top, bottomList: bottom, description: '자켓, 가디건, 야상, 스타킹, 청바지, 면바지' }
            }
        
        case temp >= 16 && temp <= 19 : 
            top = knit2;
            bottom = jean;           
            if (documents) {
                outerList = filterCloth(documents, '카디건', [], false)
                outerList = outerList.length > 0 ? outerList : undefined;

                let knitList5 = filterCloth(documents, '니트/스웨터', [], false)
                let tshirtList5 = filterCloth(documents, '티셔츠', ['후드', 'hood', '기모', '반팔', '민소매', '나시', '슬리브리스', 'short', 'sleeveless', 'half'], false)
                topList = [...knitList5, ...tshirtList5]
                topList = topList.length > 0 ? topList : {image: top, description:['긴소매 티셔츠', '얇은 니트']};

                bottomList = filterCloth(documents, ['바지', '청바지', '스커트'], [], false)
                bottomList = bottomList.length > 0 ? bottomList : {image: bottom, description:['청바지', '면바지']};

                return { outerList, topList, bottomList }
            } else {
                return { outerList: 'not-exist', topList: top, bottomList:bottom, description: '얇은 니트, 맨투맨, 가디건, 청바지' }
            }
            
        
        case temp >= 19 && temp <= 22 : 
            top = longSleeve;
            bottom = jean;   
            if (documents) {
                let tshirtList6 = filterCloth(documents, '티셔츠', ['후드', 'hood', '기모', '민소매', '나시', '슬리브리스', 'sleeveless'], false)
                let shirtList = filterCloth(documents, ['블라우스/셔츠', '셔츠/남방'], ['반팔', 'short', 'half'], false)
                topList = [...tshirtList6, ...shirtList]
                topList = topList.length > 0 ? topList : {image: top, description:['긴소매 티셔츠']};

                let pantsList = filterCloth(documents, ['바지', '청바지', '스커트'], ['기모'], false)
                let onepiceList = filterCloth(documents, ['원피스'], ['기모'], false)
                let jumpsuitList = filterCloth(documents, ['점프슈트'], [], false)
                bottomList = [...pantsList, ...onepiceList, ...jumpsuitList]
                bottomList = bottomList.length > 0 ? bottomList : {image: bottom, description:['청바지', '면바지']};

                return { outerList: undefined, topList, bottomList }
            } else {
                return { outerList: 'not-exist', topList: top, bottomList: bottom, description: '얇은 가디건, 긴팔, 면바지, 청바지' }
            }
            

        case temp >= 22 && temp <= 27 :
            top = shortSleeve;
            bottom = short;
            if (documents) {
                let tshirtList7 = filterCloth(documents, '티셔츠', ['반팔', 'short', '크롭', 'crop', 'half'], true)
                let shirtList2 = filterCloth(documents, ['블라우스/셔츠'], [], false)
                topList = [...tshirtList7, ...shirtList2]
                topList = topList.length > 0 ? topList : {image: top, description:['반팔', '얇은 셔츠']};

                let pantsList2 = filterCloth(documents, ['바지', '청바지', '스커트'], ['기모'], false)
                let onepiceList2 = filterCloth(documents, ['원피스'], ['기모'], false)
                let jumpsuitList2 = filterCloth(documents, ['점프슈트'], [''], false)
                bottomList = [...pantsList2,...onepiceList2, ...jumpsuitList2]
                bottomList = bottomList.length > 0 ? bottomList : {image: bottom, description:['반바지', '면바지']};

                return { outerList: undefined, topList, bottomList }
            } else {
                return { outerList: 'not-exist', topList: top, bottomList: bottom, description: '반팔, 얇은 셔츠, 반바지, 면바지' }
            }
            
        case temp >= 27 :  
            top = sleeveLess;
            bottom = short;
            if (documents) {
                topList = filterCloth(documents, '티셔츠', ['반팔', 'short', '크롭', 'crop', '나시', '슬리브리스', '민소매', 'sleeveless', 'half'], true)
                topList = topList.length > 0 ? topList : {image: top, description:['민소매', '반팔']};

                let pantsList3 = filterCloth(documents, ['바지', '청바지', '스커트'], ['기모'], false)
                let onepiceList3 = filterCloth(documents, ['원피스'], ['기모'], false)
                let jumpsuitList3 = filterCloth(documents, ['점프슈트'], ['반바지'], true)
                bottomList = [...pantsList3, ...onepiceList3, ...jumpsuitList3]
                bottomList = bottomList.length > 0 ? bottomList : {image: bottom, description:['반바지']};

                return { outerList, topList, bottomList }
            } else {
                return { outerList: 'not-exist', topList: top, bottomList: bottom, description: '민소매, 반팔, 반바지, 원피스' }
            }
            
        default:
            return {outerList, topList, bottomList};
    }
}

// 배열의 n번째 항목을 새로운 item으로 교체하는 함수 
export const updateItemInArray = (array:ClothItem[], key:string, newItem:ClothItem) => {
    let index:number = 0;

    if(array.length === 3) {
        index = key === 'outer' ? 0 : key === 'top' ? 1 : key === 'bottom' ? 2 : -1;
    } else if(array.length === 2) {
        index = key === 'top' ? 0 : key === 'bottom' ? 1 : -1;
    } else if(array.length === 1) {
        index = 0
    }
    
    return [
      ...array.slice(0, index),
      newItem,
      ...array.slice(index + 1)
    ];
}