import React, { useState, useEffect, useContext, useMemo } from 'react';
import { ORDER_STATES } from '../../utils/constants';
import { Typography, Modal, Select, Switch, InputNumber, Input, Button, Spin, message, Alert } from 'antd';
import { StoreContext } from '../../context/store';
import styled from 'styled-components';
import AddressForm from '../core/AddressForm';
import OrderSummary from './OrderSummary';
import { injectStripe, CardElement } from 'react-stripe-elements';
import moment from 'moment';
import { submitOrder } from './helper';
import api from '../../utils/api';
import CardInput from './CardInput';

const { Title, Text } = Typography;

export const FormField = styled.div`
    display: flex;
    align-items: center;
    font-size: 16px;
    margin-bottom: 25px;
    width: ${props => props.width ? props.width : '100%'};

    label {
        width: 170px; 
    }
`;



export const SectionHeader = ({ title }) => <Title level={4} style={{marginBottom: '15px', marginTop: '20px'}}>{title}</Title>;

const SubmitOrderModal = ({ order, stripe, onCancel, refreshOrder }) => {

    const [paymentMethod, setPaymentMethod] = useState(order.payment_method);
    const [activityMessage, setActivityMessage] = useState('');
    const [deferred, setDeffered] = useState(!!order.payment_deferred);
    const [paymentSent, setPaymentSent] = useState(!!order.payment_deferred);
    const [kegReturns, setKegReturns] = useState(order.keg_returns);
    const [loading, setLoading] = useState(false);
    const [orderSummary, setOrderSummary] = useState({});
    const paymentDueDate = useMemo(() => moment().add(order.supplier.default_payment_term, 'days').format('YYYY-MM-DD'), [order]);

    const { state, actions } = useContext(StoreContext);

    const handleSubmitOrder = () => {
        if (!paymentMethod) {
            message.error('Please select a payment method');
            return;
        }
        setLoading(true);
        createPayment()
        .then(() => {
            submitOrder({
                ...order,
                keg_returns: kegReturns,
                payment_due_date: paymentDueDate
            }).then(() => {
                if (activityMessage) {
                    api.orderActivities.create({
                        message: activityMessage,
                        order: order.id,
                        client_seen: true
                    })
                    .catch(err => console.log(err));
                }
                actions.fetchAppState().then(() => {
                    message.success('Order submitted');
                    refreshOrder();
                    onCancel();
                });
            })
        })
        .catch(err => console.log(err))
        .finally(() => setLoading(false));
    };

    const createPayment = async () => {
        // if they dont have a payment account, create a new customer using the stripe card element
        let payload = {
            supplier: order.supplier.id,
            amount: orderSummary.total,
            order: order.id,
            payment_method: paymentMethod,
            deferred: paymentMethod === 'card' ? deferred : !paymentSent
        };
        console.log(payload);
        if (!state.has_payment_account && paymentMethod === 'card' && !deferred) {
            const { token } = await stripe.createToken();
            payload.token = token.id;
        }
        console.log(payload);
        return api.payments.create(payload);
    };

    return (
        <Modal
            title="Submit Order"
            footer={null}
            visible
            width={550}
            bodyStyle={{overflowY: 'auto'}}
            onCancel={onCancel}
            maskClosable
        >
            <Spin spinning={loading}>
                <SectionHeader title="Order Details" />
                {!order.supplier.accepts_card_payments && <Text type="secondary">This supplier does not accept card payments</Text>}
                <FormField>
                    <label>Payment Method</label>
                    <Select style={{width: 150}} onChange={val => setPaymentMethod(val)} defaultValue={paymentMethod}>
                        {order.supplier.accepts_card_payments && <Select.Option key={0} value="card">Card</Select.Option>}
                        <Select.Option key={1} value="cheque">Cheque</Select.Option>
                        <Select.Option key={2} value="e-transfer">E-transfer</Select.Option>
                        <Select.Option key={3} value="cash">Cash</Select.Option>
                    </Select>
                </FormField>
                {paymentMethod === 'card'
                    ? <FormField>
                        <label>Pay Now</label>
                        <Switch checked={!deferred} onChange={val => setDeffered(!val)} />
                    </FormField>
                    : <FormField>
                        <label>Payment Sent</label>
                        <Switch checked={paymentSent} onChange={val => setPaymentSent(val)} />
                    </FormField>
                }
                <FormField>
                    <label>Message</label>
                    <Input.TextArea placeholder="Optional" rows={5} value={activityMessage} onChange={e => setActivityMessage(e.target.value)} />
                </FormField>
                <FormField>
                    <div>
                        I'm returning
                        <Select onChange={val => setKegReturns(val)} style={{marginLeft: 10, marginRight: 10, width: 80}} defaultValue={kegReturns}>
                            <Select.Option value="0">0</Select.Option>
                            <Select.Option value="1">1</Select.Option>
                            <Select.Option value="2">2</Select.Option>
                            <Select.Option value="3">3</Select.Option>
                            <Select.Option value="4">4</Select.Option>
                            <Select.Option value="5">5</Select.Option>
                        </Select>
                        kegs
                    </div>
                </FormField>
                <OrderSummary order={{...order, keg_returns: kegReturns}} updateParentSummary={summary => setOrderSummary(summary)} />

                {(!deferred && paymentMethod === 'card') &&
                    (state.has_payment_account
                        ? <Alert type="info" message="You're already set up for card payments. Click submit to process" />
                        : <CardInput />
                    )
                }
                <Text type="warning" strong>Payment due by {paymentDueDate}</Text>
                <Button 
                    type="primary" 
                    style={{float: 'right', marginTop: '25px'}} 
                    size="large" 
                    onClick={handleSubmitOrder}
                >
                    Submit
                </Button>
            </Spin>
        </Modal>
    );
};

export default injectStripe(SubmitOrderModal);