import React, { useState, useEffect } from 'react';
import ItemList from './ItemList';
import api from '../../utils/api';
import moment from 'moment';
import Product from './Product'
import { Badge } from 'antd';

const PopularProducts = () => {
    const [items, setItems] = useState([]);

    useEffect(() => {
        api.products.publicList({created_at__gt: moment().subtract(30, 'days').format('YYYY-MM-DD')})
            .then(res => setItems(res))
            .catch(err => console.log(err));
    }, []);

    return (
        <ItemList title="Recently Added">
            {items.map(item => <Product key={item.id} item={item} />)}
        </ItemList>
    );
};

export default PopularProducts;