import React from 'react';
import Header from './Header';


const ClientHeader = ({ Breadcrumbs, ...props }) => (
    <Header
        breadcrumbs={Breadcrumbs}
        {...props}
    />
);


export default ClientHeader;
