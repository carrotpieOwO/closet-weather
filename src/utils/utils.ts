import { FieldPath, WhereFilterOp } from "firebase/firestore";
import { ClothItem } from "../index.d";

interface QueryProps {
    fieldPath: string | FieldPath;
    whereFilterOp: WhereFilterOp;
    search?: string | string[]
}

export const getQuery = ({uid, search}: {uid: string, search?: string}):QueryProps[] => {
    if (search && typeof search === 'string') {
        return [{fieldPath: 'uid', whereFilterOp: '==', search: uid} , {fieldPath: 'category', whereFilterOp: '==', search: search}]
    } else if(search && Array.isArray(search)) {
        return [{fieldPath: 'uid', whereFilterOp: '==', search: uid} , {fieldPath: 'category', whereFilterOp: 'in', search: search}]
    } else {
        return [{fieldPath: 'uid', whereFilterOp: '==', search: uid}]
    }
}

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