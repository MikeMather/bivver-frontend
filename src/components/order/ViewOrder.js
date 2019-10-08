import React, { useState, useEffect, useMemo, useContext } from 'react';
import api from '../../utils/api';
import { Breadcrumb, Descriptions, Tag, List, Tabs, Icon, Menu, Badge } from 'antd';
import StoreBanner from '../shop/StoreBanner';
import moment from 'moment';
import styled from 'styled-components';
import ClientOrderActions from './ClientOrderActions';
import { Link } from 'react-router-dom';
import { ORDER_STATES } from '../../utils/constants';
import { capitalize } from '../../utils/utils';
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
    const { state, actions } = useContext(StoreContext);
    const [editing, setEditing] = useState(true);
    const [signatureUrl, setSignatureUrl] = useState('');
    const [unseenActivities, setUnseenActivities] = useState(2);

    const tags = useMemo(() => {
        if (state.account_type === 'supplier') {
            return ORDER_STATES.supplier
        }
        return ORDER_STATES.client
    }, [])

    const getUnseenActivities = () => {
        setUnseenActivities(order.activities.reduce((total, activity) => {
            if (state.account_type === 'supplier') {
                return total + !activity.supplier_seen;
            }
            return total + !activity.client_seen;
        }, 0));
    };

    const fetchData = () => {
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
                fetchData();
                actions.fetchAppState();
            })
            .catch(err => console.log(err));
    };

    useEffect(() => {
        fetchData();
    }, [match.params.orderId, state]);

    useEffect(() => {
        if (order.signature_key) {
            api.signatures.getOne(order.id)
                .then(({ url }) => setSignatureUrl(url));
        }
        getUnseenActivities();
    }, [order]);

    const links = () => (
        <Breadcrumb>
            {state.account_type === 'supplier'
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
            {state.account_type === 'supplier'
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
                {state.account_type === 'supplier'
                    ? <SupplierOrderActions order={order} type="primary" refreshOrder={fetchData} />
                    : <ClientOrderActions order={order} type="primary" refreshOrder={fetchData} />
                }
            </StyledActionsContainer>
            <div style={{display: 'flex', width: '100%', marginTop: 50, marginBottom: 50}}>
                <Tabs defaultActiveKey="1" style={{width: '100%'}}>
                    <Tabs.TabPane tab={<span><Icon type="shopping-cart" /> Order</span>} key="1">
                        <div style={{flexBasis: '88%', display: 'flex'}}>
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
                                        refreshOrder={fetchData} 
                                    />
                                )}
                            />
                            <OrderSummary order={order} showCheckout={editing} refreshOrder={fetchData} />
                        </div>
                    </Tabs.TabPane>
                    <Tabs.TabPane tab={<span><Icon type="message" /> Messages <Badge count={unseenActivities} /></span>} key="2">
                        <OrderActivities 
                            order={order} 
                            refreshOrder={fetchData} 
                            clearUnseenActivities={() => setUnseenActivities(0)} 
                        />
                    </Tabs.TabPane>
                </Tabs>
            </div>
        </div>
    );
};

export default ViewOrder;