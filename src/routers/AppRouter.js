import React, { useEffect, useState, useContext } from 'react';
import { StoreContext } from '../context/store';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import TopPanel from '../components/core/TopPanel';
import Sidebar from '../components/core/Sidebar';
import Login from '../components/registration/Login';
import styled from 'styled-components';
import OrdersDashboard from '../components/supplier/OrdersDashboard';
import Items from '../components/item/Items';
import Logout from '../components/registration/Logout';
import RegisterSupplier from '../components/registration/RegisterSupplier';
import RegisterClient from '../components/registration/RegisterClient';
import EmailVerify from '../components/registration/EmailVerify';
import BrowseSuppliers from '../components/shop/BrowseSuppliers';
import SupplierStore from '../components/shop/SupplierStore';
import ViewProduct from '../components/shop/ViewProduct';
import ClientOrders from '../components/order/ClientOrders';
import ViewOrder from '../components/order/ViewOrder';
import SetupAccountBanner from '../components/supplier/SetupAccountBanner';
import Settings from '../components/user/Settings';
import StripeConnect from '../components/user/StripeConnect';
import OrderHistory from '../components/order/OrderHistory';

const SupplierRouter = auth => (
    <Switch>
        <Route path="/verify" component={() => <EmailVerify {...auth} />} />
        {auth.authenticated
            ? <React.Fragment>
                <Route exact path="/" component={OrdersDashboard} />
                <Route exact path="/inventory" component={Items} />
                <Route exact path="/settings" component={Settings} />
                <Route exact path="/stripe-connect" component={StripeConnect} />
                <Route exact path="/clients" component={() => <p>Clients</p>} />
                <Route exact path="/orders/:orderId" component={ViewOrder} />
                <Route exact path="/logout" component={() => <Logout {...auth} />} />
                <Route path="/login" component={() => <Login {...auth} />} />
            </React.Fragment>
            : <React.Fragment>
                <Route path="/(login|)" component={() => <Login {...auth} />} />
                <Route path="/register/supplier" component={() => <RegisterSupplier {...auth} />} />
            </React.Fragment>
        }
    </Switch>
);


const LocationRouter = auth => (
    <Switch>
        <Route exact path="/(browse|)" component={() => <BrowseSuppliers {...auth} />} />
        <Route exact path="/login" component={() => <Login {...auth} />} />
        <Route exact path="/verify" component={() => <EmailVerify {...auth} />} />
        <Route exact path="/suppliers/:supplierId" component={SupplierStore} />
        <Route exact path="/suppliers/:supplierId/products/:itemId" component={ViewProduct} />
        {auth.authenticated
            ? <React.Fragment>
                <Route exact path="/orders" component={ClientOrders} />
                <Route exact path="/settings" component={Settings} />
                <Route exact path="/orders/:orderId" component={ViewOrder} />
                <Route exact path="/order-history" component={OrderHistory} />
                <Route exact path="/logout" component={() => <Logout {...auth} />} />
            </React.Fragment>
            : <React.Fragment>
                <Route exact path="/register" component={() => <RegisterClient {...auth} />} />
                <Route exact path="/register/supplier" component={() => <RegisterSupplier {...auth} />} />
            </React.Fragment>
        }
    </Switch>
);


const Container = styled.div`
    padding: 35px 190px;
    box-sizing: border-box;
    @media screen and (max-width: 768px) {
        padding: 35px 55px;
    }
    @media screen and (max-width: 500px) {
        padding: 20px 10px;
    }
    @media screen and (max-width: 1024px) {
        padding: 30px 30px;
    }
`;

const AppRouter = () => {

    const [showTopPanel, setShowTopPanel] = useState(window.innerWidth > 500);
    const { state } = useContext(StoreContext);

    const updateWindowSize = () => setShowTopPanel(window.innerWidth > 500);

    useEffect(() => {
        window.addEventListener('resize', updateWindowSize);
    }, [])

    return (
        <BrowserRouter>
            {!showTopPanel
                ? <Sidebar authenticated={state.authenticated} account_type={state.account_type} /> 
                : <TopPanel authenticated={state.authenticated} account_type={state.account_type} />
            }
            {(!state.has_payment_account && state.authenticated) &&
                <SetupAccountBanner account_type={state.account_type} />
            }
            <Container>
                {state.account_type === 'supplier'
                    ? <SupplierRouter authenticated={state.authenticated} />
                    : <LocationRouter authenticated={state.authenticated} />
                }
            </Container>
        </BrowserRouter>
    )
};

export default AppRouter;