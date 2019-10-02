import React, { useState, useEffect, useMemo, useContext } from 'react';
import api from '../../utils/api';
import { Breadcrumb, Descriptions, Tag, List, InputNumber, Button, Icon, Typography, Menu, Badge, Skeleton } from 'antd';
import StoreBanner from '../shop/StoreBanner';
import moment from 'moment';
import styled from 'styled-components';
import ClientOrderActions from './ClientOrderActions';
import { Link } from 'react-router-dom';
import { ORDER_STATES } from '../../utils/constants';
import { capitalize, getItemDescription, S3Image } from '../../utils/utils';
import Image from '../common/Image';
import LabeledInput from '../common/LabeledInput';
import LineItem from './LineItem';
import OrderSummary from './OrderSummary';
import { StoreContext } from '../../context/store';
import OrderActivities from './OrderActivities';
import SupplierOrderActions from './SupplierOrderActions';

const StyledActionsContainer = styled.div`
    display: flex;
    justify-content: flex-end;
`;

const defaultOrder = {
    state: 'pending_payment', 
    supplier: {}, 
    line_items: [], 
    client: {},
    activities: []
};

const ViewOrder = ({ match, history }) => {

    const [order, setOrder] = useState(defaultOrder);
    const [loading, setLoading] = useState(false);
    const [selectedTab, setSelectedTab] = useState('item-list');
    const { state, actions } = useContext(StoreContext);
    const [editing, setEditing] = useState(true);
    const userType = process.env.REACT_APP_TYPE;
    const [signatureUrl, setSignatureUrl] = useState('');

    const tags = useMemo(() => {
        if (userType === 'supplier') {
            return ORDER_STATES.supplier
        }
        return ORDER_STATES.client
    }, [])

    const unseenActivities = useMemo(() => {
        return order.activities.reduce((total, activity) => {
            if (userType === 'supplier') {
                return total + !activity.supplier_seen;
            }
            return total + !activity.client_seen;
        }, 0)
    }, [order])

    const fetchdata = () => {
        setLoading(true);
        api.orders.getOne(match.params.orderId)
            .then(res => {
                setOrder(res);
                setEditing(ORDER_STATES.client_editing_states.includes(res.state));
            })
            .catch(err => {
                if (err.detail === 'Not found.') {
                    history.push('/orders');
                }
            })
            .finally(() => setLoading(false));
    };

    const handleDeleteLineItem = id => {
        api.lineItems.delete(id)
            .then(() => {
                fetchdata();
                actions.fetchAppState();
            })
            .catch(err => console.log(err));
    };

    useEffect(() => {
        fetchdata();
    }, [match.params.orderId, state]);

    useEffect(() => {
        if (order.signature_key) {
            api.signatures.getOne(order.id)
                .then(({ url }) => setSignatureUrl(url));
        }
    }, [order]);

    const links = () => (
        <Breadcrumb>
            {userType === 'supplier'
                ? <React.Fragment>
                    <Breadcrumb.Item>
                        <Link to={`/`}>Orders</Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>#{order.id} {order.client.name} </Breadcrumb.Item>    
                </React.Fragment>
                : <React.Fragment>
                    <Breadcrumb.Item>
                        <Link to={`/suppliers/${order.id}`}>Orders</Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>#{order.id} {order.supplier.name} </Breadcrumb.Item>    
                </React.Fragment>
            }
        </Breadcrumb>
    );

    return (
        <div>
            {userType === 'supplier'
                ? <StoreBanner {...order.client} Breadcrumbs={links} />
                : <StoreBanner {...order.supplier} Breadcrumbs={links} />
            }
            <Descriptions bordered style={{marginBottom: 30}}>
                {order.submitted_at && <Descriptions.Item label="Submitted">{moment(order.submitted_at).format('LLL')}</Descriptions.Item>}
                {order.payment_due_date && <Descriptions.Item label="Payment Due">{moment(order.payment_due_date).format('LL')}</Descriptions.Item>}
                {order.payment_method && <Descriptions.Item label="Payment Method">{capitalize(order.payment_method)}</Descriptions.Item>}
                <Descriptions.Item label="Status">
                    <Tag color={tags[order.state].tagColor}>
                        {tags[order.state].title}
                    </Tag>
                </Descriptions.Item>
                {order.amount_due && 
                    <Descriptions.Item label="Payment Status">
                        {ORDER_STATES.paid_states.includes(order.state)
                            ? <Badge status="success" text="Paid" />
                            : <Badge status="error" text="Payment required" />
                        }
                    </Descriptions.Item>
                }
                {ORDER_STATES.delivered_states.includes(order.state) && 
                    <Descriptions.Item label="Signature">
                        {signatureUrl
                            ? <Image src={signatureUrl} height="50px" width="90px" presigned />
                            : 'Not Signed'
                        }
                    </Descriptions.Item>
                }
            </Descriptions>
            <StyledActionsContainer>
                {userType === 'supplier'
                    ? <SupplierOrderActions order={order} type="primary" refreshOrder={fetchdata} />
                    : <ClientOrderActions order={order} type="primary" />
                }
            </StyledActionsContainer>
            <div style={{display: 'flex', width: '100%', marginTop: 50}}>
                <Menu
                    style={{flexBasis: '12%', marginRight: 25}}
                    onClick={e => setSelectedTab(e.key)}
                    defaultSelectedKeys={['item-list']}
                    mode="inline"
                >
                    <Menu.Item key="item-list"><Icon type="shopping-cart" /> Order</Menu.Item>
                    <Menu.Item key="messages"><Icon type="message" /> Messages <Badge count={unseenActivities} /></Menu.Item>
                </Menu>
                {selectedTab === 'item-list'
                    ? <div style={{flexBasis: '88%', display: 'flex'}}>
                        <List
                            style={{flexBasis: '70%', marginRight: 15}}
                            itemLayout="vertical"
                            dataSource={order.line_items}
                            loading={loading}
                            renderItem={item => (
                                <LineItem 
                                    item={item} 
                                    allowEdit={editing} 
                                    handleDeleteLineItem={handleDeleteLineItem} 
                                    refreshOrder={fetchdata} 
                                />
                            )}
                        />
                        <OrderSummary order={order} showCheckout={editing} />
                    </div>
                    : <OrderActivities order={order} refreshOrder={fetchdata} />
                }
            </div>
        </div>
    );
};

export default ViewOrder;