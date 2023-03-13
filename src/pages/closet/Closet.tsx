import React, { useState } from 'react';
import { Button, Layout, Menu } from 'antd';
import { ClothItem } from "../../index.d";
import Shop from './Shop';
import { useCollection } from '../../hooks/useCollection';
import { useAuthContext } from '../../hooks/useAuthContext';
import { FieldPath, WhereFilterOp } from 'firebase/firestore';
import { useFirestore } from '../../hooks/useFirestore';
import { categories } from '../../utils/category';
import ClothList from './ClothList';
import { MenuInfo } from 'rc-menu/lib/interface';

const { Content, Sider } = Layout;

interface QueryProps {
    fieldPath: string | FieldPath;
    whereFilterOp: WhereFilterOp;
    search?: string | string[]
}

const getQuery = ({id, search}: {id:string, search?: string}):QueryProps[] => {
    if (search) {
        return [{fieldPath: 'uid', whereFilterOp: '==', search: id} , {fieldPath: 'category', whereFilterOp: '==', search: search}]
        
    } else {
        return [{fieldPath: 'uid', whereFilterOp: '==', search: id}]
    }
}

export default function Closet () {
    const [ open, setOpen ] = useState(false);
    const { state } = useAuthContext();
    const [ myQuery, setMyQuery ] = useState<QueryProps[]>(getQuery({ id: state?.user?.uid! }));
    
    const { documents, error, isLoading } = useCollection('closet',  myQuery);
    const { deleteDocument } = useFirestore('closet');

    const deleteDoc = (item:ClothItem) => {
        deleteDocument(item.id!)
    }

    const onselect = (value:MenuInfo) => {
        const selectedMenu = categories?.find(c => c.key === value.keyPath[1])?.children?.find(c => c.key === value.key);

        if (value.key === 'all') setMyQuery(getQuery({ id: state?.user?.uid! }))
        else setMyQuery(getQuery({ id: state?.user?.uid!, search: selectedMenu?.label }))
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
                style={{
                    overflow: 'auto',
                    height: '100vh',
                    position: 'sticky',
                    left: 0,
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
                            <ClothList list={documents} isLoading={isLoading} func={deleteDoc} btnTitle='삭제'/>         
                        }
                    </div>
                    <Shop open={open} setOpen={setOpen} uid={state?.user?.uid}/>
                </Content>
            </Layout>
        </Layout> 
    )
} 