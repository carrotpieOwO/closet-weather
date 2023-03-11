import { createUserWithEmailAndPassword, updateProfile, User as FirebaseUser } from "firebase/auth";
import { useState } from "react";
import { appAuth } from "../firebase/config";
import { useAuthContext } from "./useAuthContext";

interface SignupProps {
    email: string;
    password: string;
    displayName: string;
};

export const useSignup = () => {
    const [ error, setError ] = useState(null);
    const [ isLoading, setIsLoading ] = useState(false);
    const { dispatch }  = useAuthContext();

    const signup = ({email, password, displayName}:SignupProps) => {
        setError(null);
        setIsLoading(true); // 통신 시작

        // 회원가입
        createUserWithEmailAndPassword(appAuth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                console.log('user', user)

                if(!user) {
                    throw new Error('회원가입 실패');
                }

                // firebase에서 userName은 회원가입 후에 등록할 수 있다.
                updateProfile(appAuth.currentUser as FirebaseUser, { displayName })
                    .then(() => {
                        dispatch({ type: 'login', payload: user }) // 회원가입(자동로그인) 후 user정보 업데이트
                        setError(null);
                        setIsLoading(false); // 회원가입 완료 => 통신 종료
                    }).catch(err => {
                        setError(err.message);
                        setIsLoading(false);
                    })
            }).catch(err => {
                setError(err.message);
                setIsLoading(false);
            })
    }
    return { error, isLoading, signup }
}