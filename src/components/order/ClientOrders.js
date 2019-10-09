import React, { useContext, useState, useEffect } from 'react';
import { StoreContext } from '../../context/store';
import Carts from './Carts';
import { List, Button, Avatar, Typography, Icon, Tag, Radio, Menu, Dropdown } from 'antd';
import Image from '../common/Image';
import { ORDER_STATES } from '../../utils/constants';
import { capitalize } from '../../utils/utils';
import ClientOrderActions from './ClientOrderActions';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import moment from 'moment';

const OrderContainer = styled.div`
    max-width: 80%;
    margin: 0 auto;

    @media screen and (max-width: 768px) {
        max-width: 100%;
    }
`;

const FilterMenu = ({ onChange, selected }) => {
    const radioStyle = {
        display: 'block',
        marginTop: 5
    };

    return (
        <Menu style={{width: 200}}>
            <Radio.Group 
                onChange={e => onChange(e.target.value)} 
                value={selected}
                style={{marginRight: 5, marginLeft: 5, marginTop: 5}}
            >
                {ORDER_STATES.all.map(state => (
                    <Radio key={state} value={state} style={radioStyle}>{ORDER_STATES.client[state].title}</Radio>
                ))}
            </Radio.Group>
            <Menu.Item>
                <Button type="link" onClick={() => onChange('')}>Clear</Button>
            </Menu.Item>
        </Menu>
    );
}

const ClientOrders = () => {

    const { state } = useContext(StoreContext);
    const [filter, setFilter] = useState();
    const [orders, setOrders] = useState(state.client.orders);

    useEffect(() => {
        const newOrders = state.client.orders.sort((a, b) => moment(b.updated_at).diff(moment(a.updated_at)))
        if (filter) {
            setOrders(newOrders.filter(order => order.state === filter));
        }
        else {
            setOrders(newOrders);
        }
    }, [state, filter])

    return (
        <OrderContainer>
            <div style={{display: 'flex', justifyContent: 'space-between'}}>
                <Typography.Title level={4}>Your Open Orders</Typography.Title>
                <Dropdown overlay={<FilterMenu onChange={val => setFilter(val)} selected={filter} />}>
                    <Button>Filter <Icon type="down" /></Button>
                </Dropdown>
            </div>
            <List
                itemLayout="horizontal"
                size="large"
                dataSource={orders}
                renderItem={order => (
                    <List.Item
                        actions={[
                            <Link to={`/orders/${order.id}`}>View</Link>,
                            <ClientOrderActions order={order} />
                        ]}
                    >
                        <List.Item.Meta
                            avatar={<Image src={order.supplier.image} width="200px" height="200px" />}
                            title={<span>
                                <b style={{marginRight: 10, fontSize: 18}}>{order.supplier.name}</b> 
                                <Tag color={ORDER_STATES.client[order.state].tagColor}>{ORDER_STATES.client[order.state].title}</Tag>
                            </span>}
                            description={
                                <div style={{display: 'flex', flexDirection: 'column'}}>
                                    {order.submitted_at 
                                        ? <em>Submitted on {moment(order.submitted_at).format('LL')}</em>
                                        : <em>Unsubmitted</em>
                                    }
                                    <Typography.Text><Icon type="shopping-cart" /> {order.line_items.length}</Typography.Text>

                                </div>
                            }
                            style={{alignItems: 'center'}}
                        />
                    </List.Item>
                )}
            />
        </OrderContainer>
    );
};

export default ClientOrders;