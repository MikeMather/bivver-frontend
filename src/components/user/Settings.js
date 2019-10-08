import React, { useContext, useState, useEffect } from 'react';
import { StoreContext } from '../../context/store';
import types from '../../context/types';
import { Tabs, Button, Message, Typography, Input, InputNumber, Switch, message, Badge, Select } from 'antd'
import styled from 'styled-components';
import AddressForm from './AddressForm';
import api from '../../utils/api';
import StripeConnectButton from './StripeConnectButton';

const StyledSettingsContainer = styled.div`
    margin: 0 auto;
`;

const FormField = styled.div`
    display: flex;
    align-items: center;
    width: 60%;
    flex-wrap: wrap;
    justify-content: space-between;
    margin: 50px 0;

    > div {
        width: 300px;
    }

    input {
        max-width: 400px;
    }
`;

const StyledButtonContainer = styled.div`
    width: 60%;
    display: flex;
    justify-content: flex-end;
    margin-bottom: 50px;
`;

const Settings = () => {

    const { state, dispatch } = useContext(StoreContext);
    const [settings, setSettings] = useState(state);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setSettings({
            ...state,
            addresses_are_same: state.shipping_address.id === state.billing_address.id
        });
    }, [state])

    const updateSettings = changes => {
        setSettings({
            ...settings,
            ...changes
        });
    };

    const saveSettings = () => {
        setLoading(true);
        api.settings.update(settings.id, settings)
        .then(res => {
            dispatch({
                type: types.SET_APP_STATE,
                payload: {
                    ...state,
                    ...res
                }
            });
            message.success('Your settings have been updated')
        })
        .catch(err => {
            console.log(err);
            message.error('There was a problem saving your changes');
        })
        .finally(() => setLoading(false))
    }

    return (
        <StyledSettingsContainer>
            <Tabs defaultActiveKey="1">
                <Tabs.TabPane tab="Account" key="1">
                    <FormField>
                        <div>
                            <Typography.Title level={4}>Email Address</Typography.Title>
                            <Typography.Text type="secondary">
                                This is the email you use to login and receive notifications about orders
                            </Typography.Text>
                        </div>
                        <Input value={settings.username} onChange={e => updateSettings({username: e.target.value})} />
                    </FormField>
                    <FormField>
                        <div>
                            <Typography.Title level={4}>Shipping Address</Typography.Title>
                            <Typography.Text type="secondary">Your physical location</Typography.Text>
                        </div>
                        <AddressForm 
                            {...settings.shipping_address} 
                            handleChange={changes => updateSettings({shipping_address: {...settings.shipping_address, ...changes}})} 
                        />
                    </FormField>
                    <FormField>
                        <div>
                            <Typography.Title level={4}>Billing Address</Typography.Title>
                            <Typography.Text type="secondary">The address that's used on your invoices</Typography.Text>
                        </div>
                        <span>Same as shipping address <Switch checked={settings.addresses_are_same} onChange={val => updateSettings({addresses_are_same: val})} /></span>
                        {!settings.addresses_are_same &&
                            <AddressForm 
                                {...settings.billing_address} 
                                handleChange={changes => updateSettings({billing_address: {...settings.billing_address, ...changes}})} 
                            />
                        }
                    </FormField>
                </Tabs.TabPane>
                {state.account_type === 'supplier' &&
                    <Tabs.TabPane 
                        tab={
                            <span>Orders & Payments {!settings.has_payment_account && <Badge count={5} color="red" />}</span>
                        } 
                        key="2"
                    >
                        <FormField>
                            <div>
                                <Typography.Title level={4}>Card Payments {!settings.has_payment_account && <Badge count={5} color="red" />}</Typography.Title>
                                <Typography.Text type="secondary">
                                    Accept card payments for your orders deposited directly to your bank account by 
                                    connecting to our integrated payments platform
                                </Typography.Text>
                            </div>
                            <StripeConnectButton user={settings} />
                        </FormField>
                        <FormField>
                            <div>
                                <Typography.Title level={4}>Keg Deposit Price {!settings.supplier.keg_deposit_price && <Badge count={5} color="red" />}</Typography.Title>
                                <Typography.Text type="secondary">Enter a value to include keg deposits on your invoices</Typography.Text>
                            </div>
                            <InputNumber
                                style={{width: 90}}
                                min={0} 
                                formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                parser={value => value.replace(/\$\s?|(,*)/g, '')}
                                value={settings.supplier.keg_deposit_price} 
                                onChange={val => updateSettings({supplier: {...settings.supplier, keg_deposit_price: val}})}
                            />
                        </FormField>
                        <FormField>
                        <div>
                            <Typography.Title level={4}>Payment Term</Typography.Title>
                            <Typography.Text type="secondary">Enter the number of days to allow before unpaid orders are flagged as overdue</Typography.Text>
                        </div>
                        <Select 
                            style={{width: 110}}
                            onChange={val => updateSettings({supplier: {...settings.supplier, default_payment_term: val}})}
                            defaultValue={settings.supplier.default_payment_term}
                        >
                            <Select.Option value="0">0</Select.Option>
                            <Select.Option value="30">30</Select.Option>
                            <Select.Option value="60">60</Select.Option>
                        </Select>
                    </FormField>
                    </Tabs.TabPane>
                }
            </Tabs>
            <StyledButtonContainer>
                <Button type="primary" size="large" loading={loading} onClick={saveSettings}>Save</Button>
            </StyledButtonContainer>
        </StyledSettingsContainer>
    )
}

export default Settings;