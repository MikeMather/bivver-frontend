import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { Modal, Input, Typography, Form, Button } from 'antd';


const DeclineOrderModal = ({ onCancel, order, onConfirm, decline=false, form }) => {

    const [loading, setLoading] = useState(false);
    const { getFieldDecorator, validateFields } = form;

    const handleConfirm = e => {
        e.preventDefault();
        validateFields((err, values) => {
            if (err) {
                return;
            }
            api.orderActivities.create({
                activity: decline ? 'Declined' : 'Revision requested',
                message: values.message,
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
        })
    };

    return (
        <Modal
            title={decline ? 'Permanently decline order' : 'Request revision'}
            onCancel={onCancel}
            visible
            footer={null}
        >
            <Typography.Title level={4}>Reason: </Typography.Title>
            <Form onSubmit={handleConfirm}>
                <Form.Item>
                    {getFieldDecorator('message', {
                        rules: [{required: true, message: 'Please provide a reason for your revision request'}]
                    })(
                        <Input.TextArea 
                            rows={4}
                            placeholder={decline ? 'Why did you decline this order? (optional)' : 'What changes need to be made?'}
                        />
                    )}
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" style={{float: 'right'}}>Submit</Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

const WrappedDeclineOrderModal = Form.create({name: 'decline_order_form'})(DeclineOrderModal);

export default WrappedDeclineOrderModal;