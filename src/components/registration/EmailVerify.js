import React, { useState, useEffect } from 'react';
import queryString from 'query-string';
import { Result, Button, Spin, Card } from 'antd';
import { Link } from 'react-router-dom';
import { StyledContainer } from './RegisterSupplier';
import api from '../../utils/api';

const EmailVerify = ({ authenticated }) => {
    const params = queryString.parse(window.location.search);
    const verificationToken = params.token;
    const [loading, setLoading] = useState(true);
    const [verified, setVerified] = useState(false);
    const [error, setError] = useState('')
    
    const verify = () => {
        api.emailVerify.postWithoutAuth({token: verificationToken})
            .then(() => setVerified(true))
            .catch(err => setError(err.message))
            .finally(() => setLoading(false));
    }

    useEffect(() => {
        verify();
    }, [])

    return (
        <StyledContainer>
        {verified
            ? <Card style={{width: '60%'}}>
                <Result
                    status={error ? "error" : "success"}
                    title={error || "You're all set!"}
                    subTitle={error ? 'There was a problem verifying your email' : `Thanks for verifying your email. ${authenticated ? '' : 'Click the button below to login'}`}
                    extra={[
                        !authenticated
                        ? <Link to="/login"><Button type="primary">Go To Login</Button></Link>
                        : <Link to="/"><Button type="primary">Done</Button></Link>
                    ]}
                />
            </Card>
            : <Card style={{width: '60%', height: '50%'}}>
                    <Spin message="Verifying..." />
            </Card>
        }
        
        </StyledContainer>
    )
}

export default EmailVerify;