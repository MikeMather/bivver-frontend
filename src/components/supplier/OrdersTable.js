import React, { useState, useEffect, useMemo, useContext } from 'react';
import { Table, Tag, Spin, Divider } from 'antd';
import { formatOrdersTableData } from './helper.js';
import { ORDER_STATES } from '../../utils/constants';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import SupplierOrderActions from '../order/SupplierOrderActions';
import ClientOrderActions from '../order/ClientOrderActions';
import { StoreContext } from '../../context/store';

const { Column } = Table;

const StyledTableWrapper = styled.div`
    margin-top: 40px;
    max-width: 100%;
    overflow-x: auto;
`;

const OrdersTable = ({ orders, refreshOrders }) => {

    const [data, setData] = useState(orders);
    const [loading, setLoading] = useState(true);
    const { state } = useContext(StoreContext);
    const isSupplier = state.account_type === 'supplier';

    const tags = useMemo(() => {
        if (isSupplier) {
            return ORDER_STATES.supplier
        }
        return ORDER_STATES.client
    }, [])

    useEffect(() => {
        setLoading(true);
        setData(formatOrdersTableData(orders));
        setLoading(false);
    }, [orders])

    const stateFilters = [
        {text: 'New', value: ['pending_supplier_approval']},
        {text: 'Outstanding', value: ['pending_payment', 'delivered_pending_payment']},
        {text: 'Declined', value: ['declined']},
        {text: 'Pending delivery', value: ['paid', 'pending_payment']},
    ];

    return (
        <StyledTableWrapper>
            <Spin spinning={loading}>
                <Table dataSource={data}>
                    <Column
                        title="Status"
                        dataIndex="status"
                        key="statuses"
                        render={status => <Tag color={tags[status].tagColor}>{tags[status].title}</Tag>}
                        filters={stateFilters}
                        onFilter={(value, record) => value.includes(record.status)}
                    />
                    <Column
                        title={isSupplier ? 'Client' : 'Supplier'}
                        key="client"
                        dataIndex={isSupplier ? 'client' : 'supplier'}
                    />
                    <Column
                        title="Submitted"
                        dataIndex="submitted"
                        key="submitted"
                    />
                    <Column
                        title="Order Total"
                        dataIndex="amount_due"
                        key="amount_due"
                        align="center"
                        render={amount_due => <strong style={{fontSize: 16}}>{amount_due}</strong>}
                    />
                    <Column
                        title="Payment Status"
                        key="payment"
                        dataIndex="payment_status"
                    />
                    <Column
                        title="Actions"
                        key="actions"
                        align="right"
                        render={(text, record) => (
                            <span>
                                <Link to={`/orders/${record.id}`}>View</Link>
                                <Divider type="vertical" />
                                {isSupplier
                                    ? <SupplierOrderActions refreshOrder={refreshOrders} order={record.order} />
                                    : <ClientOrderActions refreshOrder={refreshOrders} order={record.order} />
                                }
                            </span>
                        )}
                    />
                </Table>
            </Spin>
        </StyledTableWrapper>
    );
};

export default OrdersTable;