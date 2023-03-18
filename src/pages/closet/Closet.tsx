import React, { useState } from 'react';
import { Layout, Menu } from 'antd';
import { ClothItem, QueryProps } from "../../index.d";
import { useCollection } from '../../hooks/useCollection';
import { useAuthContext } from '../../hooks/useAuthContext';
import { useFirestore } from '../../hooks/useFirestore';
import { categories } from '../../utils/category';
import { MenuInfo } from 'rc-menu/lib/interface';
import { getQuery } from '../../utils/utils';
import ClosetContent from './ClosetContent';
import Dashboard from './Dashboard';


const { Content, Sider } = Layout;

export default function Closet () {
    const { state } = useAuthContext();
    const [ myQuery, setMyQuery ] = useState<QueryProps[]>(getQuery({ uid: state?.user?.uid! }));
    const { documents, error, isLoading } = useCollection('closet',  myQuery);
    const { deleteDocument } = useFirestore('closet');
    const [ dashboard, setDashboard ] = useState(false); // dashboard화면 스위치

    const deleteDoc = (item:ClothItem) => {
        deleteDocument(item.id!)
    }

    const onselect = (value:MenuInfo) => {
        if(value.key === 'dashboard') {
            setDashboard(true);
            setMyQuery(getQuery({ uid: state?.user?.uid! }))
        } else {
            setDashboard(false);
            const selectedMenu = categories?.find(c => c.key === value.keyPath[1])?.children?.find(c => c.key === value.key);
            if (value.key === 'all') setMyQuery(getQuery({ uid: state?.user?.uid! }))
            else setMyQuery(getQuery({ uid: state?.user?.uid!, path: 'category',search: selectedMenu?.label }))    
        }
    }

    return (
        <Layout style={{minHeight: 'calc(100vh - 64px)'}}>
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
                <Content style={{ margin: '24px 34px 0' }}>
                    {
                        state?.user && !dashboard && documents &&
                            <ClosetContent documents={documents} deleteDoc={deleteDoc} uid={state?.user.uid}/>
                    }
                    {
                        state?.user && dashboard && documents &&
                        <Dashboard documents={documents} />
                    }
                </Content>
            </Layout>
        </Layout> 
    )
} 