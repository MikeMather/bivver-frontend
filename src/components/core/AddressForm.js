import React from 'react';
import { CountryDropdown, RegionDropdown } from 'react-country-region-selector';
import { Input } from 'antd'
import { FormField } from '../order/SubmitOrderModal';

const AddressForm = ({ address, onChange }) => (
    <div>
        <FormField>
            <label>Street Address</label>
            <Input value={address.address} onChange={e => onChange({address: e.target.value})} />
        </FormField>
        <FormField width="260px">
            <label>City</label>
            <Input value={address.city} onChange={e => onChange({city: e.target.value})} />
        </FormField>
        <FormField>
            <label>Country</label>
            <CountryDropdown
                whitelist={['CA', 'US']}
                value={address.country}
                onChange={country => onChange({country})}
            />
        </FormField>
        <FormField>
            <label>Region</label>
            <RegionDropdown
                country={address.country}
                value={address.region}
                onChange={region => onChange({region})}
            />
        </FormField>
        <FormField width="280px">
            <label>Postal/Zip Code</label>
            <Input value={address.postal_code} onChange={e => onChange({postal_code: e.target.value})} />
        </FormField>
    </div>
);

export default AddressForm;