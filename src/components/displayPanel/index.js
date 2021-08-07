import React from 'react';
import {Table} from 'antd';
// import {Col, Row} from 'antd';
// import styles from './index.module.css';

const columns = [
    {
        weekDate: 'Monday',
        dataIndex: 1,
        // width:
    }
]


export default class displayPanel extends React.Component{
    constructor(props){
        super(props);
    }

    render (){
        const {dataSource} = this.props
        return(  
            <div>
                <Table>

                </Table>
            </div>
        )
    };
}
