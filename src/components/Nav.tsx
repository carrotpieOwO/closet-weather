import { Link } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";
import { useLogout } from "../hooks/useLogout";
import { Dropdown, Space, Button, MenuProps } from 'antd';
import styled from "styled-components";
import { DownOutlined } from '@ant-design/icons';
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
    margin-bottom: 30px;
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

    const items: MenuProps['items'] = [
        {
            label: (
                <div onClick={logout}>회원정보 수정</div>
            ),
            key: '0',
        },
        {
            label: (
                <div onClick={logout}>로그아웃</div>
            ),
            key: '1',
        },
    ];


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
                        <Button type="text"><Link to='/calendar'>monthly ootd</Link></Button>
                    </div>
                }
            </div>
            {
                !state?.user ? <Button><Link to='/login'>로그인</Link></Button>
                : 
                <div>
                    <Dropdown menu={{ items }}>
                        <a onClick={(e) => e.preventDefault()}>
                        <Space>
                            {state.user.displayName}님
                            <DownOutlined />
                        </Space>
                        </a>
                    </Dropdown>
                </div>
            }
        </Header>
    )
}