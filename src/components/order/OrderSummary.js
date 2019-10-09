import React, { useState, useEffect } from 'react';
import { getOrderSummary } from './helper';
import { Typography, Skeleton, Button, Divider } from 'antd';
import styled from 'styled-components';
import SubmitOrderModal from './SubmitOrderModal';
import { Elements, StripeProvider } from 'react-stripe-elements';
import config from '../../utils/config';

const { Title, Text } = Typography;

const SummaryField = styled.div`
    display: flex;
    justify-content: space-between;
    margin: 15px 0;
`;

const StyledOrderSummary = styled.div`
    flex-basis: 30%;
    font-size: 18px;

    @media screen and (max-width: 768px) {
        flex-basis: 100%;
        margin-top: 30px;
    }
`;

const OrderSummary = ({ order, showCheckout, updateParentSummary, refreshOrder }) => {

    const defaultSummary = {
        hst: 0,
        kegDeposits: {count: 0, cost: 0},
        kegReturns: {count: 0, cost: 0},
        orderTotal: 0,
        subTotal: 0,
        total: 0
    };

    const [orderSummary, setOrderSummary] = useState(defaultSummary);
    const [loading, setLoading] = useState(false);
    const [submitOrder, setSubmitOrder] = useState(false);

    useEffect(() => {
        if (order.client.id) {
            setLoading(true);
            getOrderSummary(order)
            .then(summary => {
                setOrderSummary(summary);
                if (updateParentSummary) {
                    updateParentSummary(summary);
                }
            })
            .finally(() => setLoading(false))
        }
    }, [order.keg_returns, order.line_items])

    return (
        <StyledOrderSummary>
            {submitOrder && 
                <StripeProvider apiKey={config.STRIPE_API_KEY}>
                    <Elements>
                        <SubmitOrderModal order={order} onCancel={() => setSubmitOrder(false)} refreshOrder={refreshOrder} />
                    </Elements>
                </StripeProvider>
            }
            <Skeleton loading={loading} active={loading}>
                <Title level={4}>Summary</Title>
                <SummaryField>
                    <Text>Subtotal</Text>
                    <Text>${orderSummary.orderTotal}</Text>
                </SummaryField>
                <SummaryField>
                    <Text>HST ({orderSummary.taxRate}%)</Text>
                    <Text>${(orderSummary.orderTotal * orderSummary.taxRate).toFixed(2)}</Text>
                </SummaryField>
                <SummaryField>
                    <Text>Keg Deposits</Text>
                    <Text>{orderSummary.kegDeposits.count} x ${order.supplier.keg_deposit_price}</Text>
                    <Text>${orderSummary.kegDeposits.cost}</Text>
                </SummaryField>
                <SummaryField>
                    <Text>Keg Returns</Text>
                    <Text>{orderSummary.kegReturns.count} x ${order.supplier.keg_deposit_price}</Text>
                    <Text>${orderSummary.kegReturns.cost}</Text>
                </SummaryField>
                <Divider />
                <SummaryField>
                    <Text strong>Total</Text>
                    <Text strong>${orderSummary.total}</Text>
                </SummaryField>
                {showCheckout && 
                    <Button 
                        type="primary" 
                        style={{float: 'right'}} 
                        size="large" 
                        onClick={() => setSubmitOrder(true)}
                    >
                        Checkout
                    </Button>
                }
            </Skeleton>
        </StyledOrderSummary>
    );
};

export default OrderSummary;