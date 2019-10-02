import React, { useState } from 'react';
import { Form, Button, Input, Select, Upload, Icon, Spin, Alert, message, Card, Typography, Divider } from 'antd';
import { ImageWrapper } from './LoginForm';
import { CountryDropdown, RegionDropdown } from 'react-country-region-selector';
import styled from 'styled-components';
import { getBase64 } from '../../utils/utils';
import ReCAPTCHA from 'react-google-recaptcha';
import config from '../../utils/config';
import api from '../../utils/api';

const StyledButtonContainer = styled.div`
    width: 180px;
    display: flex;
    justify-content: center;
    margin: 0 auto;
`;

const RegisterForm = ({ form, handleSignUp, accountType }) => {
    const { getFieldDecorator, validateFields } = form;
    const [country, setCountry] = useState('Canada');
    const [region, setRegion] = useState('Ontario');
    const [loading, setLoading] = useState(false)
    const [imageUrl, setImageUrl] = useState('');
    const [recaptchaKey, setRecaptchaKey] = useState('');
    const [error, setError] = useState('');

    const handleImageChange = info => {
        getBase64(info.file.originFileObj, url => setImageUrl(url))
    }

    const comparePasswords = (rule, value, callback) => {
        if (value && value !== form.getFieldValue('password')) {
            callback('Please check that your passwords match');
        }
        else {
            callback()
        }
    }

    const formItemLayout = {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 7 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 17 },
        },
        labelAlign: 'left'
    };

    const handleRegister = e => {
        e.preventDefault();
        if (!recaptchaKey) {
            setError('Please confirm you\'re not a robot')
            return;
        }
        setLoading(true);
        validateFields((err, values) => {
            const data = {
                ...values,
                account_type: accountType,
                image: imageUrl.split(',')[1],
            };
            api.register.postWithoutAuth(data)
                .then(res => handleSignUp())
                .catch(err => setError(Object.values(err)[0]))
                .finally(() => setLoading(false))
        });
    };

    return (
        <Card style={{padding: 25}}>
            <Spin tip="Creating your Bivver account..." spinning={loading} >
                <ImageWrapper>
                    <img 
                        src="/images/logo.png"
                        width="100"
                        height="100"
                    />
                    <Typography.Title level={2} style={{fontFamily: 'Crimson Text'}}>Welcome to Bivver</Typography.Title>
                </ImageWrapper>
                <Form {...formItemLayout} onSubmit={handleRegister}>
                    <Typography.Title level={4}>Your Establishment</Typography.Title>
                    <Form.Item label="Establishment Name">
                        {getFieldDecorator('name', {
                            rules: [{required: true, message: 'You\'ll need a name to operate your Bivver Store'}]
                        })(<Input style={{width: 350}} />)}
                    </Form.Item>
                    <Form.Item label="Street Address">
                        {getFieldDecorator('address', {
                            rules: [{required: true, message: 'Please specify your address'}]
                        })(<Input style={{width: 375}} />)}
                    </Form.Item>
                    <Form.Item label="City">
                        {getFieldDecorator('city', {
                            rules: [{required: true, message: 'Please input your City'}]
                        })(<Input style={{width: 250}} />)}
                    </Form.Item>
                    <Form.Item label="Postal/Zip Code">
                        {getFieldDecorator('postal_code', {
                            rules: [{required: true, message: 'Please input yout postal/zip code'}]
                        })(<Input style={{width: 100}} />)}
                    </Form.Item>
                    <Form.Item label="Country">
                        {getFieldDecorator('country', {
                            rules: [{required: true, message: 'Please select your country'}]
                        })(<CountryDropdown
                                whitelist={['CA', 'US']}
                            />
                        )}
                    </Form.Item>
                    <Form.Item label="Province/State">
                        {getFieldDecorator('region', {
                            rules: [{required: true, message: 'Please input yout province/state'}]
                        })(<RegionDropdown
                                country={country}
                            />
                        )}
                    </Form.Item>
                    <Form.Item label="Logo">
                        {getFieldDecorator('image', {
                            rules: [{required: true, message: 'Add a logo so your clients can recognize you'}]
                        })(
                            <Upload.Dragger name="image"  multiple={false} onChange={handleImageChange}>
                                {imageUrl 
                                    ? <img src={imageUrl} width="120" height="120" />
                                    : <React.Fragment>
                                        <p className="ant-upload-drag-icon"><Icon type="inbox" /></p>
                                        <p className="ant-upload-text">Click or drag file to this area to upload</p>   
                                    </React.Fragment>

                                }
                            </Upload.Dragger>,
                        )}
                    </Form.Item>
                    
                    {accountType === 'supplier'
                        ? <Form.Item label="Payment Terms">
                            {getFieldDecorator('default_payment_term', {
                                rules: [{required: true, message: 'Please select your payment terms'}]
                            })(<Select style={{width: 80}}>
                                <Select.Option value={0}>0</Select.Option>
                                <Select.Option value={30}>30 days</Select.Option>
                                <Select.Option value={60}>60 days</Select.Option>
                            </Select>)}
                        </Form.Item>
                        : <Form.Item label="Licensee Number">
                            {getFieldDecorator('licensee_number', {
                                rules: [{required: true, message: 'Please input your licensee number'}]
                            })(<Input style={{width: 250}} />)}
                        </Form.Item>
                    }

                    <Divider />
                    <Typography.Title level={4}>Your Account</Typography.Title>
                    <Form.Item label="Email">
                        {getFieldDecorator('username', {
                            rules: [{required: true, message: 'Please enter your email!'}]
                        })(<Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}/>)}
                    </Form.Item>
                    <Form.Item label="Password">
                        {getFieldDecorator('password', {
                            rules: [{required: true, message: 'Please enter your password!'}]
                        })(
                            <Input
                                type="password"
                                prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                            />
                        )}
                    </Form.Item>
                    <Form.Item label="Confirm Password" hasFeedback>
                        {getFieldDecorator('confirm_password', {
                            rules: [
                                {required: true, message: 'Please confirm your password'},
                                {validator: comparePasswords}
                            ]
                        })(
                            <Input
                                type="password"
                                prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                            />
                        )}
                    </Form.Item>

                    <div style={{width: '100%', display: 'flex', justifyContent: 'center', marginBottom: 30}}>
                        <ReCAPTCHA
                            sitekey={config.RECAPTCHA_SITE_KEY}
                            onChange={key => setRecaptchaKey(key)}
                        />
                    </div>
                    {error &&
                        <Alert  
                            description={error} 
                            type="error"
                            style={{marginBottom: 30}}
                        />
                    }

                    <StyledButtonContainer>
                        <Button type="primary" htmlType="submit" loading={loading} block>Sign Up</Button>
                    </StyledButtonContainer>
                </Form>
            </Spin>
        </Card>
    );
};

const WrappedRegisterForm = Form.create({name: 'register-form'})(RegisterForm);

export default WrappedRegisterForm;