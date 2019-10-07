import React, { useState } from 'react';
import { Menu, Button, Icon, Layout } from 'antd';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import ShoppingCart from './ShoppingCart';

const StyledSidebar = styled.div`
    position: absolute;
    height: 100%;
    width: 100%;
    top: 0;
    left: 0;
    background-color: white;
    opacity: 0.9;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    z-index: 1;
    font-family: 'Crimson Text', serif;

    a {
        font-size: 28px;
        margin: 20px 0;
        color: #001529;
    }
`;

const StyledMobileTopPanel = styled.div`
    width: 100%;
    display: flex;
    justify-content: space-between;
    padding: 10px;
    box-sizing: border-box;
`;

const Sidebar = ({ authenticated, account_type }) => {

    const [collapsed, setCollapsed] = useState(true);

    return (
        <div>
            <StyledMobileTopPanel>
                <Button type="primary" onClick={() => setCollapsed(false)}>
                    <Icon type={collapsed ? 'menu-unfold' : 'menu-fold'} />
                </Button>
                <img
                    src="/images/logo.png"
                    height="30"
                    width="30"
                />
                <ShoppingCart color="#1890ff" />
            </StyledMobileTopPanel>
            <StyledSidebar style={{display: collapsed ? 'none': 'flex'}} onClick={() => setCollapsed(true)}>
                <Button onClick={() => setCollapsed(true)} style={{position: 'absolute', right: 10, top: 10}}>
                    <Icon type="close" />
                </Button>
                <img
                    src="/images/logo.png"
                    height="100"
                    width="100"
                />
                {account_type === 'supplier'
                    ? <React.Fragment>
                        <Link to="/">Orders</Link>
                        <Link to="/inventory">Inventory</Link>
                        <Link to="/clients">Clients</Link>
                        <Link to="/clients">Settings</Link>
                        <Link to="/logout">Logout</Link>
                    </React.Fragment>
                    : <React.Fragment>
                        <Link to="/">Browse</Link>
                        {authenticated
                            ? <React.Fragment>
                                <Link to="/orders">My Orders</Link>
                                <Link to="/order-history">Order History</Link>
                                <Link to="/logout">Logout</Link>
                            </React.Fragment>
                            : <React.Fragment>
                                <Link to="/login">Login</Link>
                                <Link to="/register">Sign Up</Link>   
                            </React.Fragment>
                        }
                    </React.Fragment>
                }
            </StyledSidebar>
        </div>
    )
};

export default Sidebar;