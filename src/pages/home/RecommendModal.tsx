import { Button, Col, Modal, Row, Tooltip } from "antd";
import styled from "styled-components";
import { ClothItem } from "../../index.d";


interface ModalProps {
    selectedCats: ClothItem[];
    modalOpen: boolean;
    setModalOpen: (b:boolean) => void;
    closeModal: (item:ClothItem) => void;
}
const CoverImage = styled.div<{image:string}>`
    overflow: hidden;
    height: 330px; 
    background-image: ${props => `url(${props.image})`};
    background-size:cover;
    border-radius: 20px;
    background-position: center;
    box-shadow: 0 1px 2px 0 rgb(0 0 0 / 3%), 0 1px 6px -1px rgb(0 0 0 / 2%), 0 2px 4px 0 rgb(0 0 0 / 2%);
`
export default function RecommendModal ({selectedCats, modalOpen, setModalOpen, closeModal}:ModalProps) {
    return (
        <Modal title="오늘의 추천 목록 🧶" centered open={modalOpen} width={'70%'}
            onCancel={() => setModalOpen(false)} footer={[]}
            bodyStyle={{ overflow: 'auto', maxHeight: '60vh' }}
        >
            <Row style={{justifyContent:'center'}}>
                {
                    selectedCats.map( item => 
                        <Col xs={12} sm={12} md={9} lg={7} key={`modal-${item.id}`} style={{display:'grid', margin:'20px 10px 20px 0'}}>
                            <CoverImage image={item.image} />
                            <Tooltip placement="top" title={item.title} >
                                <Button style={{marginLeft:'auto', marginRight:'auto', marginTop:'10px'}}
                                    onClick={() => closeModal(item)}>이거 입을래</Button>
                            </Tooltip>
                        </Col>        
                    )    
                }
            </Row>
        </Modal>
    )
}