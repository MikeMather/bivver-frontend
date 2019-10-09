import React from 'react';
import { Tag } from 'antd';
import { capitalize } from '../../utils/utils';
import { SUPPLIER_TAG_COLOURS } from '../../utils/constants';
import Header from './Header';


const SupplierHeader = ({ supplier_type, region, ...props}) => (
    <Header
        Label={() => <Tag color={SUPPLIER_TAG_COLOURS[supplier_type]}>{capitalize(supplier_type || '')}</Tag>}
        region={region}
        {...props}
    />
);


export default SupplierHeader;
