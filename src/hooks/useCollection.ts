import { collection, FieldPath, onSnapshot, orderBy, query, QueryFieldFilterConstraint, QuerySnapshot, where, WhereFilterOp } from "firebase/firestore"
import { useEffect, useState } from "react"
import { ClothItem } from "../index.d";
import { appFireStore } from "../firebase/config"

interface QueryProps {
    fieldPath: string | FieldPath;
    whereFilterOp: WhereFilterOp;
    search?: string | string[]
}
export const useCollection = (transaction:string, myQuery?:QueryProps[]) => {
    const [ documents, setDocuments ] = useState<ClothItem[] | null>(null);
    const [ error, setError ] = useState(null);
    const [ isLoading, setIsLoading ] = useState(false);

    let queryArr: QueryFieldFilterConstraint[] = []
    if(myQuery) {
        myQuery.forEach((query, i) => {
            const { fieldPath, whereFilterOp, search } = query;
            queryArr.push(where(fieldPath, whereFilterOp, search))
        })
    }
    useEffect(() => {
        setIsLoading(true);
        const queryRef = myQuery ? 
            query(collection(appFireStore, transaction), 
            ...queryArr,
            orderBy('createdTime', 'desc')
            )
            : collection(appFireStore, transaction);

        const unsubscribe = onSnapshot( queryRef, 
            (snapshot: QuerySnapshot) => {
                let result:any[]= [];
                snapshot.docs.forEach((doc) => {
                    result.push({...doc.data(), id: doc.id})
                })

                setDocuments(result);
                setError(null);
                setIsLoading(false);
            }, 
            (error:any) => {
                setError(error.message);
                setIsLoading(false);
            }
        )

        return unsubscribe;
    }, [collection, myQuery]);

    return { documents, error, isLoading }
}