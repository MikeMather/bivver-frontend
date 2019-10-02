import React, { useState, useContext, useEffect } from 'react';
import { StoreContext } from '../../context/store';
import Banner from './Banner';
import PopularProducts from './PopularProducts';
import SupplierList from './SupplierList';
import queryString from 'query-string';
import { withRouter } from 'react-router-dom';

const BrowseSuppliers = ({ history }) => {

    const { state } = useContext(StoreContext);
    const [searchRegion, setSearchRegion] = useState(state.shipping_address.region);
    const params = queryString.parse(window.location.search);

    useEffect(() => {
        if (params.region) {
            setSearchRegion(params.region)
        }
        else {
            setSearchRegion(state.shipping_address.region || undefined)
        }
    }, [state, params])

    return (
        <React.Fragment>
            <Banner 
                region={searchRegion}
                handleSelectRegion={val => {
                    val ? history.push(`/?region=${val}`) : history.push(`/`);
                }}
            />
            {!searchRegion
                ? <PopularProducts />
                : <SupplierList region={searchRegion} />
            }
        </React.Fragment>

    )
}

export default withRouter(BrowseSuppliers);