import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { Layout, Button, Dropdown, Menu, Input, Icon } from 'antd'
import ShoppingCart from './ShoppingCart';

const { Header } = Layout;

const StyledMenu = styled.div`
    display: flex;
    justify-content: flex-start;
    align-items: center;
    font-family: 'Crimson Text', serif;
    font-size: 18px;
    height: 100%;
    width: 100%;

    a {
        margin-right: 25px;
        letter-spacing: 1px;
        text-decoration: none;
        color: white;
        display: flex;
        align-items: center;
    }

    a:hover {
        color: #239ED9;
    }

    img {
        margin: auto 0;
    }
`;

const StyledLoginButton = styled.div`
    width: 140px;
    height: 100%;
    color: white;
    display: flex;
    justify-content: space-evenly;
`;

const SettingsMenu = (
    <Menu style={{width: '160px'}} placement="bottomRight">
        <Menu.Item key="0"><Link to="/settings">Settings</Link></Menu.Item>
        <Menu.Item key="1"><Link to="/logout">Logout</Link></Menu.Item>
    </Menu>
);

const TopPanel = ({ authenticated, account_type }) => (
    <Header style={{display: 'flex', alignItems: 'center'}}>
        <StyledMenu>
            <Link to="/">
                <img
                    src="/images/logo.png"
                    height="50"
                    width="50"
                />
            </Link>
            {account_type === 'supplier'
                ? (authenticated && 
                    <React.Fragment>
                        <Link to="/">Orders</Link>
                        <Link to="/inventory">Inventory</Link>
                        <Link to="/clients">Clients</Link>
                    </React.Fragment>
                )
                : (authenticated
                    ? <React.Fragment>
                        <Link to="/">Browse</Link>
                        <Link to="/orders">My Orders</Link>
                        <Link to="/order-history">Order History</Link>
                    </React.Fragment>
                    : <React.Fragment>
                        <Link to="/browse">Browse</Link>
                        <Input.Search 
                            placeholder="Search for suppliers or products" 
                            onSearch={() => {}} 
                            style={{width: 400}}
                            size="large"
                        />
                    </React.Fragment>
                )
            }
        </StyledMenu>

        {authenticated
            ?  <React.Fragment>
                    {account_type !== 'supplier' && <ShoppingCart />}
                    <Dropdown overlay={SettingsMenu} trigger={['click']}>
                        <Button
                            icon="user"
                        />    
                    </Dropdown>
                </React.Fragment>
            : <StyledLoginButton>
                <Link to="/register">Sign Up</Link>
                <span> / </span>
                <Link to="/login">Login</Link>
            </StyledLoginButton>
        }
        
    </Header>
);

export default TopPanel;