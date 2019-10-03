import React, { useContext, useState, useMemo } from 'react';
import { StoreContext } from '../../context/store';
import { Button, Tooltip, Alert, message } from 'antd';
import { createOrUpdateOrder } from './helper';
import LoginSignUpModal from '../registration/LoginSignUpModal';

const AddToCartButton = ({ item }) => {

    const { state, actions } = useContext(StoreContext);
    const [loading, setLoading] = useState(false);
    const [showLoginModal, setShowLoginModal] = useState()

    const existsInCart = useMemo(() => {
        if (state.client) {
            const order = state.client.active_orders.find(order => order.supplier.id === item.supplier)
            if (order) {
                return order.line_items.some(lineItem => lineItem.item.id === item.id);
            }
        }
        return false;
    }, [item, state])

    const addToCart = () => {
        if (state.authenticated) {
            setLoading(true);
            createOrUpdateOrder(item, state)
                .catch(err => message.error(Object.values(err)[0]))
                .then(() => {
                    actions.fetchAppState().finally(() => setLoading(false));
                });
        }
        else {
            setShowLoginModal(true);
        }
    };

    const handleLogin = () => {
        addToCart();
        setShowLoginModal(false);
    }

    return (
        <React.Fragment>
            {showLoginModal &&
                <LoginSignUpModal callback={handleLogin} handleCancel={() => setShowLoginModal(false)} />
            }
            {existsInCart
                ? <Tooltip title="Already added to your current order">
                    <Alert message="Added to order" type="success" showIcon style={{fontSize: 12}} />
                </Tooltip>
                : <Button loading={loading} type="primary" onClick={addToCart}>Add to Cart</Button>
            }
        </React.Fragment>
    );
};

export default AddToCartButton;