import React from 'react';
import { Button, Modal } from 'antd';
import { TimePicker, Input, DatePicker } from 'antd';
// import {Image, Menu, Input, Checkbox, Button} from 'antd';
// import styles from './index.module.css';
import { ArrowRightOutlined } from '@ant-design/icons';
// import {Tabs} from 'antd';
// import moment from 'moment';
import './index.module.css'
import { message } from 'antd';
// import { withRouter } from "react-router-dom";


const { TextArea } = Input;
// const date = moment().format('YYYY-MM-DD');

class AddEventModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            creatNew: false,
            msg: {
                data0: [],
                data1: [],
                data2: [],
                data3: [],
                data4: [],
                data5: [],
                data6: [],
            }
        }
    }

    // getQuery = str => {
    //     return str
    //         .replace('?', '')
    //         .split('&')
    //         .reduce((r, i) => {
    //             const [key, value] = i.split('=');
    //             return { ...r, [key]: value };
    //         }, {});
    // }

    // toParent = () => {
    //     this.props.parent.getNewEvent(this, this.state.msg)
    // }

    error = () => {
        message.error('Already have existing events in this time block!');
    };

    // save = () => {
    //     const name = document.getElementById("eventName").value;
    //     const tempoID = this.props.tempoID;
    //     const beginDate = document.getElementById('beginDate').value;
    //     const endDate = document.getElementById('endDate').value;
    //     const beginTime = document.getElementById('beginTime').value;
    //     const endTime = document.getElementById('endTime').value;
    //     const detail = document.getElementById('detail').value;
    //     fetch('home/createevent', {
    //         method: 'POST',
    //         body: JSON.stringify({
    //             loginKey: tempoID,
    //             eventName: name,
    //             beginDate: beginDate,
    //             endDate: endDate,
    //             beginTime: beginTime,
    //             endTime: endTime,
    //             detail: detail
    //         }),
    //         headers: {
    //             'Content-type': 'application/json; charset=UTF-8'
    //         }
    //     }).then(response => response.json()).then(message => {
    //         const data = message['message'];
    //         console.log(data)
    //         if (data === 'false') {
    //             console.log(data)
    //             this.props.history.push("/")
    //         } else if (data === 'success') {
    //             console.log(data)
    //             this.props.history.push('/home?lk=' + tempoID)
    //         } else if (data === 'error') {
    //             console.log(data)
    //             this.error();
    //             this.onCancel()
    //         }
    //     })
    // }

    save = () => {
        const name = document.getElementById("eventName").value;
        const tempoID = this.props.tempoID;
        const beginDate = document.getElementById('beginDate').value;
        const endDate = document.getElementById('endDate').value;
        const beginTime = document.getElementById('beginTime').value;
        const endTime = document.getElementById('endTime').value;
        const detail = document.getElementById('detail').value;
        fetch('home/createevent', {
            method: 'POST',
            body: JSON.stringify({
                loginKey: tempoID,
                eventName: name,
                beginDate: beginDate,
                endDate: endDate,
                beginTime: beginTime,
                endTime: endTime,
                detail: detail
            }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8'
            }
        }).then(response => response.json()).then(message => {
            const data = message['message'];
            console.log(data)
            if (data === 'false') {
                console.log(data)
                this.props.history.push("/")
            } else if (data === 'success') {
                console.log(data)
                this.props.action()
                this.props.onCancel()
            } else if (data === 'error') {
                console.log(data)
                this.error();
            }
        })
    }

    render() {
        const { visible, onCancel } = this.props;
        return (
            <Modal
                style={{ width: 300, minHeight: 800 }}
                visible={visible}
                onCancel={onCancel}
                footer={null}
                destroyOnClose={true}
            >
                <div className='modal-display'>
                    {/* <div>Add New Event</div> */}
                    <Input
                        placeholder='event name'
                        defaultValue='New Event'
                        bordered={false}
                        id='eventName'
                    />
                    <div className='date'>
                        <DatePicker
                            placeholder='beginDate'
                            id='beginDate'
                        // defaultValue={date} 
                        />
                        <ArrowRightOutlined />
                        <DatePicker placeholder='endDate'
                            id='endDate'
                        // defaultValue={date} 
                        />
                    </div>
                    <div className='time'>
                        <TimePicker format='HH:mm' id='beginTime' placeholder='Begin Time' />
                        <ArrowRightOutlined />
                        <TimePicker format='HH:mm' id='endTime' placeholder='End Time' />
                    </div>
                    <TextArea placeholder='detail' rows={4} id='detail' />
                    <Button onClick={this.save}>save</Button>
                </div>
            </Modal>
        )
    }
}

// export default withRouter(AddEventModal);
export default AddEventModal;