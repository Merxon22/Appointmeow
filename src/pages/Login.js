import React from "react";
import { Layout, Form, Input, Button} from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import {message} from 'antd';

const { Header, Content, Footer } = Layout;
// const { getFieldDecorator } = this.props.form;
const formItemLayout = {
    labelCol: {
        xs: {
            span: 24,
        },
        sm: {
            span: 8,
        },
    },
    wrapperCol: {
        xs: {
            span: 24,
        },
        sm: {
            span: 16,
        },
    },
};

const tailFormItemLayout = {
    wrapperCol: {
        xs: {
            span: 24,
            offset: 0,
        },
        sm: {
            span: 16,
            offset: 8,
        },
    },
};

// const error = message.errror('input error on username or password');

class Login extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            username: '',
            password: ''
        }
    }

    error = () => {
        message.error('input error on username or password');
    };

    makeUserInfor = () => {
        const un = document.getElementById('username').value;
        const pw = document.getElementById('password').value;
        // const userInfor = {
        //     username: un,
        //     password: pw
        // }
        fetch('login/verify',{
            method: 'POST',
            body: JSON.stringify({
                username: un,
                password: pw
            }),
            headers:{
                'Content-type':'application/json; charset=UTF-8'
            }
        }).then(response => response.json()).then( message =>{
            const judge = message['message']
            const tempoID = message['loginKey']
            if(judge === true){
                this.props.history.push('/home?lk='+tempoID)
            }else{
                this.error();
            }
        })   
    }

    onFinish = (values) => {
        console.log('Received values of form: ', values);
    };

    navigateToRegister = () => {
        this.props.history.push('/register');
    };

    // navigateToHome = () => {
    //     const usernameInp = document.getElementById('username');
    //     const passwordInp = document.getElementById('password');
    //     // const password = 
    //     if (passwordInp === password) {
    //         const origPath = '/home'
    //         const path = { origPath } + '?un=' + { username }
    //         this.props.history.push(path);
    //     } else {
    //             message.warning('Incorrect user name or password');            
    //     }
    // };

    render() {
        return (
            <Layout>
                <Header className="site-layout-sub-header-background" style={{ padding: 0, margin: '50px' }}>
                    AppointMeow
                </Header>
                <Content style={{ marginLeft: '380px', marginTop: '80px', width: "70%" }}>
                    <Form
                        name="normal_login"
                        className="login-form"
                        onFinish={this.onFinish}
                        {...formItemLayout}
                        style={{ height: '520px' }}
                    >
                        <Form.Item
                            name="username"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your Username!',
                                },
                            ]}
                        >
                            <Input
                                suffix='@whittleschool.org'
                                prefix={<UserOutlined className="site-form-item-icon" />}
                                placeholder="Username"
                                id='username' />
                        </Form.Item>
                        <Form.Item
                            name="password"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your Password!',
                                },
                            ]}
                        >
                            <Input.Password
                                prefix={<LockOutlined className="site-form-item-icon" />}
                                type="password"
                                placeholder="Password"
                                id='password'
                            />
                        </Form.Item>
                        <Form.Item {...tailFormItemLayout} >
                            <Button type="primary" onClick={this.makeUserInfor} className="login-form-button">
                                Log in
                            </Button>
                            <Button type='link' onClick={this.navigateToRegister}>Register</Button>
                        </Form.Item>
                    </Form>
                </Content>
                <Footer style={{ textAlign: "center" }}>AppointMeow 2021</Footer>
            </Layout>

        );
    };
};

export default Login;