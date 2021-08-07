import React from "react";
import { Layout, Button } from "antd";
import { Menu } from 'antd';
import {
    DesktopOutlined,
    TeamOutlined,
    SettingOutlined,
    BellOutlined
} from '@ant-design/icons';

const { Header, Content, Sider, Footer } = Layout;
const { Item } = Menu;
// const { SubMenu } = Menu;

class Setting extends React.Component {
    constructor(props) {
        super(props);
        const tempoID = this.getQuery(props.location.search);
        this.state = {
            collapsed: true,
            current: 'mail',
            tempoID: tempoID.lk
        }
    };

    getQuery = str => {
        return str
            .replace('?', '')
            .split('&')
            .reduce((r, i) => {
                const [key, value] = i.split('=');
                return { ...r, [key]: value };
            }, {});
    }

    onCollapse = collapsed => {
        console.log(collapsed);
        this.setState({ collapsed });
    };

    handleClick = e => {
        console.log('click ', e);
        this.setState({ current: e.key });
        const lk = this.state.tempoID
        const key = e.key;
        if (key === "setting") {
            this.props.history.push('/setting?lk='+lk)
        } else if (key === "friends") {
            this.props.history.push('/friends?lk='+lk)
        } else if (key === "alarms") {
            this.props.history.push('/alarms?lk='+lk)
        } else {
            this.props.history.push('/home?lk='+lk)
        };
    };

    navigateTologin = () => {
        this.props.history.push('/login')
    };

    //需要修改fetch的url
    logout = () => {
        fetch('settings/', {
            method: 'POST',
            body: JSON.stringify({
                logOut: true
            }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8'
            }
        }).then(
            this.props.history.push('/')
        )
    }

    componentWillUnmount=()=>{
        const tempoID=this.state.tempoID
        fetch('logout/'+tempoID,{
            method: 'POST',
            body: JSON.stringify({
                logOut: true
            }),
            headers:{
                'Content-type':'application/json; charset=UTF-8'
            }
        })
    }

    render() {
        const { collapsed } = this.state;
        const { current } = this.state;
        return (
            <Layout className="layout">
                <Sider collapsible collapsed={collapsed} onCollapse={this.onCollapse}>
                    <Menu theme="dark" defaultSelectedKeys={['home']} mode='inline' onClick={this.handleClick} selectedKeys={[current]}>
                        <Item key="home" icon={<DesktopOutlined />}>Home</Item>
                        <Item key="setting" icon={<SettingOutlined />}>Setting</Item>
                        <Item key="friends" icon={<TeamOutlined />}>Friends</Item>
                        <Item key="alarms" icon={<BellOutlined />}>Alarms</Item>
                    </Menu>
                </Sider>
                <Layout>
                    <Header className="site-layout-sub-header-background" style={{ padding: 0 }}>
                        AppointMeow
                    </Header>
                    <Content style={{ padding: '0 50px' }}>
                        <Layout>
                            <Content>
                            <Button type='primary' onClick={this.logout}>Logout</Button>
                            </Content>
                        </Layout>
                    </Content>
                    <Footer style={{ textAlign: "center" }}>AppointMeow 2021</Footer>
                </Layout>
            </Layout>

        )
    }
}



export default Setting;