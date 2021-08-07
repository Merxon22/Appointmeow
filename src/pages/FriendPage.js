import React from "react";
import { Button, Layout } from "antd";
import { Menu } from 'antd';
import { Calendar } from 'antd';
import {
    DesktopOutlined,
    TeamOutlined,
    SettingOutlined,
    BellOutlined
} from '@ant-design/icons';
import "../css/Home.css";
import moment from 'moment';
import { List, Card } from "antd";
import { Tabs } from 'antd';
// moment.locale('zh-cn');


const { Header, Content, Sider, Footer } = Layout;
const { Item } = Menu;
const { TabPane } = Tabs;
const date = moment().format('YYYY-MM-DD');
const weekday = moment().weekday(); // will return 0~6 (Sun~Sat)

class FriendPage extends React.Component {
    constructor(props) {
        super(props)
        const urlInfor = this.getQuery(props.location.search)
        this.state = {
            collapsed: true,
            current: 'mail',
            isShow: false,
            tempoID: urlInfor.lk,
            friendEmail: urlInfor.fe,
            currentPage: 'sun',
            data0: [],
            data1: [],
            data2: [],
            data3: [],
            data4: [],
            data5: [],
            data6: [],
        }
    }

    getQuery = str => {
        return str
            .replace('?', '')
            .split('&')
            .reduce((r, i) => {
                const [key, value] = i.split('=');
                return { ...r, [key]: value };
            }, {});
    }

    componentWillMount = () => {
        this.getData()
    }

    getData = () => {
        const tempoID = this.state.tempoID
        const email = this.state.friendEmail
        fetch('home/events/' + tempoID, {
            method: 'POST',
            body: JSON.stringify({
                loginKey: tempoID,
                friendEmail: email,
                date: date,
                weekday: weekday,
            }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8'
            }
        }).then(response => response.json()).then(message => {
            const mes = message['message']
            if (mes === false) {
                this.props.history.push("/")
            } else {
                const sun = message['sun'];
                const mon = message['mon'];
                const tue = message['tue'];
                const wed = message['wed'];
                const thu = message['thu'];
                const fri = message['fri'];
                const sat = message['sat'];
                this.setState({
                    data0: sun,
                    data1: mon,
                    data2: tue,
                    data3: wed,
                    data4: thu,
                    data5: fri,
                    data6: sat,
                })
            }
        })
    }

    onCollapse = collapsed => {
        console.log(collapsed);
        this.setState({ collapsed });
    };

    handleClick = e => {
        console.log('click ', e);
        const lk = this.state.tempoID;
        // const lk = 1234567
        this.setState({ current: e.key });
        const key = e.key;
        if (key === "setting") {
            this.props.history.push('/setting?lk=' + lk)
        } else if (key === "friends") {
            this.props.history.push('/friends?lk=' + lk)
        } else if (key === "alarms") {
            this.props.history.push('/alarms?lk=' + lk)
        } else {
            this.props.history.push('/home?lk=' + lk)
        };
    };

    onPanelChange = function (value, mode) {
        console.log(value, mode);
    };

    tabOnChange = (e) => {
        const activeKey = e
        this.setState({
            currentPage: activeKey
        })
    }

    calendarOnSelect = value => {
        const tempoID = this.state.tempoID
        const friendEmail = this.state.friendEmail
        console.log(moment(value).format('YYYY-MM-DD'))
        console.log(moment(value).weekday())
        fetch('home/events/' + tempoID, {
            method: 'POST',
            body: JSON.stringify({
                loginKey: tempoID,
                friendEmail: friendEmail,
                date: moment(value).format("YYYY-MM-DD"),
                weekday: moment(value).weekday(),
            }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8'
            }
        }).then(response => response.json()).then(message => {
            const mes = message['message']
            if (mes === false) {
                this.props.history.push("/")
            } else {
                const sun = message['sun'];
                const mon = message['mon'];
                const tue = message['tue'];
                const wed = message['wed'];
                const thu = message['thu'];
                const fri = message['fri'];
                const sat = message['sat'];
                this.setState({
                    data0: sun,
                    data1: mon,
                    data2: tue,
                    data3: wed,
                    data4: thu,
                    data5: fri,
                    data6: sat,
                })
            }
        })
    };

    // componentWillUnmount=()=>{
    //     const tempoID=this.state.tempoID
    //     fetch('logout/'+tempoID,{
    //         method: 'POST',
    //         body: JSON.stringify({
    //             logOut: true
    //         }),
    //         headers:{
    //             'Content-type':'application/json; charset=UTF-8'
    //         }
    //     })
    // }

    render() {
        const { collapsed } = this.state;
        const { current } = this.state;
        const { data0, data1, data2, data3, data4, data5, data6 } = this.state;

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
                        <div className='content-warp'>
                            <Calendar
                                onPanelChange={this.onPanelChange}
                                fullscreen={false}
                                className="site-calendar-demo-card"
                                id='calendar'
                                onSelect={this.calendarOnSelect}
                            // value={this.state.currentDate}
                            />
                            <Tabs
                                defaultActiveKey="sun"
                                centered
                                className={collapsed === true ? "display-detail-normal" : 'display-detail-small'}
                                type='card'
                                onChange={this.tabOnChange}
                            >
                                <TabPane tab="Sun" key="sun">
                                    <List
                                        className='HomeEvent'
                                        dataSource={data0}
                                        renderItem={item => (
                                            <List.Item>
                                                <div className='home-event-display'>
                                                    <Card className='home-event-card' title={item.eventName} hoverable>
                                                        <div>StartTime: {item.startTime}</div>
                                                        <div>EndTime: {item.endTime}</div>
                                                        <div>Detail: {item.detail}</div>
                                                    </Card>
                                                </div>
                                            </List.Item>
                                        )}
                                    />
                                </TabPane>
                                <TabPane tab="Mon" key="mon">
                                    <List
                                        className='HomeEvent'
                                        dataSource={data1}
                                        renderItem={item => (
                                            <List.Item>
                                                <div className='home-event-display'>
                                                    <Card title={item.eventName} hoverable>
                                                        <div>StartTime: {item.startTime}</div>
                                                        <div>EndTime: {item.endTime}</div>
                                                        <div>Detail: {item.detail}</div>
                                                    </Card>
                                                </div>
                                            </List.Item>
                                        )}
                                    />
                                </TabPane>
                                <TabPane tab="Tue" key="tue">
                                    <List
                                        className='HomeEvent'
                                        dataSource={data2}
                                        renderItem={item => (
                                            <List.Item>
                                                <div className='home-event-display'>
                                                    <Card title={item.eventName} hoverable>
                                                        <div>StartTime: {item.startTime}</div>
                                                        <div>EndTime: {item.endTime}</div>
                                                        <div>Detail: {item.detail}</div>
                                                    </Card>
                                                </div>
                                            </List.Item>
                                        )}
                                    />
                                </TabPane>
                                <TabPane tab="Wed" key="wed">
                                    <List
                                        className='HomeEvent'
                                        dataSource={data3}
                                        renderItem={item => (
                                            <List.Item>
                                                <div className='home-event-display'>
                                                    <Card title={item.eventName} hoverable>
                                                        <div>StartTime: {item.startTime}</div>
                                                        <div>EndTime: {item.endTime}</div>
                                                        <div>Detail: {item.detail}</div>
                                                    </Card>
                                                </div>
                                            </List.Item>
                                        )}
                                    />
                                </TabPane>
                                <TabPane tab="Thu" key="thu">
                                    <List
                                        className='HomeEvent'
                                        dataSource={data4}
                                        renderItem={item => (
                                            <List.Item>
                                                <div className='home-event-display'>
                                                    <Card title={item.eventName} hoverable>
                                                        <div>StartTime: {item.startTime}</div>
                                                        <div>EndTime: {item.endTime}</div>
                                                        <div>Detail: {item.detail}</div>
                                                    </Card>
                                                </div>
                                            </List.Item>
                                        )}
                                    />
                                </TabPane>
                                <TabPane tab="Fri" key="fri">
                                    <List
                                        className='HomeEvent'
                                        dataSource={data5}
                                        renderItem={item => (
                                            <List.Item>
                                                <div className='home-event-display'>
                                                    <Card title={item.eventName} hoverable>
                                                        <div>StartTime: {item.startTime}</div>
                                                        <div>EndTime: {item.endTime}</div>
                                                        <div>Detail: {item.detail}</div>
                                                    </Card>
                                                </div>
                                            </List.Item>
                                        )}
                                    />
                                </TabPane>
                                <TabPane tab="Sat" key="sat">
                                    <List

                                        className='HomeEvent'
                                        dataSource={data6}
                                        renderItem={item => (
                                            <List.Item>
                                                <div className='home-event-display'>
                                                    <Card title={item.eventName} hoverable>
                                                        <div>StartTime: {item.startTime}</div>
                                                        <div>EndTime: {item.endTime}</div>
                                                        <div>Detail: {item.detail}</div>
                                                    </Card>
                                                </div>
                                            </List.Item>
                                        )}
                                    />
                                </TabPane>
                            </Tabs>
                        </div>
                    </Content>
                    <Footer style={{ textAlign: "center" }}>AppointMeow 2021</Footer>
                </Layout>
            </Layout>

        )
    }
}

export default FriendPage;