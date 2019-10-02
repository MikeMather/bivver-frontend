import React from 'react';
import LoginForm from './LoginForm';
import styled from 'styled-components';
import { Redirect, withRouter } from 'react-router-dom';

const StyledLoginWrapper = styled.div`
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
`;


const Login = props => {

    return (
        <StyledLoginWrapper>
            {props.authenticated && <Redirect to="/" />}
            <LoginForm {...props} />
        </StyledLoginWrapper>
    );
}


export default withRouter(Login);