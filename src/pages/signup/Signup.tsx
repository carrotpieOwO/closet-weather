import { Button, Form, Input, Row } from "antd";
import { Link } from "react-router-dom";
import { MailOutlined, LockOutlined, UserOutlined } from '@ant-design/icons';
import styled from "styled-components";
import { useSignup } from "../../hooks/useSignup";

const Container = styled.div`
display: flex;
align-items: center;
justify-content: center;
height: calc(100vh - 60px);
`
const FormWrapper = styled.div`
width: 100%;
background: rgb(255,255,255,.3);
margin: 0 20%;
border-radius: 20px;
padding: 5%;
`

const validateMessages = {
    required: '${label} is required!',
    types: {
      email: '${label} is not a valid email!',
      number: '${label} is not a valid number!',
    },
    number: {
      range: '${label} must be between ${min} and ${max}',
    },
};

export default function Signup() {

    const { error, isLoading, signup } = useSignup();

    const onFinish = (values: any) => {
        console.log('Success:', values);
        
        signup( values );
    };
      
    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };

    
    return (
        <Container>
            <FormWrapper>
                <h1 style={{textAlign:'center'}}>Sign Up</h1>
                <Form
                    name="signup"
                    style={{margin:'auto', width:'80%'}}
                    size="large"
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                    validateMessages={validateMessages}
                >
                    <Form.Item
                        name="displayName"
                        rules={[{ required: true }]}
                    >
                        <Input prefix={<UserOutlined/>} placeholder='username' />
                    </Form.Item>
                    <Form.Item
                        name="email"
                        rules={[{ type:'email', required: true}]}
                        
                    >
                        <Input prefix={<MailOutlined/>} placeholder='e-mail' />
                    </Form.Item>
                    <Form.Item   
                        name="password"
                        rules={[{ required: true }]}
                    >
                        <Input.Password prefix={<LockOutlined />} placeholder='password'/>
                    </Form.Item>
                    {/* <Form.Item   
                        name="passwordConfirm"
                        rules={[{ required: true }]}
                    >
                        <Input.Password prefix={<LockOutlined />} placeholder='password confirm'/>
                    </Form.Item> */}
                    <Form.Item>
                        <Button type="primary" htmlType="submit" style={{width:'100%'}}>
                            Login
                        </Button>
                    </Form.Item>
                    
                </Form>
                <Link to='/signup'>Sign Up</Link>
            </FormWrapper>
        </Container>
    )
}