import { signOut } from "firebase/auth";
import { useState } from "react"
import { useNavigate } from "react-router-dom";
import { appAuth } from "../firebase/config";
import { useAuthContext } from "./useAuthContext";

export const useLogout = () => {
    const [ error, setError ] = useState(null);
    const [ isLoading, setIsLoading ] = useState(false);
    const { dispatch } = useAuthContext();
    const navigate = useNavigate();

    const logout = () => {
        setError(null);
        setIsLoading(true);

        signOut(appAuth).then(() => {
            dispatch({ type: 'logout' });
            setError(null);
            setIsLoading(false);

            navigate('/login')

        }).catch((error) => {
            setError(error.message);
            setIsLoading(false);
        })
    }
    return { error, isLoading, logout }
}