import { ORDER_STATES } from '../../utils/constants';
import moment from 'moment';
import { currencyFormat } from '../../utils/utils';

export const getPaymentStatus = (state, dueDate) => {
    if (ORDER_STATES.outstanding_states.includes(state) && moment().isSameOrAfter(dueDate)) {
        return `Overdue - due ${moment(dueDate).fromNow()}`;
    }
    else if (ORDER_STATES.paid_states.includes(state)) {
        return 'Paid';
    }
    else if (ORDER_STATES.outstanding_states.includes(state)) {
        return 'Outstanding';
    }
    return '';
}

export const getDashboardStatistics = orders => {
    return orders.reduce((groups, order) => {
        const paymentStatus = getPaymentStatus(order.state, order.payment_due_date);
        let newGroups = {...groups};
        if (paymentStatus === 'Outstanding') {
            newGroups.outstanding = [...groups.outstanding, order];
        }
        if (paymentStatus.includes('Overdue')) {
            newGroups.overdue = [...groups.overdue, order];
        }
        if (ORDER_STATES.pending_delivery_states.includes(order.state)) {
            newGroups.pending = [...groups.pending, order];
        }
        if (ORDER_STATES.delivered_states.includes(order.state)) {
            newGroups.delivered = [...groups.delivered, order];
        }
        if (ORDER_STATES.paid_states.includes(order.state)) {
            newGroups.paid = [...groups.paid, order];
        }
        return newGroups;
    }, {pending: [], outstanding: [], overdue: [], delivered: [], paid: []});
}


export const formatChartData = (startDate, endDate, orders) => {
    const days = endDate.diff(startDate, 'days') + 1;
    const searchDate = startDate.subtract(1, 'days');
    const data = [];

    const deliveredOrderDates = orders.filter(order => 
        ORDER_STATES.delivered_states.includes(order.state)
    ).map(order => moment(order.updated_at).format('YYYY-MM-DD'));

    const receivedOrderDates = orders.map(order => moment(order.created_at).format('YYYY-MM-DD'));

    for (let i = 0; i < days; i++) {
        const pointDate = searchDate.add(1, 'days').format('YYYY-MM-DD');
        data.push({
            name: searchDate.format('LL'),
            delivered: deliveredOrderDates.filter(date => date === pointDate).length,
            received: receivedOrderDates.filter(date => date === pointDate).length,
        });
    }
    return data;
}

export const formatOrdersTableData = orders => {
    return orders.map(order => ({
        key: order.id,
        id: order.id,
        status: order.state,
        client: order.client.name,
        submitted: moment(order.submitted_at).format('LL'),
        amount_due: currencyFormat(order.amount_due/100),
        payment_status: getPaymentStatus(order.state, order.payment_due_date),
        order: order
    }));
};