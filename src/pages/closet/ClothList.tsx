import { ClothItem } from "../../index.d";
import { Button, Card, List } from 'antd';
import styled from "styled-components";
import Meta from "antd/es/card/Meta";

const CoverImage = styled.div<{image:string}>`
    overflow: hidden;
    height: 330px; 
    background-image: ${props => `url(${props.image})`};
    background-size:cover;
`
interface ClothListProps {
    list: ClothItem[];
    isLoading: boolean;
    func: (props: ClothItem) => void;
    btnTitle: string
}
const listStyle = {
    height:'calc(100vh - 350px', display: 'flex', alignItems: 'center', justifyContent: 'center'
}

export default function ClothList ({ list, isLoading, func, btnTitle }:ClothListProps) {
    return (
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
            style={list.length === 0 ? listStyle : {}}
            loading={isLoading}
            dataSource={list}
            renderItem={(item:ClothItem) => (
                <List.Item key={item.title}>
                    <Card cover={<CoverImage image={item.image}/>}>
                        <Meta title={item.title}/>
                        <Button style={{marginTop:'30px', width:'100%'}} onClick={() => func(item)}>
                            { btnTitle }
                        </Button>
                    </Card>
                </List.Item>
            )}
        />        
      
    )
}