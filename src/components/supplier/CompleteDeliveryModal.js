import React, { useState, useRef } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import moment from 'moment';
import { Modal, InputNumber, message, Typography } from 'antd';
import styled from 'styled-components';

const StyledCanvas = styled.div`
    border: 1px solid #9E9E9E;
    border-radius: 3px;
`;

const CompleteDeliveryModal = ({ handleSubmit, handleCancel, order }) => {

    const [kegs, setKegs] = useState(order.keg_returns);
    const defaultKegPrice = order.supplier.keg_deposit_price;
    const signaturePad = useRef();
    const [loading, setLoading] = useState(false);

    const confirm = () => {
        setLoading(true);
        handleSubmit({
            keg_returns: kegs,
            delivered_at: moment(),
            signature_base64: !signaturePad.current.isEmpty() ? signaturePad.current.toDataURL().split(',')[1] : '',
            amount_due: order.amount_due + (((order.keg_returns - kegs) * defaultKegPrice) * 100)
        });
    };

    const handleKegChange = value => {
        if (value * defaultKegPrice > order.amount_due / 100) {
            message.error('The cost of keg returns cannot be greater than the order total.');
        }
        else {
            setKegs(value);
        }
    };

    return (
        <Modal 
            title="Complete delivery"
            onOk={confirm}
            onCancel={handleCancel}
            visible
        >
            <Typography.Title level={4}>Keg Returns</Typography.Title>
            <Typography.Text>Kegs being returned by the client:</Typography.Text>
            <InputNumber
                style={{marginLeft: 20, marginBottom: 20}}
                min={0} 
                value={kegs} 
                onChange={value => handleKegChange(value)}
                onClick={e => e.target.select()}
            />
            <Typography.Title level={4}>Signature</Typography.Title>
            <Typography.Text>Use the pad below to get confirmation of the order</Typography.Text>
            <StyledCanvas>
                <SignatureCanvas 
                    ref={signaturePad}
                    canvasProps={{width: 350, height: 150, className: 'signature-canvas'}} 
                />
            </StyledCanvas>
        </Modal>
    );
};

export default CompleteDeliveryModal;