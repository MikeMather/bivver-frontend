import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { List, Typography, Button, Popconfirm } from 'antd';
import styled from 'styled-components';
import { capitalize, getItemDescription } from '../../utils/utils';
import Image from '../common/Image';
import LabeledInput from '../common/LabeledInput';
import { Link } from 'react-router-dom';

const ExtraContainer = styled.div`
    display: flex;
    align-items: center;
    width: 280px;
    height: 100%;
    justify-content: space-between;

    p {
        font-size: 16px;
        font-weight: bold;
        margin: 0;
    }
`;

const LineItem = ({ item, refreshOrder, handleDeleteLineItem, allowEdit }) => {

    const [updateTimeout, setUpdateTimeout] = useState(undefined);
    const [loading, setLoading] = useState(false);

    const handleUpdateOrderQuantity = value => {
        clearTimeout(updateTimeout);
        setUpdateTimeout(setTimeout(() => {
            setLoading(true);
            api.lineItems.update(item.id, {order_quantity: value})
                .then(res => {
                    refreshOrder()
                    setLoading(false)
                })
                .catch(err => console.log(err));
        }, 1000));
    };

    return (
        <List.Item
            actions={allowEdit
                ? [
                    <Link to={`/suppliers/${item.item.supplier}/products/${item.item.id}`}>View</Link>,
                    <Popconfirm
                        title="Are you want to remove this item from your order?"
                        onConfirm={() => handleDeleteLineItem(item.id)}
                    >
                        <Button type="link" style={{padding: 0}}>Remove from order</Button>
                    </Popconfirm>
                ]
                : []
            }
            extra={
                <ExtraContainer>
                    <p>${parseFloat(item.price).toFixed(2)}</p>
                    <LabeledInput
                        label="order quantity"
                        loading={loading}
                        value={item.order_quantity}
                        onChange={handleUpdateOrderQuantity}
                        disabled={!allowEdit}
                    />
                </ExtraContainer>
            }
        >
            <List.Item.Meta
                style={{alignItems: 'center'}}
                avatar={<Image src={item.item.image} width="150px" height="150px" />}
                title={<b style={{fontSize: 18}}>{item.item.name}</b>}
                description={getItemDescription(item.item.order_by, item.item.measure, item.item.amount_per_unit, item.item.quantity_per_order)}
            />
    </List.Item>
    );
};

export default LineItem;