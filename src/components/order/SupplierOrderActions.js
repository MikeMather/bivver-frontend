import React, { useState } from 'react';
import { Dropdown, Menu, Icon, Button, message } from 'antd';
import api from '../../utils/api';
import DeclineOrderModal from '../supplier/DeclineOrderModal'
import CompleteDeliveryModal from '../supplier/CompleteDeliveryModal';


const SupplierOrderActions = ({ order, type, refreshOrder }) => {

    const [loading, setLoading] = useState(false);
    const [showDeclineModal, setShowDeclineModal] = useState(false);
    const [showReviseModal, setShowReviseModal] = useState(false);
    const [showDeliveryModal, setShowDeliveryModal] = useState(false);
    const disableTransition = order.state !== 'pending_supplier_approval'
    const disablePayment = !(order.state === 'pending_payment' || order.state === 'delivered_pending_payment');
    const disableDelivery = !(order.state === 'pending_payment' || order.state === 'paid');


    const handleApprove = () => {
        setLoading(true);
        const target = order.payment_deferred ? 'supplier-approve-unpaid' : 'supplier-approve';
        api.orders.transition(order.id, target)
            .then(() => {
                message.success('Order approved!');
                refreshOrder();
            })
            .catch(err => console.log(err))
            .finally(() => setLoading(false));
    };

    const markAsDelivered = paymentUpdates => {
        setLoading(true);
        const target = order.state === 'paid' ? 'deliver' : 'deliver-pending-payment';
        api.orders.update(order.id, paymentUpdates)
            .then(res => {
                api.orders.transition(order.id, target)
                    .then(() => {
                        setShowDeliveryModal(false);
                        refreshOrder();
                    })
                    .catch(err => console.log(err));
            })
            .finally(() => setLoading(false));
    };

    const markAsPaid = payment_method => {
        setLoading(true);
        // Update with new payment method
        const payload = {payment_method};
        api.orders.update(order.id, payload)
            .then(() => {
                // Transition to paid
                const target = order.state === 'pending_payment' ? 'client-paid' : 'deliver-paid';
                api.orders.transition(order.id, target)
                    .then(() => refreshOrder());
            })
            .catch(err => console.log(err))
            .finally(() => setLoading(false));
    };

    const menu = (
        <Menu>
            <Menu.Item key="0" onClick={handleApprove} disabled={disableTransition}>
                <Icon type="check-circle" />
                Approve
            </Menu.Item>
            <Menu.Item key="1" onClick={() => setShowDeclineModal(true)}  disabled={disableTransition}>
                <Icon type="close" />
                Decline
            </Menu.Item>
            <Menu.Item 
                key="2" 
                onClick={() => {setShowReviseModal(true); setShowDeclineModal(true)}}  
                disabled={disableTransition}
            >
                <Icon type="rollback" />
                Request revision
            </Menu.Item>
            <Menu.SubMenu title="Mark as paid" key="3" disabled={disablePayment}>
                <Menu.Item onClick={() => markAsPaid('card')} disabled={order.payment_method !== 'card'}><Icon type="credit-card" /> Credit Card</Menu.Item>
                <Menu.Item onClick={() => markAsPaid('e-transfer')}><Icon type="mail" /> E-transfer</Menu.Item>
                <Menu.Item onClick={() => markAsPaid('cheque')}><Icon type="bank" /> Cheque</Menu.Item>
                <Menu.Item onClick={() => markAsPaid('cash')}><Icon type="dollar" /> Cash</Menu.Item>
            </Menu.SubMenu>
            <Menu.Item key="4" disabled={disableDelivery} onClick={() => setShowDeliveryModal(true)}>
                <Icon type="carry-out"/>
                Mark as delivered
            </Menu.Item>
            <Menu.Item key="5" disabled={!disableTransition}>
                <Icon type="file-pdf" />
                Download PDF
            </Menu.Item>
        </Menu>
    );

    return (
        <React.Fragment>
            {showDeclineModal && 
                <DeclineOrderModal
                    onConfirm={() => {
                        refreshOrder();
                        setShowDeclineModal(false);
                        setShowReviseModal(false);
                    }}
                    onCancel={() => {
                        setShowDeclineModal(false);
                        setShowReviseModal(false);
                    }}
                    order={order}
                    decline={!showReviseModal}
                />
            }
            {showDeliveryModal &&
                <CompleteDeliveryModal
                    order={order}
                    handleCancel={() => setShowDeliveryModal(false)}
                    handleSubmit={payload => markAsDelivered(payload)}
                />
            }
            <Dropdown overlay={menu} trigger={['click']} placement="bottomRight">
                <Button type={type} loading={loading}>Actions <Icon type="down" /></Button>
            </Dropdown>
        </React.Fragment>
    )
};

export default SupplierOrderActions;