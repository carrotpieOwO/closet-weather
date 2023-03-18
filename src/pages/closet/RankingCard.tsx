import { Badge, Card, Typography } from "antd"
import styled from "styled-components"
import { ClothItem } from "../../index.d"

const { Text } = Typography;

const CoverImage = styled.div<{image:string}>`
    overflow: hidden;
    height: 30px; 
    width: 20%;
    background-image: ${props => `url(${props.image})`};
    background-size:cover;
    background-repeat: no-repeat;
    background-position: center center;
    box-shadow: 0 1px 2px 0 rgb(0 0 0 / 3%), 0 1px 6px -1px rgb(0 0 0 / 2%), 0 2px 4px 0 rgb(0 0 0 / 2%);
`
interface rankingParams {
    clothList: ClothItem[],
    type: string
}
export default function RankingCard ({clothList, type}:rankingParams) {
    if (type === 'best') {
        clothList = clothList.filter(cloth => (cloth.wearCount || 0) > 0)
    }
    return (
        <>
            {
                clothList.map((cloth, i) => 
                    <Badge.Ribbon text={i+1} color="purple" placement="start" key={`${type}-${i}`}>
                        <Card bordered={false} style={{margin: '10px 0'}}
                            bodyStyle={{display: 'flex', alignItems: 'center', gap: '10px'}}
                        >
                            <CoverImage image={cloth.image}/>
                            <Text strong>{cloth.title}</Text>
                        </Card>
                        <div style={{textAlign:'right'}}>
                            {
                                cloth.wearCount === 0 
                                ? <Text>한번도 안입었어요 🥲</Text>
                                : <Text>{cloth.wearCount}회 입었어요! 💜</Text>
                            }
                            
                        </div>
                    </Badge.Ribbon>
                )
            }
        </>
    )
   
}