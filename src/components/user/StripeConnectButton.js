import React, { useEffect, useState } from 'react';
import api from '../../utils/api';
import config from '../../utils/config';
import { Icon } from 'antd';
import styled from 'styled-components';


const StripeConnect = ({ id, token, className }) => (
    <a
        className={className}
        href={`https://connect.stripe.com/oauth/authorize?response_type=code&client_id=${id}&scope=read_write&state=${token}`}
    />
);

const StripeButton = styled(StripeConnect)`
    background-image: url('/images/stripe.png');
    background-position: center;
    background-repeat: no-repeat;
    width: 200px;
    height: 80px;
`;

const StripeConnectButton = ({ user }) => {

    const [token, setToken] = useState();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        if (!user.has_payment_account) {
            api.paymentAccountTokens.getOne(user.id)
                .then(res => setToken(res.token))
                .finally(() => setLoading(false));
        }
        else {
            setLoading(false);
        }
    }, [])

    return (
        loading
        ? <Icon type="loading" />
        : (token
            ? <StripeButton id={config.STRIPE_CLIENT_ID} token={token} />
            : <span>You're connected. <a href={config.STRIPE_DASHBOARD_URL}>View details in Stripe</a></span>
        )
    );
};

export default StripeConnectButton;