import React, { useEffect, useState } from 'react';
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

const getMostWorndCloth = (documents:ClothItem[]) => {
    const countCloth = documents.filter(doc => doc.wearCount);
    countCloth && countCloth.sort((a, b) => b.wearCount! - a.wearCount!)
    
    return countCloth
}

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
                            <div>best!</div>
                            <ClothList componentNm='closet-best' list={bestCloth} isLoading={isLoading} func={deleteDoc} btnTitle='삭제'/>         
                            <div>all</div>
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