import React, { useState } from 'react';
import RegisterBanner from './RegisterBanner';
import RegisterForm from './RegisterForm';
import { StyledContainer, ConfirmSignUp } from './RegisterSupplier';

const RegisterClient = ({ asModal }) => {
    const [confirmSignUp, setConfirmSignUp] = useState(false);

    return (
        <StyledContainer>
            {!asModal && <RegisterBanner />}
            {confirmSignUp
                ? <ConfirmSignUp />
                : <RegisterForm handleSignUp={() => setConfirmSignUp(true)} accountType="client" />
            }
        </StyledContainer>
    );
};

export default RegisterClient;