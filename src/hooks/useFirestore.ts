import { addDoc, collection, deleteDoc, doc, increment, setDoc, updateDoc } from "firebase/firestore";
import { useReducer } from "react"
import { ClothItem } from "../index.d";
import { appFireStore, timestamp } from "../firebase/config";

const initState = {
    document: null,
    isLoading: false,
    error: null,
    success: false
}
interface StoreState {
    document?: any;
    isLoading: boolean;
    error?: ClothItem | string | null;
    success: boolean;
};

interface AuthAction {
    type: 'isLoading' | 'addDoc' | 'error' | 'deleteDoc' | 'updateDoc' | 'setDoc';
    payload?: any;
}

const storeReducer = (state: StoreState, action: AuthAction):StoreState => {
    switch (action.type) {
        case 'isLoading':
            return { isLoading: true, document: null, error: null, success: false }
        case 'addDoc':
            return { isLoading: false, document: action.payload, error: null, success: true }
        case 'error':
            return { isLoading: false, document: null, error: action.payload, success: false }
        case 'deleteDoc':
            return { isLoading: false, document: action.payload, error: null, success: true }
        case 'updateDoc':
            return { isLoading: false, document: action.payload, error: null, success: true }
        case 'setDoc':
            return { isLoading: false, document: action.payload, error: null, success: true }
        default:
            return state;
    }
}
export const useFirestore = (transaction:string) => { // transaction: 저장할 컬렉션명
    const [ response, dispatch ] = useReducer(storeReducer, initState);

    // collection 참조 요청
    const colRef = collection(appFireStore, transaction);

    // collection에 문서 추가
    const addDocument = async(doc:ClothItem | ClothItem[]) => {
        dispatch({type: 'isLoading'});
        try {
            const createdTime = timestamp.fromDate(new Date());
            const docRef = await addDoc(colRef, { ...doc, createdTime });
            dispatch({ type: 'addDoc', payload: docRef })
        } catch (error: any) {
            dispatch({type: 'error', payload: error.message })
        }
    }

    // collection의 문서 삭제
    const deleteDocument = async (id:string) => {
        dispatch({type: 'isLoading'});
        try {
            const docRef = await deleteDoc(doc(colRef, id));
            dispatch({ type: 'deleteDoc', payload: docRef })
        } catch (error: any) {
            dispatch({type: 'error', payload: error.message })
        }
    }

    // collection의 문서에서 착용횟수 업데이트
    const updateDocument = async(docId:string) => {
        dispatch({type: 'isLoading'});
        try {
            const updatedTime = timestamp.fromDate(new Date());
            const ref = doc(appFireStore, transaction, docId);
            const docRef = await updateDoc(ref, { wearCount: increment(1), updatedTime});
            dispatch({ type: 'updateDoc', payload: docRef })
        } catch (error: any) {
            dispatch({type: 'error', payload: error.message })
        }
    }

    // id값의 문서가 없으면 생성하고 있으면 덮어씌운다.
    const setDocument = async(docId:string, uid:string, content:ClothItem[]) => {
        dispatch({type: 'isLoading'});
        try {
            const createdTime = timestamp.fromDate(new Date());
            const ref = doc(appFireStore, transaction, docId);
            const docRef = await setDoc(ref, { ...content, uid, createdTime, id:docId });
            dispatch({ type: 'setDoc', payload: docRef })
        } catch (error: any) {
            dispatch({type: 'error', payload: error.message })
        }
    }

    return { addDocument, deleteDocument, response, updateDocument, setDocument }

}