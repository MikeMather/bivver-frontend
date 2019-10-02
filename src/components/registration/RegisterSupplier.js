import React, { useState } from 'react';
import RegisterBanner from './RegisterBanner';
import RegisterForm from './RegisterForm';
import styled from 'styled-components';
import { Result, Card } from 'antd';

export const StyledContainer = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`;

export const ConfirmSignUp = () => (
    <Card style={{width: '60%'}}>
        <Result
            status="success"
            title="Welcome to Bivver!"
            subTitle="We've sent you an email to verify your email address. Follow the link in the email to finish setting up your account"
        />
    </Card>
)

const RegisterSupplier = () => {
    const [confirmSignUp, setConfirmSignUp] = useState(false);

    return (
        <StyledContainer>
            <RegisterBanner />
            {confirmSignUp
                ? <ConfirmSignUp />
                : <RegisterForm handleSignUp={() => setConfirmSignUp(true)} accountType={'supplier'} />
            }
        </StyledContainer>
    );
};

export default RegisterSupplier;