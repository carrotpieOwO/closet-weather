import React, { useEffect, useState } from 'react';
import { UploadOutlined, UserOutlined, VideoCameraOutlined } from '@ant-design/icons';
import { Button, Card, Layout, List, Menu } from 'antd';
import { ClothItem } from "../../index.d";
import Shop from './Shop';
import { useCollection } from '../../hooks/useCollection';
import Meta from 'antd/es/card/Meta';
import styled from 'styled-components';
import { useAuthContext } from '../../hooks/useAuthContext';
import { deleteDoc, FieldPath, WhereFilterOp } from 'firebase/firestore';
import { useFirestore } from '../../hooks/useFirestore';

const { Content, Sider } = Layout;


const CoverImage = styled.div<{image:string}>`
    overflow: hidden;
    height: 330px; 
    background-image: ${props => `url(${props.image})`};
    background-size:cover;
`

interface QueryProps {
    fieldPath: string | FieldPath;
    whereFilterOp: WhereFilterOp;
    search?: string | string[]
}
export default function Closet () {
    const [ open, setOpen ] = useState(false);
    const { state } = useAuthContext();
    const [ myQuery, setMyQuery ] = useState<QueryProps[]>( [{fieldPath: 'uid', whereFilterOp: '==', search: state?.user?.uid}]);
    
    const { documents, error, isLoading } = useCollection('closet',  myQuery);
    //const { documents, error, isLoading } = useCollection('closet',  [{fieldPath: 'uid', whereFilterOp: '==', search: state?.user?.uid} , {fieldPath: 'category', whereFilterOp: '==', search: '카디건'}]);
    const { deleteDocument } = useFirestore('closet');
    // const { documents: myDocuments, error: myError, isLoading: myIsLoading } = useCollection('closet',  [{fieldPath: 'uid', whereFilterOp: '==', search: state?.user?.uid}]);

    const deleteDoc = (id:string) => {
        deleteDocument(id)
    }

    const onselect = () => {
        console.log('selec')
        //setMyQuery([{fieldPath: 'uid', whereFilterOp: '==', search: state?.user?.uid} , {fieldPath: 'category', whereFilterOp: '==', search: '카디건'}])
        // setMyQuery([{fieldPath: 'uid', whereFilterOp: '==', search: state?.user?.uid} , {fieldPath: 'category', whereFilterOp: 'in', search: ['재킷', '니트/스웨터', '티셔츠']}])

    }

    return (
        <Layout style={{minHeight: '100vh'}}>
            <Sider
                breakpoint="lg"
                collapsedWidth="0"
                onBreakpoint={(broken) => {
                    console.log(broken);
                }}
                onCollapse={(collapsed, type) => {
                    console.log(collapsed, type);
                }}
            >
                <Menu
                    theme="dark"
                    mode="inline"
                    defaultSelectedKeys={['0']}
                    onSelect={onselect}
                    items={[UserOutlined, VideoCameraOutlined, UploadOutlined, UserOutlined].map(
                    (icon, index) => ({
                        key: String(index + 1),
                        icon: React.createElement(icon),
                        label: `nav ${index + 1}`,
                    }),
                    )}
                />
            </Sider>
            <Layout>
                <Content style={{ margin: '24px 16px 0' }}>
                    <div style={{ padding: 24, minHeight: 360 }}>
                        <Button onClick={() => setOpen(true)}>👔 옷 넣기</Button>
                        {
                            documents &&
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
                                dataSource={documents}
                                renderItem={(item:ClothItem) => (
                                    <List.Item key={item.title}>
                                        <Card cover={<CoverImage image={item.image}/>}>
                                            <Meta title={item.title}/>
                                            <Button style={{marginTop:'30px', width:'100%'}} onClick={() => deleteDoc(item.id!)}>
                                                삭제
                                            </Button>
                                        </Card>
                                    </List.Item>
                                )}
                            />             
                        }
                    </div>
                    <Shop open={open} setOpen={setOpen} uid={state?.user?.uid}/>
                </Content>
            </Layout>
        </Layout>
    )
} 