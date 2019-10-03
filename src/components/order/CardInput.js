import React from 'react';
import styled from 'styled-components';
import { Typography } from 'antd';
import { SectionHeader } from './SubmitOrderModal';
import { CardElement } from 'react-stripe-elements';
const { Text } = Typography;

const cardInputStyle = {
    base: {
        fontSize: '16px',
        color: '#424770',
        fontFamily: 'Open Sans, sans-serif',
        letterSpacing: '0.025em',
        '::placeholder': {
            color: '#aab7c4',
        },
    },
    invalid: {
        color: '#c23d4b',
    },
};

const StyledCardContainer = styled.div`
    border: 1px solid #d9d9d9;
    border-radius: 3px;
    padding: 10px;
    margin-bottom: 10px;
`;

const CardInput = () => (
    <div style={{marginBottom: 25}}>
        <SectionHeader title="Card Payment" />
        <StyledCardContainer>
            <CardElement style={cardInputStyle} />
        </StyledCardContainer>
        <Text type="secondary">Payment is charged once the supplier delivers your order</Text>
    </div>
);

export default CardInput;