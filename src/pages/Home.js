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
// import Calendar2 from '../utility/Calendar2.js';
import "../css/Home.css";
import moment from 'moment';
// import { Card, Col, Row } from 'antd';
// import { Timeline } from 'antd';
import { List, Card } from "antd";
// import { TimePicker } from "antd";
// import { Typography} from 'antd';
// const { Paragraph, Text } = Typography;
import { Tabs } from 'antd';
import AddEventModal from '../components/AddEventModal'
import { BackTop } from "antd";
// moment.locale('zh-cn');


const { Header, Content, Sider, Footer } = Layout;
const { Item } = Menu;
// const { SubMenu } = Menu;
const { TabPane } = Tabs;
const date = moment().format('YYYY-MM-DD');
const weekday = moment().weekday(); // will return 0~6 (Sun~Sat)

class Home extends React.Component {
    constructor(props) {
        super(props)
        const tempoID = this.getQuery(props.location.search)
        this.state = {
            collapsed: true,
            current: 'mail',
            isShow: false,
            tempoID: tempoID.lk,
            currentPage: 'sun',
            data0: [
                // {
                //     key: 0,
                //     eventName: '1',
                //     startTime: "0700",
                //     endTime: '0800',
                //     detail: 'appointMeow1'
                // },
                // {
                //     key: 1,
                //     eventName: '2',
                //     startTime: "0800",
                //     endTime: '0900',
                //     detail: 'appointMeow2'
                // }
            ],
            data1: [],
            data2: [],
            data3: [],
            data4: [],
            data5: [],
            data6: [],
        }
    }

    // onChangeDate = value => {
    //     this.setState({ currentDate: value });
    // }
    // getChangeDate = value => {
    //     if (value) {
    //         let year = value.getFullYear();
    //         let month = value.getMonth() + 1;
    //         let day = value.getDate();
    //         return year + '年' + month + '月' + day + '日'
    //     }
    // }

    // dateCellRender = value => {
    //     return <div>this.getChangeDate(value)</div>
    // }

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
        console.log('component will mount')
        this.getData()
    }

    getData = () => {
        const tempoID = this.state.tempoID
        fetch('home/events/' + tempoID, {
            method: 'POST',
            body: JSON.stringify({
                loginKey: tempoID,
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

    // showData = () => {
    //     //get data
    //     const data = this.state.data;
    //     console.log(data.length);
    //     //get where to put the event
    //     const sun = document.getElementById("newEvent0");
    //     const mon = document.getElementById("newEvent1");
    //     const tue = document.getElementById("newEvent2");
    //     const wed = document.getElementById("newEvent3");
    //     const thu = document.getElementById("newEvent4");
    //     const fri = document.getElementById("newEvent5");
    //     const sat = document.getElementById("newEvent6");
    //     //function for putting the event into somewhere
    //     function addTimelineItem(x, y) {
    //         var tli = document.createElement('Timeline.Item');
    //         tli.innerHTML = x;
    //         // tli.lable = x.startTime+"to"+x.endTime;
    //         console.log(tli);
    //         y.appendChild(tli);
    //     };
    //     //check every event get from backend
    //     for (var i in data) {
    //         const obj = data[i]
    //         console.log(obj)
    //         if (obj.weekday === 0) {
    //             console.log(obj.eventName)
    //             addTimelineItem(obj.eventName, sun)
    //             console.log("success")
    //         } else if (obj.weekday === 1) {
    //             console.log(obj.eventName)
    //             addTimelineItem(obj.eventName, mon)
    //             console.log("success")
    //         } else if (obj.weekday === 2) {
    //             console.log(obj.eventName)
    //             addTimelineItem(obj.eventName, tue)
    //             console.log("success")
    //         } else if (obj.weekday === 3) {
    //             console.log(obj.eventName)
    //             addTimelineItem(obj.eventName, wed)
    //             console.log("success")
    //         } else if (obj.weekday === 4) {
    //             console.log(obj.eventName)
    //             addTimelineItem(obj.eventName, thu)
    //             console.log("success")
    //         } else if (obj.weekday === 5) {
    //             console.log(obj.eventName)
    //             addTimelineItem(obj.eventName, fri)
    //             console.log("success")
    //         } else if (obj.weekday === 6) {
    //             console.log(obj.eventName)
    //             addTimelineItem(obj.eventName, sat)
    //             console.log("success")
    //         }
    //     }
    // }


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
            console.log(key)
            this.props.history.push('/setting?lk=' + lk)
        } else if (key === "friends") {
            console.log(key)
            this.props.history.push('/friends?lk=' + lk)
        } else if (key === "alarms") {
            console.log(key)
            this.props.history.push('/alarms?lk=' + lk)
        } else {
            console.log(key)
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

    showModal = () => {
        this.setState({
            isShow: true
        })
    }

    hideModal = () => {
        this.setState({
            isShow: false
        })
    }

    calendarOnSelect = value => {
        const tempoID = this.state.tempoID
        console.log(moment(value).format('YYYY-MM-DD'))
        console.log(moment(value).weekday())
        fetch('home/events/' + tempoID, {
            method: 'POST',
            body: JSON.stringify({
                loginKey: tempoID,
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

    delete = (e) => {
        const tempoID = this.state.tempoID
        const buttonID = e.currentTarget.id
        fetch('eventdelete', {
            method: 'POST',
            body: JSON.stringify({
                loginKey: tempoID,
                deleteTarget: buttonID,
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

    render() {
        const { collapsed } = this.state;
        const { current } = this.state;
        const { isShow } = this.state;
        const { tempoID } = this.state;
        const { data0, data1, data2, data3, data4, data5, data6 } = this.state;
        // const { currentDate } = this.state;
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
                                tabBarExtraContent={
                                    <Button
                                        className='addEvent'
                                        type='primary'
                                        onClick={this.showModal}
                                        style={{ width: 100 }}
                                    >
                                        New Event
                                    </Button>
                                }
                            >
                                <TabPane tab="Sun" key="sun">
                                    <List
                                        className='HomeEvent'
                                        dataSource={data0}
                                        renderItem={item => (
                                            <List.Item>
                                                <div className='home-event-display'>
                                                    <Card className='home-event-card'
                                                        title={item.eventName}
                                                        hoverable
                                                        extra={<Button type='dashed' id={item.key} onClick={this.delete}>X</Button>}>
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
                                                    <Card className='home-event-card'
                                                        title={item.eventName}
                                                        hoverable
                                                        extra={<Button type='dashed' id={item.key} onClick={this.delete}>X</Button>}>
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
                                                    <Card className='home-event-card'
                                                        title={item.eventName}
                                                        hoverable
                                                        extra={<Button type='dashed' id={item.key} onClick={this.delete}>X</Button>}>
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
                                                    <Card
                                                        className='home-event-card'
                                                        title={item.eventName}
                                                        hoverable
                                                        extra={<Button type='dashed' id={item.key} onClick={this.delete}>X</Button>}>
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
                                                    <Card
                                                        className='home-event-card'
                                                        title={item.eventName}
                                                        hoverable
                                                        extra={<Button type='dashed' id={item.key} onClick={this.delete}>X</Button>}>
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
                                                    <Card
                                                        className='home-event-card'
                                                        title={item.eventName}
                                                        hoverable
                                                        extra={<Button type='dashed' id={item.key} onClick={this.delete}>X</Button>}>
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
                                                    <Card
                                                        className='home-event-card'
                                                        title={item.eventName}
                                                        hoverable
                                                        extra={<Button type='dashed' id={item.key} onClick={this.delete}>X</Button>}>
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
                            <AddEventModal
                                visible={isShow}
                                onCancel={this.hideModal}
                                tempoID={tempoID}
                                date={date}
                                weekday={weekday}
                                action = {this.getData}
                                // parent={this}
                            />
                        </div>
                    </Content>
                    <BackTop />
                    <Footer style={{ textAlign: "center" }}>AppointMeow 2021</Footer>
                </Layout>
            </Layout>

        )
    }
}

export default Home;