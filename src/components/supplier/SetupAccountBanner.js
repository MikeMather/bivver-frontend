import React from 'react';
import { Alert } from 'antd';
import { Link } from 'react-router-dom';

const Message = () => (
    <React.Fragment>
        Thanks for using Bivver! To help make it easier for your customers to order your products, 
        you'll need to provide us with some additional details. <Link to={'/settings'}>Click here</Link> to finish
        setting up your account.
    </React.Fragment>
);

const SetupAccountBanner = () => (
    process.env.REACT_APP_TYPE === 'supplier' && 
    <Alert message={<Message />} banner closable />
);

export default SetupAccountBanner;