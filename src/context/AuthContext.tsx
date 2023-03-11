import React, { createContext, Dispatch, useEffect, useReducer } from "react";
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth'
import { appAuth } from "../firebase/config";

interface AuthState {
    user: FirebaseUser | null | undefined;
    isAuthReady: boolean;
};

interface AuthAction {
    type: 'login' | 'logout' | 'isAuthReady';
    payload?: FirebaseUser | null;
}

type AuthDispatch = Dispatch<AuthAction>


interface AuthContextType {
    state: AuthState | undefined;
    dispatch: AuthDispatch;
}

  
const AuthContext = createContext<AuthContextType | undefined>(undefined);

const authReducer = ( state:AuthState, action:AuthAction ):AuthState => {
    switch (action.type) {
        case 'login': // login & signup (signup 하면 자동으로 Login 됨)
            return { ...state, user: action.payload }
        case 'logout':
            return { ...state,  user: null }
        case 'isAuthReady':
            return { ...state, user: action.payload, isAuthReady: true }
        default:
            return state;
    }
}

const AuthContextProvider = ({ children }: {children: React.ReactNode}) => {
    useEffect(() => {
        // auth객체의 관찰자 함수로, 새로고침을 해도 회원정보 유지되도록 한다.
        const unsubscribe = onAuthStateChanged(appAuth, (user) => {
            dispatch({ type: 'isAuthReady', payload: user })
        })

        return unsubscribe // 구독취소
    }, [])
    
    const [ state, dispatch ] = useReducer(authReducer, {
        user : null,
        isAuthReady: false 
    })

    return (
        <AuthContext.Provider value={{ state, dispatch }}>
            { children }
        </AuthContext.Provider>
    )
}

export { AuthContext, AuthContextProvider }