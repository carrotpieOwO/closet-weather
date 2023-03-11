import { Link } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";
import { useLogout } from "../hooks/useLogout";

export default function Nav() {
    const { logout } = useLogout()
    const { state } = useAuthContext();

    return (
        <>
            {
                !state?.user ? <Link to='/login'>로그인</Link>
                : 
                <div>
                    <div>{state.user.displayName}님</div>
                    <button type="button" onClick={logout}>logout</button>
                    <Link to='/closet'>옷장</Link>
                    <Link to='/calendar'>monthly ootd</Link>
                </div>
            }
        </>
    )
}