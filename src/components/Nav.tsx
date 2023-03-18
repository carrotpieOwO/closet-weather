import { Link } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";
import { useLogout } from "../hooks/useLogout";
import { Button, MenuProps } from 'antd';
import styled from "styled-components";
import logo from '../icons/logo.svg'

const Header = styled.header`
    height: 63px;
    padding-inline: 50px;
    color: rgba(0, 0, 0, 0.88);
    line-height: 64px;
    background: rgba(255, 255, 255, .3);
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: rgb(0 0 0 / 3%) 0px 1px 2px 0px, rgb(0 0 0 / 2%) 0px 1px 6px -1px, rgb(0 0 0 / 2%) 0px 2px 4px 0px;
`
const HomeBtn = styled(Link)`
    background-image: url(${logo});
    width: 60px;
    height: 60px;
    display: flex;
    align-items: center;
    text-decoration: none;
    color: #000;
`
const Title = styled.h3`
    position: relative;
    left: 30px;
`

export default function Nav() {
    const { logout } = useLogout()
    const { state } = useAuthContext();

    return (
        <Header>
            <div style={{display:'flex', alignItems:'center', gap: '10px'}}>
                <HomeBtn to='/'>
                    <Title>HOME</Title>
                </HomeBtn>
                {
                    state?.user &&
                    <div style={{marginLeft: '30px'}}>
                        <Button type="text"><Link to='/closet'>옷장</Link></Button>
                        <Button type="text"><Link to='/calendar'>월간기록</Link></Button>
                    </div>
                }
            </div>
            {
                !state?.user ? <Button><Link to='/login'>로그인</Link></Button>
                : <Button onClick={logout}>로그아웃</Button>
            }
        </Header>
    )
}