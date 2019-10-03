import React, { useState, useMemo, useContext } from 'react';
import { StoreContext } from '../../context/store';
import { injectStripe } from 'react-stripe-elements';
import api from '../../utils/api';
import OrderSummary from './OrderSummary';
import { helper } from './helper';
import { Modal, Spin, Alert } from 'antd';
import CardInput from './CardInput';


const SubmitPaymentModal = ({ order, stripe, closeModal }) => {

    const [loading, setLoading] = useState(false);
    const [paymentError, setPaymentError] = useState(false);
    const { state } = useContext(StoreContext);

    const submitPayment = async () => {
        setLoading(true);
        const payload = {
            supplier: order.supplier.id,
            amount: order.amount_due / 100,
            order: order.id,
            deferred: false,
            payment_method: 'card'
        };
        if (!state.has_payment_account) {
            const { token } = await stripe.createToken();
            payload.token = token.id;
        }
        // Update the payment and transition to paid
        api.payments.create(payload)
            .then(() => {
                const target = order.state === 'pending_payment' ? 'client-paid' : 'deliver-paid';
                api.orders.transition(order.id, target)
                    .then(() => closeModal());
            })
            .catch(() => setPaymentError(true));
    };

    return (
        <Modal 
            title="Submit Order"
            visible
            bodyStyle={{overflowY: 'auto'}}
            onCancel={closeModal}
            onOk={submitPayment}
            okText="Submit"
            maskClosable    
        >
            <Spin spinning={loading}>
                {paymentError && 
                    <Alert type="error" message="There was an error processing your payment" />
                }
                <OrderSummary 
                    order={order} 
                    showCheckout={false}
                />
                {state.has_payment_account
                    ? <Alert type="info" message="You're already set up for card payments. Click submit to process your order." />
                    : <CardInput />
                }
            </Spin>
        </Modal>
    );
};

export default injectStripe(SubmitPaymentModal);