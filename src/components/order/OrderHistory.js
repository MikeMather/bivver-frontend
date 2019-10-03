import React, { useState, useEffect } from 'react';
import OrdersTable from '../supplier/OrdersTable';
import api from '../../utils/api';
import { URL_PARAM_TRUE } from '../../utils/constants';
import { DatePicker, Spin } from 'antd';
import moment from 'moment';

const OrderHistory = () => {

    const [dateRange, setDateRange] = useState({startDate: moment().subtract(30, 'days'), endDate: moment()})
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(false);

    const fetchOrders = () => {
        setLoading(true);
        api.orders.getAll({
            updated_at_after: dateRange.startDate.format('YYYY-MM-DD'),
            updated_at_before: dateRange.endDate.format('YYYY-MM-DD'),
            client_active: URL_PARAM_TRUE
        })
        .then(res => setOrders(res))
        .catch(err => console.log(err))
        .finally(() => setLoading(false));
    }

    useEffect(() => {
        fetchOrders();
    }, [dateRange.endDate])

    return (
        <Spin spinning={loading}>
            <DatePicker.RangePicker
                defaultValue={[dateRange.startDate.clone(), dateRange.endDate.clone()]}
                ranges={{
                    'This Month': [moment().startOf('month'), moment().endOf('month')],
                }}
                onChange={(dates, dateStrings) => setDateRange({startDate: dates[0], endDate: dates[1]})}
            />
            <OrdersTable orders={orders} refreshOrders={fetchOrders} />
        </Spin>
    );
};

export default OrderHistory;