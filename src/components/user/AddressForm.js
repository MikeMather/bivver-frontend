import React from 'react';
import { Input, Form } from 'antd';
import { CountryDropdown, RegionDropdown } from 'react-country-region-selector';

const AddressForm = ({ address, city, country, region, postal_code, handleChange }) => {

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

    return (
        <Form {...formItemLayout}>
            <Form.Item label="Address">
                <Input value={address} onChange={e => handleChange({address: e.target.value})} />
            </Form.Item>
            <Form.Item label="City">
                <Input value={city} onChange={e => handleChange({city: e.target.value})} />
            </Form.Item>
            <Form.Item label="Postal Code">
                <Input value={postal_code} onChange={e => handleChange({postal_code: e.target.value})} />
            </Form.Item>
            <Form.Item label="Country">
                <CountryDropdown
                    whitelist={['CA', 'US']}
                    value={country}
                    onChange={country => handleChange({country})}
                />
            </Form.Item>
            <Form.Item label="Region">
                <RegionDropdown
                    country={country}
                    value={region}
                    onChange={region => handleChange({region})}
                />
            </Form.Item>
        </Form>
    );
};

export default AddressForm;