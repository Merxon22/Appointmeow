import React from 'react';
import { Layout } from "antd";
import { Form, Input, Button, Radio  } from 'antd';
// import {Select} from 'antd';
import {message} from 'antd';

// const { Option } = Select;
const { Header, Content, Footer } = Layout;
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

class Register extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            // iden: '',
            value: 'student'
        }
    }

    onFinish = (values) => {
        console.log('Received values of form: ', values);
    };

    navigateToLogin = () => {
        this.props.history.push('/login')
    };

    error = () => {
        message.error('This account has already registered');
    };

    // onSelect = (e) =>{
    //     console.log(e);
    //     const iden = e
    //     this.setState={
    //         iden: iden
    //     }
    // }

    onChange=(e)=>{
        console.log(e.target.value);
        this.setState({
            value: e.target.value
        })
    }

    register= () => {
        const un = document.getElementById('username').value;
        // const em = document.getElementById('e-mail').value;
        const pw = document.getElementById('password').value;
        const idd= this.state.value;
        const cpw = document.getElementById('comfPassword').value;
        // console.log(this.state.value)
        // const userInfor = {
        //     username: un,
        //     password: pw
        // }
        if (pw === cpw){
        fetch('register/createuser',{
            method: 'POST',
            body: JSON.stringify({
                username: un,
                // eMail: em,
                password: pw,
                identity: idd
            }),
            headers:{
                'Content-type':'application/json; charset=UTF-8'
            }
        }).then(response => response.json()).then( message =>{
            const judge = message['message']
            if(judge === true){
                this.props.history.push('/login')
            }else{
                this.error();
            }
        })}else{
            message.error('Something is wrong while register')
        }
    }

    render() {
        const value=this.state.value
        // const satisfy=this.state.satisfy
        return (
            <Layout>
                <Header className="site-layout-sub-header-background" style={{ padding: 0, margin: '50px' }}>
                    AppointMeow
                </Header>
                <Content style={{ padding: '0 50px', width: '80%', alignItems: "center", margin: '20px' }}>
                    <Form
                        name="register"
                        onFinish={this.onFinish}
                        scrollToFirstError
                        {...formItemLayout}
                        style={{height:'520px'}}
                    >
                        <Form.Item
                            name="name"
                            label="Name"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input the prefix of your e-mail as your username!',
                                    whitespace: true,
                                },
                            ]}
                        >
                            <Input 
                                id='username'
                                suffix='@whittleschool.org'
                            />
                        </Form.Item>
                        
                        {/* <Form.Item
                            name="email"
                            label="E-mail"
                            rules={[
                                {
                                    type: 'email',
                                    message: 'The input is not valid E-mail!',
                                },
                                {
                                    required: true,
                                    message: 'Please input your E-mail!',
                                },
                            ]}
                        >
                            <Input id ='e-mail'/>
                        </Form.Item> */}

                        <Form.Item
                            name="password"
                            label="Password"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your password!',
                                },
                            ]}
                            hasFeedback
                        >
                            <Input.Password id ='password' />
                        </Form.Item>

                        <Form.Item
                            name="confirm"
                            label="Confirm Password"
                            dependencies={['password']}
                            hasFeedback
                            rules={[
                                {
                                    required: true,
                                    message: 'Please confirm your password!',
                                },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue('password') === value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error('The two passwords that you entered do not match!'));                               
                                    },
                                }),
                            ]}
                        >
                            <Input.Password id='comfPassword'/>
                        </Form.Item>

                        <Form.Item
                            name='identity'
                            label="Identity"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please choose your identity!'
                                }
                            ]}
                        >
                            {/* <Select id = 'identity' onSelect={this.onSelect}>
                                <Select.Option value="student">Student</Select.Option>
                                <Select.Option value="staff">Staff</Select.Option>
                            </Select> */}
                            <Radio.Group onChange={this.onChange} value={value} id='identity'>
                                <Radio value={'student'}>Student</Radio>
                                <Radio value={'staff'}>Staff</Radio>
                            </Radio.Group>
                        </Form.Item>

                        <Form.Item {...tailFormItemLayout} >
                            <Button type="primary" onClick={this.register}>
                                Register
                            </Button>
                            <Button type="link" onClick={this.navigateToLogin}>
                                Back to Login
                            </Button>
                        </Form.Item>
                    </Form>
                </Content>
                <Footer style={{ textAlign: "center"}}>AppointMeow 2021</Footer>
            </Layout>

        )
    }
};

export default Register;