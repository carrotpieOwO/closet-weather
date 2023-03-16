import { Spin } from "antd";
import styled from "styled-components";

const MySpin = styled(Spin)`
    height: calc(100vh - 63px);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .ant-spin-text {
        margin-top: 20px;
    }
`
export default function Loading () {
    return <MySpin tip="날씨 데이터 받아오는 중..." size="large"/>
}