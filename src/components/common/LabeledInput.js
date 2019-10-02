import React from 'react';
import styled from 'styled-components';
import { InputNumber, Icon, Typography } from 'antd';

export const ItemContainer = styled.div`
    display: flex;
    align-items: center;
    height: 100%;
    position: relative;
    input {
        font-size: 18px;
        text-align: center;
    }
`;

const LabeledInput = ({ value, onChange, loading, label, disabled }) => (
    <ItemContainer>
        <InputNumber 
            defaultValue={value} 
            style={{marginRight: 10}} 
            onChange={onChange}
            min={0}
            disabled={disabled}
        />
        <Typography.Text style={{width: '70%'}}>{loading ? <Icon type="loading" /> : label}</Typography.Text>
    </ItemContainer>
);

export default LabeledInput;