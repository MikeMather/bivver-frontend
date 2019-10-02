import React, { useState, useEffect, useContext } from 'react';
import api from '../../utils/api';
import queryString from 'query-string';
import { Link } from 'react-router-dom';
import { Result, Spin, Button } from 'antd';
import { StoreContext } from '../../context/store';

const StripeConnect = ({ location }) => {

    const params = queryString.parse(location.search);
    const { actions } = useContext(StoreContext);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState();

    useEffect(() => {
        api.paymentAccounts.create({
            code: params.code,
            token: params.state
        })
        .catch(err => setError(err.message))
        .then(res => {
            actions.fetchAppState().then(() => {
                setLoading(false);
            })
        });
    }, []);
    
    return (
        <Spin spinning={loading} style={{width: '100%', height: '100%'}}>
            {!loading &&
                (error
                    ? <Result
                        status="500"
                        title={error}
                        subTitle="There was a problem creating your payment account"
                        extra={<Link to={'/settings'}><Button type="primary">Back to settings</Button></Link>}
                    />
                    : <Result
                        title="You're ready to accept payments!"
                        subTitle="Your customers can now pay for orders using their credit cards"
                        icon={<img src="/images/stripeSuccess.svg" width="500" />}
                    />
                )
            }
        </Spin>
    )
};

export default StripeConnect;