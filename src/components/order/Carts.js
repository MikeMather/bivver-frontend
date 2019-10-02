import React, { useContext, useState } from 'react';
import { StoreContext } from '../../context/store';
import { Icon, Button, Collapse, Empty, Spin, List, Avatar, Popconfirm } from 'antd';
import { S3Image, getItemDescription } from '../../utils/utils';
import { Link } from 'react-router-dom';
import { deleteLineItem, deleteOrder } from './helper';
import Image from '../common/Image';


const Carts = ({ orders, width=300 }) => {

    const { actions } = useContext(StoreContext);
    const [loading, setLoading] = useState(false);

    const handleDeleteItem = id => {
        setLoading(true);
        deleteLineItem(id)
            .then(res => actions.fetchAppState().then(() => setLoading(false)))
    }

    const handleDeleteOrder = id => {
        setLoading(true);
        deleteOrder(id)
            .then(res => actions.fetchAppState().then(() => setLoading(false)))
    }

    return (
        orders.length 
        ? <Collapse style={{width: width}} title="Active Orders">
            {orders.map(order => (
                <Collapse.Panel key={order.id} header={order.supplier.name}>
                    <List
                        itemLayout="horizontal"
                        dataSource={order.line_items}
                        loading={loading}
                        renderItem={item => (
                            <List.Item
                                actions={[
                                    <Button type="link" title="Delete from cart" onClick={() => handleDeleteItem(item.id)} style={{padding: 0}}>
                                        <Icon type="close-circle" theme="twoTone" twoToneColor="red" />
                                    </Button>
                                ]}
                            >
                                <List.Item.Meta
                                    style={{alignItems: 'center'}}
                                    avatar={<Image src={item.item.image} width="50px" height="50px" />}
                                    title={<b>{item.item.name}</b>}
                                    description={getItemDescription(item.item.order_by, item.item.measure, item.item.amount_per_unit, item.item.quantity_per_order)}
                                />
                        </List.Item>
                        )}
                    />
                    <div style={{display: 'flex', justifyContent: 'flex-end', marginTop: 20}}>
                        <Popconfirm
                            title="Are you sure delete this order?"
                            onConfirm={() => handleDeleteOrder(order.id)}
                            okText="Yes"
                            cancelText="No"
                            icon={<Icon type="warning" style={{ color: 'red' }} />}
                        >
                            <Button type="link" color="red">Delete</Button>
                        </Popconfirm>
                        <Link to={`/orders/${order.id}`}><Button type="primary">Go to Checkout</Button></Link>
                    </div>
                </Collapse.Panel>
            ))}
        </Collapse>
        : <Empty description="You don't have any orders yet" />
    );
};

export default Carts;