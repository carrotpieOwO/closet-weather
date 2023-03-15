import React, { useEffect, useState } from 'react';
import { Badge, Button, Col, Layout, Menu, Row, Typography } from 'antd';
import { ClothItem, QueryProps } from "../../index.d";
import Shop from './Shop';
import { useCollection } from '../../hooks/useCollection';
import { useAuthContext } from '../../hooks/useAuthContext';
import { useFirestore } from '../../hooks/useFirestore';
import { categories } from '../../utils/category';
import ClothList from './ClothList';
import { MenuInfo } from 'rc-menu/lib/interface';
import { getQuery } from '../../utils/utils';
import styled from 'styled-components';

const { Content, Sider } = Layout;
const { Title } = Typography;

const getMostWorndCloth = (documents:ClothItem[]) => {
    const clothCount = documents.filter(doc => doc.wearCount);
    const bestCloth = clothCount && clothCount.sort((a, b) => b.wearCount! - a.wearCount!).slice(0, 3)
    
    return bestCloth
}
const CoverImage = styled.div<{image:string}>`
    overflow: hidden;
    height: 200px; 
    width: 100%;
    background-image: ${props => `url(${props.image})`};
    background-size:cover;
    border-radius: 20px;
    background-repeat: no-repeat;
    background-position: center center;
    box-shadow: 0 1px 2px 0 rgb(0 0 0 / 3%), 0 1px 6px -1px rgb(0 0 0 / 2%), 0 2px 4px 0 rgb(0 0 0 / 2%);
`
export default function Closet () {
    const [ open, setOpen ] = useState(false);
    const { state } = useAuthContext();
    const [ myQuery, setMyQuery ] = useState<QueryProps[]>(getQuery({ uid: state?.user?.uid! }));
    const [ bestCloth, setBestCloth ] = useState<ClothItem[] | []>([])
    const { documents, error, isLoading } = useCollection('closet',  myQuery);
    const { deleteDocument } = useFirestore('closet');

    const deleteDoc = (item:ClothItem) => {
        deleteDocument(item.id!)
    }

    const onselect = (value:MenuInfo) => {
        const selectedMenu = categories?.find(c => c.key === value.keyPath[1])?.children?.find(c => c.key === value.key);

        if (value.key === 'all') setMyQuery(getQuery({ uid: state?.user?.uid! }))
        else setMyQuery(getQuery({ uid: state?.user?.uid!, path: 'category',search: selectedMenu?.label }))
    }

    useEffect(() => {
        if(documents) {
            const best = getMostWorndCloth(documents)
            best && setBestCloth(best)
        }
    }, [documents])

    return (
        <Layout style={{minHeight: '100vh'}}>
            <Sider
                breakpoint="lg"
                collapsedWidth="0"
                style={{
                    height: '100vh',
                    position: 'sticky',
                    top: 0,
                  }}
            >
                <Menu
                    theme="dark"
                    mode="inline"
                    defaultSelectedKeys={['all']}
                    onSelect={onselect}
                    items={categories}
                />
            </Sider>
            <Layout>
                <Content style={{ margin: '24px 16px 0' }}>
                    <div style={{ padding: 24, minHeight: 360 }}>
                        <Button onClick={() => setOpen(true)} style={{marginBottom: '30px'}}>👔 옷 넣기</Button>
                        {
                            bestCloth.length > 0 &&
                            <>
                                <Title level={3}>가장 많이 입었어요! 👑</Title>
                                <Row style={{marginBottom:'30px'}}>
                                {
                                    bestCloth.map((cloth, i) => 
                                        <Col xs={24} sm={7} md={7} lg={7} key={`best-${cloth.id}`} style={{margin: '10px'}}>
                                            <Badge.Ribbon text={`${i+1} 등`} color="pink" placement='start'>
                                                <CoverImage image={cloth.image}/>
                                            </Badge.Ribbon>
                                        </Col>
                                    )
                                }
                                </Row>
                            <Title level={3}>모두보기 👇🏻</Title>
                            </>
                        }
                        {
                            documents &&
                            <ClothList componentNm='closet' list={documents} isLoading={isLoading} func={deleteDoc} btnTitle='삭제'/>         
                        }
                    </div>
                    <Shop open={open} setOpen={setOpen} uid={state?.user?.uid}/>
                </Content>
            </Layout>
        </Layout> 
    )
} 