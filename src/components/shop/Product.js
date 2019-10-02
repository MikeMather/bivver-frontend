import React from 'react';
import { Card, Typography } from 'antd';
import { S3Image, getItemDescription } from '../../utils/utils';
import styled from 'styled-components';
import Image from '../common/Image';
import { createOrUpdateOrder } from './helper';
import { Link } from 'react-router-dom';
import AddToCartButton from './AddToCartButton';

export const StyledButtonContainer = styled.div`
    width: 100%;
    display: flex;
    justify-content: flex-end;
    margin-top: 20px;
    align-items: center;

    strong {
        margin-right: 15px;
    }
`;

const ImageContainer = styled.div`
    width: 100%;
    height: 220px;
    position: relative;

    &::after {
        position: absolute;
        top: 0;
        width: 100%;
        height: 100%;
        background-color: transparent;
        color: transparent;
        font-size: 14px;
        transition: background-color 0.2s ease;
        content: 'View Details';
        display: flex;
        align-items: center;
        justify-content: center;
    }

    &:hover::after {
        background-color: rgba(18, 124, 173, .8);
        color: white;
    }
`;

const Product = ({ item }) => (
    <Card
        hoverable
        style={{width: 250, height: 355}}
        cover={<Link to={`/suppliers/${item.supplier}/products/${item.id}`}>
                <ImageContainer>
                    <Image src={item.image} />
                </ImageContainer>
            </Link>
        }
    >
        <Card.Meta
            title={<strong>{item.name}</strong>}
            description={getItemDescription(item.order_by, item.measure, item.amount_per_unit, item.quantity_per_order)}
        />
        <StyledButtonContainer>
            <Typography.Text strong>${item.price}</Typography.Text>
            <AddToCartButton item={item} />
        </StyledButtonContainer>
    </Card>
);

export default Product;
