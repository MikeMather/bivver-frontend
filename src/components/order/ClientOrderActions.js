import React from 'react';
import { Dropdown, Menu, Icon, Button } from 'antd';

const ClientOrderActions = ({ order, type }) => {

    const menu = (
        <Menu>
            <Menu.Item key="0">
                <Icon type="check-circle" />
                Submit
            </Menu.Item>
            <Menu.Item key="1">
                <Icon type="file-pdf" />
                Download PDF
            </Menu.Item>
            <Menu.Item key="2" disabled>
                <Icon type="credit-card" />
                Pay Now
            </Menu.Item>
            <Menu.Item key="3">
                <Icon type="delete" />
                Delete
            </Menu.Item>
        </Menu>
    );

    return (
        <Dropdown overlay={menu} trigger={['click']} placement="bottomRight">
            <Button type={type}>Actions <Icon type="down" /></Button>
        </Dropdown>
    )
};

export default ClientOrderActions;