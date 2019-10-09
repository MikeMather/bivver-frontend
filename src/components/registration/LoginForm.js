import React, { useState, useContext } from 'react';
import { StoreContext } from '../../context/store';
import { Form, Icon, Input, Button, Card, Typography } from 'antd';
import styled from 'styled-components';
import api from '../../utils/api';
import { updateAuthCredentials } from './helper';
import { Link, withRouter } from 'react-router-dom';

const LoginFormWrapper = styled.div`
    .login-form__forgot {
        float: right;
    }
`;

export const ImageWrapper = styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
    margin-bottom: 20px;
    align-items: center;
    flex-direction: column;
`;

const LoginForm = ({ form, history, asModal, callback=null }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { actions } = useContext(StoreContext);
    const { getFieldDecorator, validateFields } = form;

    const handleSubmit = e => {
        e.preventDefault();
        validateFields((err, values) => {
            setLoading(true);
            api.auth.postWithoutAuth(values)
                .then(res => {
                    updateAuthCredentials(res);
                    actions.fetchAppState().then(() => {
                        if (callback) {
                            callback()
                        }
                    })
                    .finally(() => {
                        if (!asModal) {
                            history.push('/');   
                        }
                    });
                })
                .catch(err => setError(err.detail))
                .finally(() => setLoading(false));
        })
    };

    const cardStyle = {
        padding: window.innerWidth > 450 ? 55 : 0
    };

    return (
        <LoginFormWrapper>
            <Card style={cardStyle}>
                <ImageWrapper>
                    <img 
                        src="/images/logo.png"
                        width="100"
                        height="100"
                    />
                </ImageWrapper>
                <Form onSubmit={handleSubmit}>
                    <Typography.Title level={3} style={{marginBottom: '25px', textAlign: 'center'}}>Log in to your Bivver Account</Typography.Title>
                    <Form.Item>
                        {getFieldDecorator('username', {
                            rules: [{required: true, message: 'Please enter your email!'}]
                        })(
                            <Input
                                prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                placeholder="Email"
                            />
                        )}
                    </Form.Item>
                    <Form.Item>
                        {getFieldDecorator('password', {
                            rules: [{required: true, message: 'Please enter your password!'}]
                        })(
                            <Input
                                type="password"
                                prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                placeholder="Password"
                            />
                        )}
                        <div>
                            <Typography.Text type="danger">{error}</Typography.Text>
                        </div> 
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" block loading={loading}>Log in</Button>
                        Don't have an account? <Link to="/register">Join now</Link>
                        <a href="#" className="login-form__forgot">Forgot password</a>
                    </Form.Item>
                </Form>
            </Card>
        </LoginFormWrapper>
    );
};

const WrappedLoginForm = Form.create({name: 'login_form'})(LoginForm);

export default withRouter(WrappedLoginForm);