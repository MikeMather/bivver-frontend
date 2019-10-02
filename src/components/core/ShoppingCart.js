import React, { useContext, useMemo } from 'react';
import { StoreContext } from '../../context/store';
import { Icon, Popover, Button, Badge } from 'antd';
import styled from 'styled-components';
import Carts from '../order/Carts';

const CartContainer = styled.span`
    width: 80px;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    position: relative;
`;

const ShoppingCart = ({ color='white' }) => {

    const { state } = useContext(StoreContext);
    const orders = state.client.active_orders;

    return (
        <CartContainer>
            <Badge 
                count={orders.length} 
                offset={[-15, 30]} 
                title={`${orders.length} unsubmitted orders`}
            >
                <Popover
                    placement="bottomRight"
                    trigger="click"
                    content={<Carts orders={orders} />}
                    title="Unsubmitted orders"
                >
                    <Button type="link">
                        <Icon 
                            type="shopping-cart"
                            style={{color: color, fontSize: 24}}
                        />
                    </Button>
                </Popover>
            </Badge>
        </CartContainer>
    );
};

export default ShoppingCart;