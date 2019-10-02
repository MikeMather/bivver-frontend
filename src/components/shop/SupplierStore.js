import React, { useState, useContext, useEffect } from 'react';
import { StoreContext } from '../../context/store';
import { withRouter } from 'react-router-dom';
import { Spin } from 'antd';
import api from '../../utils/api';
import StoreBanner from './StoreBanner';
import { formatStoreProducts } from './helper';
import ItemList from './ItemList';
import Product from './Product';

const SupplierStore = ({ match }) => {

    const { state } = useContext(StoreContext);
    const [supplier, setSupplier] = useState({});
    const [items, setItems] = useState({Kegs: [], Cases: [], Bottles: []});
    const [loading, setLoading] = useState(false);

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

    return (
        <React.Fragment>
            <StoreBanner {...supplier} />
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