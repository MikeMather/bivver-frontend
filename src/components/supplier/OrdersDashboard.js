import React, { useState, useEffect, useMemo } from 'react';
import { Statistic, Card, Table, DatePicker, Row, Col, Icon } from 'antd';
import moment from 'moment';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import api from '../../utils/api';
import { URL_PARAM_TRUE } from '../../utils/constants';
import { getDashboardStatistics, formatChartData } from './helper.js';
import { currencyFormat } from '../../utils/utils';
import OrdersTable from './OrdersTable';

const OrdersDashboard = () => {

    const [orders, setOrders] = useState([]);
    const [dateRange, setDateRange] = useState({startDate: moment().subtract(30, 'days'), endDate: moment()})
    const [loading, setLoading] = useState(false);
    const [chartData, setChartData] = useState([]);
    const defaultStats = {
        outstanding: [], 
        pending: [], 
        delivered: [], 
        overdue: [], 
        paid: [], 
        outstandingTotal: 0, 
        pendingDeliveries: 0, 
        overdueTotal: 0, 
        paymentsReceivedTotal: 0, 
        deliveriesCompleted: 0
    }
    const [statistics, setStatistics] = useState(defaultStats);
    const dateFormat = 'YYYY-MM-DD';

    const getStatistics = newOrders => {
        const stats = getDashboardStatistics(newOrders);
        return {
            ...stats,
            outstandingTotal: currencyFormat(stats.outstanding.reduce((a, b) => a + b.amount_due, 0) / 100),
            pendingDeliveries: stats.pending.length,
            overdueTotal: currencyFormat(stats.overdue.reduce((a, b) => a + b.amount_due / 100, 0)),
            paymentsReceivedTotal: currencyFormat(stats.paid.reduce((a, b) => a + b.amount_due / 100, 0)),
            deliveriesCompleted: stats.delivered.length
        }
    };

    const fetchOrders = () => {
        setLoading(true);
        api.orders.getAll({
            updated_at_after: dateRange.startDate.format(dateFormat),
            updated_at_before: dateRange.endDate.format(dateFormat),
            supplier_active: URL_PARAM_TRUE
        })
        .then(res => {
            setOrders(res);
            setStatistics(getStatistics(res));
            setChartData(formatChartData(dateRange.startDate.clone(), dateRange.endDate.clone(), res));
        })
        .catch(err => console.log(err))
        .finally(() => setLoading(false));
    }

    useEffect(() => {
        fetchOrders();
    }, [dateRange.endDate])

    return (
        <div className="orders-dashboard">
            <DatePicker.RangePicker
                defaultValue={[dateRange.startDate.clone(), dateRange.endDate.clone()]}
                ranges={{
                    'This Month': [moment().startOf('month'), moment().endOf('month')],
                }}
                onChange={(dates, dateStrings) => setDateRange({startDate: dates[0], endDate: dates[1]})}
            />
            <Row gutter={32} style={{marginBottom: '30px', marginTop: '30px'}}>
                <Col xs={24} sm={8}>
                    <Card>
                        <Statistic
                            title="Outstanding"
                            value={statistics.outstandingTotal}
                            prefix={<Icon type="credit-card" />}
                            valueStyle={{ color: '#e5a100' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={8}>
                    <Card>
                        <Statistic
                            title="Pending Deliveries"
                            value={statistics.pendingDeliveries}
                            prefix={<Icon type="car" />}
                            valueStyle={{ color: '#9F86C0' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={8}>
                    <Card>
                        <Statistic
                            title="Overdue"
                            value={statistics.overdueTotal}
                            prefix={<Icon type="calendar" />}
                            valueStyle={{ color: '#f22100' }}
                        />
                    </Card>
                </Col>
            </Row>
            <Row gutter={0}>
                <Col xs={24} sm={4}>
                    <Card>
                        <Statistic
                            title="Payments Received"
                            value={statistics.paymentsReceivedTotal}
                            prefix={<Icon type="dollar" />}
                            valueStyle={{ color: '#59AFC8' }}
                            style={{marginBottom: '75px'}}
                        />
                        <Statistic
                            title="Deliveries Completed"
                            value={statistics.deliveriesCompleted}
                            prefix={<Icon type="check-circle" />}
                            valueStyle={{ color: '#53B380' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={20}>
                    <ResponsiveContainer height={300}>
                        <BarChart
                            data={chartData}
                        >
                            <CartesianGrid />
                            <XAxis dataKey="name" />
                            <YAxis allowDecimals={false} />
                            <Tooltip />
                            <Legend />
                            <Bar name="Delivered" dataKey="delivered" fill="#59AFC8" />
                            <Bar name="Received" dataKey="received" fill="#53B380" />
                        </BarChart>
                    </ResponsiveContainer>
                </Col>
            </Row>
            <OrdersTable orders={orders} refreshOrders={fetchOrders} />
        </div>
    )
}

export default OrdersDashboard;