import React, { useState } from 'react';
import { Button, Layout, Menu } from 'antd';
import { ClothItem, QueryProps } from "../../index.d";
import Shop from './Shop';
import { useCollection } from '../../hooks/useCollection';
import { useAuthContext } from '../../hooks/useAuthContext';
import { useFirestore } from '../../hooks/useFirestore';
import { categories } from '../../utils/category';
import ClothList from './ClothList';
import { MenuInfo } from 'rc-menu/lib/interface';
import { getQuery } from '../../utils/utils';

const { Content, Sider } = Layout;


export default function Closet () {
    const [ open, setOpen ] = useState(false);
    const { state } = useAuthContext();
    const [ myQuery, setMyQuery ] = useState<QueryProps[]>(getQuery({ uid: state?.user?.uid! }));
    
    const { documents, error, isLoading } = useCollection('closet',  myQuery);
    const { deleteDocument } = useFirestore('closet');

    const deleteDoc = (item:ClothItem) => {
        deleteDocument(item.id!)
    }

    const onselect = (value:MenuInfo) => {
        const selectedMenu = categories?.find(c => c.key === value.keyPath[1])?.children?.find(c => c.key === value.key);

        if (value.key === 'all') setMyQuery(getQuery({ uid: state?.user?.uid! }))
        else setMyQuery(getQuery({ uid: state?.user?.uid!, search: selectedMenu?.label }))
    }

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