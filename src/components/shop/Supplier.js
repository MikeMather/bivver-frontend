import React from 'react';
import { Card, Tag } from 'antd';
import { S3Image, capitalize } from '../../utils/utils';
import { Link } from 'react-router-dom';
import { SUPPLIER_TAG_COLOURS } from '../../utils/constants'; 
import Image from '../common/Image';

const Supplier = ({ supplier }) => (
    <Link to={`/suppliers/${supplier.id}`}>
        <Card
            hoverable
            style={{width: 300, height: 320}}
            cover={<Image src={supplier.image} width="200px" height="220px" />}
        >
            <Card.Meta
                title={<b>{supplier.name}</b>}
                description={<Tag color={SUPPLIER_TAG_COLOURS[supplier.supplier_type]}>{capitalize(supplier.supplier_type)}</Tag>}
            />
        </Card>
    </Link>
);

export default Supplier;
