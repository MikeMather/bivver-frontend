import types from './types';

const initialState = {
    authenticated: false,
    username: '',
    shipping_address: {},
    billing_address: {},
    supplier: {},
    client: {
        orders: [],
        active_orders: []
    },
    account_type: 'client'
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case types.SET_APP_STATE:
            if (action.payload.client) {
                return {
                    ...state,
                    ...action.payload,
                    client: {
                        ...action.payload.client,
                        active_orders: action.payload.client.orders.filter(order => order.state === 'draft' || order.state === 'pending_client_approval')
                    }
                }
            }
            return {
                ...state,
                ...action.payload
            };
        case types.CLEAR_APP_STATE:
            return initialState;
        default:
            return state;
    }
}

export { initialState, reducer};