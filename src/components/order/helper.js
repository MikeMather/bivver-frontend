import api from '../../utils/api';

export const deleteLineItem = id => {
    return api.lineItems.delete(id);
}

export const deleteOrder = id => {
    return api.orders.delete(id);
}

export const getOrderSummary = order => {
    return api.taxRates.getOne(order.client.id)
        .catch(({ message }) => {
            return {hst: '0'};
        })
        .then(({ hst }) => {
            const taxRate = parseFloat(hst);
            const orderTotal = order.line_items.reduce((total, item) => 
                total + (parseFloat(item.price) * item.order_quantity)
            , 0.0).toFixed(2);
            const subTotal = orderTotal * (1 + taxRate);
            const kegDeposits = order.line_items.reduce((count, lineItem) => {
                return count + (lineItem.item.order_by === 'Keg') * lineItem.order_quantity;
            }, 0);

            return {
                taxRate,
                kegDeposits: {
                    count: kegDeposits,
                    cost: (kegDeposits * order.supplier.keg_deposit_price).toFixed(2)
                },
                kegReturns: {
                    count: order.keg_returns,
                    cost: (order.keg_returns * order.supplier.keg_deposit_price).toFixed(2)
                },
                orderTotal,
                subTotal,
                total: (subTotal + (kegDeposits - order.keg_returns) * order.supplier.keg_deposit_price).toFixed(2)
            };
        });
};

export const submitOrder = order => {
    const transition  = 'client-submit';
    return api.orders.update(order.id, {
        payment_due_date: order.payment_due_date,
        keg_returns: order.keg_returns
    })
    .then(updatedOrder => api.orders.transition(updatedOrder.id, transition));
}