import { Button, Card, Drawer, List, Space, Input, message, InputRef, Form, Skeleton, Divider } from "antd";
import Meta from "antd/es/card/Meta";
import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { useShop } from "../../hooks/useShop";
import { ClothItem } from "../../index.d";
import { SkinFilled } from '@ant-design/icons';
import { useFirestore } from "../../hooks/useFirestore";

const { Search } = Input;

interface ShopProps {
    open: boolean,
    setOpen: (open: boolean) => void,
    uid?: string,
}

const listStyle = {
    height:'calc(100% - 80px', display: 'flex', alignItems: 'center', justifyContent: 'center'
}

const CoverImage = styled.div<{image:string}>`
    overflow: hidden;
    height: 330px; 
    background-image: ${props => `url(${props.image})`};
    background-size:cover;
`

export default function Shop ({ open, setOpen, uid }:ShopProps) {
    const [ list, setList ] = useState<ClothItem[] | null>(null);
    const { error, isLoading, search } = useShop();
    const [ messageApi, contextHolder ] = message.useMessage();
    const [ searchValue, setSearchValue ] = useState('');
    const [ startNum, setStartNum ] = useState(1);
    const [ hasMore, setHasMore ] = useState(false);    
    const searchRef = useRef<InputRef>(null);
    const { addDocument, response } = useFirestore('closet'); // collection 생성

    useEffect(() => {
        // drawer 열릴 경우 모두 초기화
        setList(null);
        if(searchRef.current) {
            searchRef.current.focus({
                cursor: 'end',
            });
        }
        setSearchValue('')
    }, [open])

    if (error) {
        messageApi.open({
            type: 'error',
            content: error,
        });
    }

    const onSearch = async () => {
        setStartNum(1); // 새로 검색할 경우 api검색 start값을 1로 초기화한다. 
        const { cloths, hasMore } = await search(searchValue, startNum);
        setList(cloths);
        setHasMore(hasMore); //true일 경우 [더불러오기]버튼 생성
    }
    
    const loadMoreData = async () => {
        setStartNum(startNum + 30); // [더불러오기]버튼 클릭 시, 기존에 읽어온 데이터 이후의 데이터를 읽어온다.
        const { cloths } = await search(searchValue, startNum); 
        setList((prevItems) => [...prevItems!, ...cloths!]);
    };

    const addCloth = (item:ClothItem) => {
        if (uid) {
            addDocument({ uid, ...item})
        } else {
            messageApi.open({
                type: 'error',
                content: '로그인이 필요합니다.',
            });
            window.location.replace('/login')
        }
    }

    useEffect(() => {
        console.log('response', response)
        response.success && messageApi.open({
            type: 'success',
            content: '성공적으로 저장하였습니다!',
        });

        response.error && messageApi.open({
            type: 'error',
            content: error,
        });
    }, [response])
    return (
        <Drawer
            title="👔 옷 넣기"
            placement='bottom'
            width={1000}
            onClose={() => setOpen(false)}
            open={open}
            height='100%'
            closeIcon={false}
            style={{overflow:'hidden'}}
            extra={
                <Space>
                    <Button onClick={() => setOpen(false)}>
                        완료 💜
                    </Button>
                </Space>
            }
        >
            {contextHolder}
            <Search placeholder="input search text" onSearch={onSearch} enterButton size='large'
                style={{marginBottom:'30px'}} ref={searchRef} value={searchValue} 
                onChange={(e) => setSearchValue(e.target.value)}/>
                {
                    list &&
                        <List
                            grid={{
                                gutter: 16,
                                xs: 1,
                                sm: 2,
                                md: 2,
                                lg: 3,
                                xl: 4,
                                xxl: 5
                            }}
                            loading={isLoading}
                            dataSource={list}
                            renderItem={(item:ClothItem) => (
                                    <List.Item key={item.title}>
                                        <Card cover={<CoverImage image={item.image}/>}>
                                            <Meta title={item.title}/>
                                            <Button style={{marginTop:'30px', width:'100%'}} onClick={() => addCloth(item)}>
                                                <SkinFilled />
                                                담기
                                            </Button>
                                        </Card>
                                    </List.Item>
                            )}
                        />                 
                }
                {
                    list && hasMore && 
                        <Button onClick={loadMoreData} style={{width:'100%'}}>더 불러오기</Button>
                }

           
        </Drawer>
    )
}