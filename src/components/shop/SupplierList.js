import React, { useState, useEffect } from 'react';
import ItemList from './ItemList';
import api from '../../utils/api';
import { Spin } from 'antd';
import Supplier from './Supplier';


const SupplierList = ({ region }) => {

    const [suppliers, setSuppliers] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchSuppliers = () => {
        api.supplierSearch.publicList({
            region
        })
        .then(res => setSuppliers(res))
        .catch(err => console.log(err))
        .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchSuppliers();
    }, [region])

    return (
        <Spin tip={`Searching for suppliers in ${region}`} spinning={loading}>
            <ItemList title={`Suppliers in ${region}`}>
                {suppliers.map(supplier => <Supplier supplier={supplier} />)}
            </ItemList>
        </Spin>
    )
};

export default SupplierList;