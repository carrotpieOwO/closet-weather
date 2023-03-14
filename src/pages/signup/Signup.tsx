import { Alert, Button, Form, Input, Typography } from "antd";
import { MailOutlined, LockOutlined, UserOutlined } from '@ant-design/icons';
import styled from "styled-components";
import { useSignup } from "../../hooks/useSignup";
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

export default function Signup() {

    const { error, isLoading, signup } = useSignup();
    const [ form ] = useForm();

    const onFinish = (values: any) => {  
        signup( values );
    };

    const validatePassword = (_:any, value:string) => {
        // 8~50자이며 영문 소문자, 영문 대문자, 숫자, 특수문자를 모두 포함해야 합니다.
        const regExp = new RegExp(/(?=.*\d{1,50})(?=.*[~`!@#$%\^&*()-+=]{1,50})(?=.*[a-z]{1,50})(?=.*[A-Z]{1,50}).{8,50}$/);
        if (!regExp.test(value)) {
            return Promise.reject(new Error('비밀번호는 8~50자이며 영문 소문자, 영문 대문자, 숫자, 특수문자를 모두 포함해야 합니다.'));
        } 
        return Promise.resolve();
        
    } 

    const validateConfirmPassword = (_:any, value:string) => {
        if(!value || form.getFieldValue('password') === value ) {
            return Promise.resolve()
        }
        return Promise.reject("비밀번호가 일치하지 않습니다.")
    }

    return (
        <Container>
            <FormWrapper>
                <h1 style={{textAlign:'center'}}>Sign Up</h1>
                <Form
                    form={form}
                    name="signup"
                    style={{margin:'auto', width:'80%'}}
                    size="large"
                    onFinish={onFinish}
                    autoComplete="off"
                    validateMessages={validateMessages}
                >
                    <Form.Item
                        name="displayName"
                        rules={[{ required: true }]}
                    >
                        <Input prefix={<UserOutlined/>} placeholder='displayName' />
                    </Form.Item>
                    <Form.Item
                        name="email"
                        rules={[{ type:'email', required: true}]}
                    >
                        <Input prefix={<MailOutlined/>} placeholder='e-mail' />
                    </Form.Item>
                    <Form.Item   
                        name="password"
                        rules={[{ validator: validatePassword}]}
                    >
                        <Input.Password prefix={<LockOutlined />} placeholder='password'/>
                    </Form.Item>
                    <Form.Item   
                        name="passwordConfirm"
                        rules={[{ validator: validateConfirmPassword}]}
                    >
                        <Input.Password prefix={<LockOutlined />} placeholder='password confirm'/>
                    </Form.Item>
                    {
                        error && <Alert message={error} type="error"  showIcon closable/>
                    }
                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={isLoading} style={{width:'100%', marginTop: '30px'}}>
                            가입하기
                        </Button>
                    </Form.Item>
                    <div style={{textAlign:'end'}}>
                        이미 가입하셨나요? &nbsp;
                        <Typography.Link href="/login">로그인</Typography.Link>
                    </div>
                </Form>
            </FormWrapper>
        </Container>
    )
}