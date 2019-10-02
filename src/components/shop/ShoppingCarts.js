import React, { useState, useEffect, useContext } from 'react';
import { StoreContext } from '../../context/store';
import { Popover, Icon } from 'antd';
import { Button } from 'antd/lib/radio';
import styled from 'styled-components';

const FloatingButton = styled.div`
    position: sticky;
    bottom: 5%;
    right: 5%;
    border-radius: 100%;
    background-color: #1c99d3;
    width: 70px;
    height: 70px;
`;

const ShoppingCarts = () => {
    const { state } = useContext(StoreContext);
    const [open, setOpen] = useState(false);

    return (
        <FloatingButton>
            <Icon type="shopping-cart" />
        </FloatingButton>
    );
};

export default ShoppingCarts;