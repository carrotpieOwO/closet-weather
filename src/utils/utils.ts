import { FieldPath, WhereFilterOp } from "firebase/firestore";
import { ClothItem } from "../index.d";

interface Querys {
    fieldPath: string | FieldPath;
    whereFilterOp: WhereFilterOp;
    search?: string | string[]
}
interface QueryProps {
    uid: string,
    path?: string,
    search?: string | string[]
}
// firebase 쿼리문 생성 함수
export const getQuery = ({uid, path, search}: QueryProps):Querys[] => {
    if (search && typeof search === 'string' && path) {
        return [
            {fieldPath: 'uid', whereFilterOp: '==', search: uid}, 
            {fieldPath: path, whereFilterOp: '==', search: search}
        ]
    } else if(search && Array.isArray(search) && path) {
        return [
            {fieldPath: 'uid', whereFilterOp: '==', search: uid},
            {fieldPath: path, whereFilterOp: 'in', search: search}
        ]
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
    outerList:ClothItem[]|[],
    topList:ClothItem[]|[],
    bottomList:ClothItem[]|[]
}

// 키워드를 통한 기온별 옷 추천 로직
export const recommendCloths = (temp:number, documents:ClothItem[]):RecommendReturnProps => {
    let outerList:ClothItem[] | [] = []
    let topList:ClothItem[] | [] = []
    let bottomList:ClothItem[] | [] = []
      
    switch (true) {
        case temp <= 5 :
            outerList = filterCloth(documents, '점퍼', ['패딩', '다운', '푸퍼', 'puffer', 'down'], true)
            
            let knitList = filterCloth(documents, '니트/스웨터', ['반팔', '숏', 'short', 'half'], false)
            let tshirtList = filterCloth(documents, '티셔츠', ['후드', '기모', 'hood'], true)
            topList = [...knitList, ...tshirtList]
            
            bottomList = filterCloth(documents, ['바지', '청바지'], ['반바지', 'short'], false)
        
            return { outerList, topList, bottomList }
        
        case temp >= 5 && temp <= 8:
            let jumperList = filterCloth(documents, '점퍼', ['패딩', '다운', '푸퍼', 'puffer', 'down'], true)
            let coatList = filterCloth(documents, '코트', ['트렌치', 'trench', '바람막이', 'windbreak'], false)
            outerList = [...jumperList, ...coatList];
           
            let knitList2 = filterCloth(documents, '니트/스웨터', ['반팔', '숏', 'short', 'half'], false)
            let tshirtList2 = filterCloth(documents, '티셔츠', ['후드', 'hood', '맨투맨', 'sweatshirt'], true)
            topList = [...knitList2, ...tshirtList2]

            bottomList = filterCloth(documents, ['바지', '청바지'], ['반바지', 'short'], false)
            
            return { outerList, topList, bottomList }
        
        case temp >= 8 && temp <= 11 :
            let jaketList = filterCloth(documents, '재킷', [], false)
            let coatList2 = filterCloth(documents, '코트', ['트렌치', 'trench', '바람막이', 'windbreak'], true)
            outerList = [...jaketList, ...coatList2];
           
            let knitList3 = filterCloth(documents, '니트/스웨터', ['반팔', '숏', 'short', 'half'], false)
            let tshirtList3 = filterCloth(documents, '티셔츠', ['후드', 'hood', '맨투맨', 'sweatshirt'], true)
            topList = [...knitList3, ...tshirtList3]

            bottomList = filterCloth(documents, ['바지', '청바지'], ['반바지', 'short'], false)
        
            return { outerList, topList, bottomList }

        case temp >= 11 && temp <= 16 :
            let jaketList2 = filterCloth(documents, '재킷', [], false)
            let cardiganList = filterCloth(documents, '카디건', [],false)
            outerList = [...jaketList2, ...cardiganList];
           
            let knitList4 = filterCloth(documents, '니트/스웨터', [], false)
            let tshirtList4 = filterCloth(documents, '티셔츠', ['후드', 'hood', '맨투맨', 'sweatshirt'], true)
            topList = [...knitList4, ...tshirtList4]

            bottomList = filterCloth(documents, ['바지', '청바지', '스커트'], ['반바지', 'short'], false)

            return { outerList, topList, bottomList }

        case temp >= 16 && temp <= 19 :            
            outerList = filterCloth(documents, '카디건', [],false)
            
            let knitList5 = filterCloth(documents, '니트/스웨터', [], false)
            let tshirtList5 = filterCloth(documents, '티셔츠', ['후드', 'hood', '기모', '반팔', '민소매', '나시', '슬리브리스', 'short', 'sleeveless', 'half'], false)
            topList = [...knitList5, ...tshirtList5]

            bottomList = filterCloth(documents, ['바지', '청바지', '스커트'], [], false)
        
            return { outerList, topList, bottomList }
        
        case temp >= 19 && temp <= 22 : 
            let tshirtList6 = filterCloth(documents, '티셔츠', ['후드', 'hood', '기모', '민소매', '나시', '슬리브리스', 'sleeveless'], false)
            let shirtList = filterCloth(documents, ['블라우스/셔츠', '셔츠/남방'], ['반팔', 'short', 'half'], false)
            topList = [...tshirtList6, ...shirtList]

            let pantsList = filterCloth(documents, ['바지', '청바지', '스커트'], ['기모'], false)
            let onepiceList = filterCloth(documents, ['원피스'], ['기모'], false)
            let jumpsuitList = filterCloth(documents, ['점프슈트'], [], false)
            bottomList = [...pantsList, ...onepiceList, ...jumpsuitList]
        
            return { outerList, topList, bottomList }

        case temp >= 22 && temp <= 27 :  
            let tshirtList7 = filterCloth(documents, '티셔츠', ['반팔', 'short', '크롭', 'crop', 'half'], true)
            let shirtList2 = filterCloth(documents, ['블라우스/셔츠'], [], false)
            topList = [...tshirtList7, ...shirtList2]

            let pantsList2 = filterCloth(documents, ['바지', '청바지', '스커트'], ['기모'], false)
            let onepiceList2 = filterCloth(documents, ['원피스'], ['기모'], false)
            let jumpsuitList2 = filterCloth(documents, ['점프슈트'], [''], false)
            bottomList = [...pantsList2,...onepiceList2, ...jumpsuitList2]

            return { outerList, topList, bottomList }
        case temp >= 27 :  
            topList = filterCloth(documents, '티셔츠', ['반팔', 'short', '크롭', 'crop', '나시', '슬리브리스', '민소매', 'sleeveless', 'half'], true)
           
            let pantsList3 = filterCloth(documents, ['바지', '청바지', '스커트'], ['기모'], false)
            let onepiceList3 = filterCloth(documents, ['원피스'], ['기모'], false)
            let jumpsuitList3 = filterCloth(documents, ['점프슈트'], ['반바지'], true)

            bottomList = [...pantsList3, ...onepiceList3, ...jumpsuitList3]

            return { outerList, topList, bottomList }
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