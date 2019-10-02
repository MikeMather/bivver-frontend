import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { Modal, Input, Typography } from 'antd';


const DeclineOrderModal = ({ onCancel, order, onConfirm, decline=false }) => {

    const [declineReason, setDeclineReason] = useState('');
    const [loading, setLoading] = useState(false);

    const handleConfirm = () => {
        api.orderActivities.create({
            activity: decline ? 'Declined' : 'Revision requested',
            message: declineReason,
            client_seen: false,
            supplier_seen: true,
            order: order.id
        })
        .then(activity => {
            api.orders.transition(order.id, decline ? 'decline' : 'supplier-submit')
                .then(res => {
                    onConfirm();
                })
                .catch(err => console.log(err))    
        })
        .catch(err => console.log(err))
        .finally(res => setLoading(false));
    };

    return (
        <Modal
            title={decline ? 'Permanently decline order' : 'Request revision'}
            onOk={handleConfirm}
            onCancel={onCancel}
            visible
        >
            <Typography.Title level={4}>Reason: </Typography.Title>
            <Input.TextArea 
                rows={4}
                placeholder={decline ? 'Why did you decline this order? (optional)' : 'What changes need to be made?'}
                value={declineReason}
                onChange={e => setDeclineReason(e.target.value)}
            />
        </Modal>
    );
};

export default DeclineOrderModal;