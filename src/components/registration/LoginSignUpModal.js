import React, { useState, useContext } from 'react';
import { StoreContext } from '../../context/store';
import LoginForm from './LoginForm';
import RegisterClient from './RegisterClient';
import { Modal, Menu } from 'antd';

const LoginSignUpModal = ({ callback, handleCancel }) => {

    const [currentTab, setCurrentTab] = useState('login')
    const { actions } = useContext(StoreContext);

    return (
        <Modal
            title="Login/Sign up to start placing orders"
            centered
            visible
            footer={null}
            bodyStyle={{height: '90vh', overflowY: 'auto'}}
            width="auto"
            maskClosable
            onCancel={handleCancel}
        >
            <Menu
                onClick={e => setCurrentTab(e.key)}
                selectedKeys={[currentTab]}
                mode="horizontal"
            >
                <Menu.Item key="login">Login</Menu.Item>
                <Menu.Item key="register">Sign Up</Menu.Item>
            </Menu>
            {currentTab === 'login'
                ? <LoginForm asModal callback={callback} />
                : <RegisterClient asModal />
            }
        </Modal>
    );
}


export default LoginSignUpModal;