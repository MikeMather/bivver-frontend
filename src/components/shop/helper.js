import api from '../../utils/api';

export const formatStoreProducts = items => {
    return items.reduce((a, b) => {
        if (b.order_by === 'Keg') {
            return {...a, Kegs: [...a.Kegs, b]}
        }
        else if (b.order_by === 'Case') {
            return {...a, Cases: [...a.Cases, b]}
        }
        else {
            return {...a, Bottles: [...a.Bottles, b]}
        }
    }, {Kegs: [], Cases: [], Bottles: []});
};

export const createLineItem = (item, order) => {
    return api.lineItems.create({
        item_id: item.id,
        order_quantity: 1,
        price: item.discounted_price || item.price,
        order: order.id
    });
}

export const createOrUpdateOrder = (item, state) => {
    const order = state.client.active_orders.length && state.client.active_orders.find(order => order.supplier.id === item.supplier);
    if (order) {
        return createLineItem(item, order);
    }
    return api.orders.create({
        client_id: state.client.id,
        supplier_id: item.supplier
    }).then(order => createLineItem(item, order))
};