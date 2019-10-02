import React, { useState } from 'react';
import { List, InputNumber, Typography, Button, Icon, Avatar, Switch, Tooltip, Badge, Tag } from 'antd';
import styled from 'styled-components';
import { S3Image, getItemDescription } from '../../utils/utils';
import AddEditItem from './AddEditItem';
import api from '../../utils/api';
import Image from '../common/Image'
import LabeledInput from '../common/LabeledInput';

const Item = ({ item, refreshItems }) => {
    const [updateTimeout, setUpdateTimeout] = useState(undefined);
    const [editItem, setEditItem] = useState(false);
    const [loading, setLoading] = useState(false);
    const [enabled, setEnabled] = useState(!item.disabled);

    const handleUpdateQuantity = value => {
        clearTimeout(updateTimeout);
        setUpdateTimeout(setTimeout(() => {
            setLoading(true);
            api.items.update(item.id, {...item, stock_quantity: value})
                .then(res => setLoading(false))
                .catch(err => console.log(err));
        }, 1000));
    };

    const handleUpdateDisabled = value => {
        setEnabled(value);
        api.items.update(item.id, {...item, disabled: value});
    };

    return (
        <React.Fragment>
            {editItem && <AddEditItem handleClose={() => setEditItem(false)} refreshItems={refreshItems} item={item} />}
            <List.Item
                style={{flexWrap: 'wrap'}}
                key={item.id}
                actions={[
                    <Button type="link" onClick={() => setEditItem(true)}>
                        <Icon type="edit" style={{fontSize: 14}}  /> Edit
                    </Button>,
                    <Tooltip title="Enable/Disable purchasing of this item">
                        <Switch defaultChecked={enabled} size="small" onChange={handleUpdateDisabled} />
                        <Tag style={{marginLeft: 8}} color={enabled ? 'green' : 'volcano'}>{enabled ? 'Enabled' : 'Disabled'}</Tag>
                    </Tooltip>
                ]}
                extra={
                    <LabeledInput 
                        value={item.stock_quantity} 
                        onChange={handleUpdateQuantity} 
                        label="on hand" 
                        loading={loading}
                    />
                }
            >
                <List.Item.Meta
                    style={{marginBottom: 16, marginTop: 16}}
                    avatar={<Image src={item.image} width="150px" height="150px" />}
                    title={<Typography.Title level={4}>{item.name}</Typography.Title>}
                    description={getItemDescription(item.order_by, item.measure, item.amount_per_unit, item.quantity_per_order)}
                />
            </List.Item>
        </React.Fragment>
    );
};

export default Item;