import { signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { appAuth } from "../firebase/config";
import { useAuthContext } from "./useAuthContext";

interface loginProps {
    email: string;
    password: string;
};

export const useLogin = () => {
    const [ error, setError ] = useState(null);
    const [ isLoading, setIsLoading ] = useState(false);
    const { dispatch } = useAuthContext();

    const login = ({ email, password }:loginProps) => {
        setError(null);
        setIsLoading(true); // 통신 시작

        // 회원가입
        signInWithEmailAndPassword(appAuth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                console.log('user', user)

                if(!user) {
                    throw new Error('로그인 실패');
                }

                dispatch({ type: 'login', payload: user }) // 회원가입(자동로그인) 후 user정보 업데이트

                setError(null);
                setIsLoading(false); // 회원가입 완료 => 통신 종료

            }).catch(err => {
                setError(err.message);
                setIsLoading(false);
            })
    }
    return { error, isLoading, login }
}