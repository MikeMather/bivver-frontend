import React, { useContext, useEffect } from 'react';
import { StoreContext } from '../../context/store';
import { Redirect } from 'react-router-dom';

const Logout = () => {
    const { actions } = useContext(StoreContext);

    useEffect(() => {
        actions.clearAppState();
        localStorage.removeItem('access');
        localStorage.removeItem('refresh');
        localStorage.removeItem('accessExpiry');
        localStorage.removeItem('refreshExpiry');
    }, [])
    
    return (
        <Redirect to="/login" />
    )
}

export default Logout;