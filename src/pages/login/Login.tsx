import { Alert, Button, Form, Input, Typography } from "antd";
import { MailOutlined, LockOutlined } from '@ant-design/icons';
import styled from "styled-components";
import { useLogin } from "../../hooks/useLogin";
import { useForm } from "antd/es/form/Form";

const Container = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    height: calc(100vh - 126px);
`
const FormWrapper = styled.div`
    width: 100%;
    background: rgb(255,255,255,.3);
    margin: 0 20%;
    border-radius: 20px;
    padding: 5%;
    max-width: 600px;
`

const validateMessages = {
    required: '${label}을 작성해주세요.',
    types: {
      email: '유효하지 않은 Email입니다.',
    }
};

export default function Login() {
    const { error, isLoading, login } = useLogin();

    const onFinish = (values: any) => {
        login(values);
    };
      

    return (
        <Container>
            <FormWrapper>
                <h1 style={{textAlign:'center'}}>Login</h1>
                <Form
                    name="login"
                    style={{margin:'auto', width:'80%'}}
                    size="large"
                    onFinish={onFinish}
                    autoComplete="off"
                    validateMessages={validateMessages}
                >
                    <Form.Item name="email"
                        rules={[{ type:'email', required: true}]}
                    >
                        <Input prefix={<MailOutlined/>} placeholder='e-mail' />
                    </Form.Item>
                    <Form.Item name="password"
                        rules={[{ required: true }]}
                    >
                        <Input.Password prefix={<LockOutlined />} placeholder='password'/>
                    </Form.Item>
                    {
                        error && <Alert message={error} type="error"  showIcon closable/>
                    }
                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={isLoading} style={{width:'100%', marginTop: '30px'}}>
                            로그인
                        </Button>
                    </Form.Item>
                </Form>
                <div style={{textAlign: 'end'}}>
                    <Typography.Link href="/signup">✍🏻 가입하러 가기</Typography.Link>
                </div>
            </FormWrapper>
        </Container>
    )
}