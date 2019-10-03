import React, { useContext, useState } from 'react';
import { StoreContext } from '../../context/store';
import { Dropdown, Menu, Icon, Button, Popconfirm, Modal } from 'antd';
import { downloadPdf, deleteOrder } from './helper';
import { ORDER_STATES } from '../../utils/constants';
import { Elements, StripeProvider } from 'react-stripe-elements';
import config from '../../utils/config';
import SubmitPaymentModal from './SubmitPaymentModal';


const ClientOrderActions = ({ order={}, type, refreshOrders }) => {

    const [loading, setLoading] = useState(false);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const { actions } = useContext(StoreContext);
    const { confirm } = Modal;

    const downloadInvoice = () => {
        setLoading(true);
        downloadPdf(order.id).finally(() => setLoading(false));
    };

    const handleDeleteOrder = id => {
        setLoading(true);
        deleteOrder(id)
            .then(res => {
                if (refreshOrders) {
                    refreshOrders();
                    setLoading(false);
                }
                else {
                    actions.fetchAppState().then(() => setLoading(false))
                }
            })
    }

    const showDeleteConfirm = () => {
        confirm({
            title: 'Are you sure you want to delete this order?',
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk: () => {
                handleDeleteOrder(order.id)
            },
        });
    }

    return (
        <React.Fragment>
            {showPaymentModal && 
                <StripeProvider apiKey={config.STRIPE_API_KEY}>
                    <Elements>
                        <SubmitPaymentModal 
                            order={order}
                            closeModal={() => {
                                setShowPaymentModal(false);
                                refreshOrders();
                            }}
                        />
                    </Elements>
                </StripeProvider>
            }
            <Dropdown overlay={
                <Menu>
                    <Menu.Item 
                        key="1" 
                        onClick={downloadInvoice} 
                        disabled={!(ORDER_STATES.delivered_states.includes(order.state))}
                    >
                        <Icon type="file-pdf" />
                        Download Invoice
                    </Menu.Item>
                    <Menu.Item 
                        key="2" 
                        disabled={!(ORDER_STATES.pending_payment_states.includes(order.state) && order.payment_deferred)}
                        onClick={() => setShowPaymentModal(true)}
                    >
                        <Icon type="credit-card" />
                        Pay Now
                    </Menu.Item>
                    <Menu.Item key="3" onClick={showDeleteConfirm} disabled={order.state !== 'draft'}>
                        <Icon type="delete" />
                        Delete
                    </Menu.Item>
                </Menu>
            } 
                trigger={['click']} 
                placement="bottomRight"
            >
                <Button type={type} loading={loading}>Actions <Icon type="down" /></Button>
            </Dropdown>
        </React.Fragment>
    )
};

export default ClientOrderActions;