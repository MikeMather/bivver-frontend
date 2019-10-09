import React, { useState, useContext, useEffect, useMemo } from 'react';
import { StoreContext } from '../../context/store';
import { withRouter } from 'react-router-dom';
import { Breadcrumb, Button } from 'antd';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import SupplierHeader from './SupplierHeader';
import { formatStoreProducts } from './helper';
import ItemList from './ItemList';
import Product from './Product';

const SupplierStore = ({ match }) => {

    const { state } = useContext(StoreContext);
    const [supplier, setSupplier] = useState({});
    const [items, setItems] = useState({Kegs: [], Cases: [], Bottles: []});
    const [loading, setLoading] = useState(false);
    const activeOrder = useMemo(() => {
        return state.client.active_orders.find(order => order.supplier.id === supplier.id) || {};
    }, [supplier, state]);

    const fetchData = () => {
        if (match.params.supplierId) {
            setLoading(true)
            api.supplierSearch.publicRetrieve(match.params.supplierId)
                .then(res => {
                    setSupplier(res);
                    api.products.publicList({supplier: res.id})
                        .then(res => setItems({...formatStoreProducts(res)}))
                        .finally(() => setLoading(false));
                });
        }
    }

    useEffect(() => {
        fetchData();
    }, [])

    const links = () => (
        <Breadcrumb>
            <Breadcrumb.Item>
                <Link to={`/?${state.region}`}>Suppliers</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>{supplier.name}</Breadcrumb.Item>
        </Breadcrumb>
    );

    const checkoutButton = () => (
        <Link to={`/orders/${activeOrder.id}`}>
            <Button type="primary" disabled={!activeOrder.id}>Checkout</Button>
        </Link>
    );

    return (
        <React.Fragment>
            <SupplierHeader 
                {...supplier} 
                Breadcrumbs={links} 
                Extra={checkoutButton}
            />
            {Object.keys(items).map(key => (
                items[key].length
                ? <ItemList title={key}>
                    {items[key].map(item => <Product key={item.id} item={item} />)}
                </ItemList>
                : <span></span>
            ))}
        </React.Fragment>
    )
}

export default withRouter(SupplierStore);