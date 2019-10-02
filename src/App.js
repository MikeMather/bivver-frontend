import React, { useState, useEffect, useContext } from 'react';
import api from './utils/api';
import moment from 'moment'
import { StoreContext } from './context/store';
import FullLoader from './components/core/FullLoader';
import AppRouter from './routers/AppRouter';


function App() {

    const { actions } = useContext(StoreContext);
    const [loading, setLoading] = useState(false);

    const authenticate = () => {
        const auth = {
            refresh: localStorage.getItem('refresh'),
            access: localStorage.getItem('access'),
            refreshExpiry: localStorage.getItem('refreshExpiry'),
            accessExpiry: localStorage.getItem('accessExpiry'),
        };
        if (auth.refresh) {
            setLoading(true);
            if (moment().isSameOrAfter(moment(auth.accessExpiry))) {
                api.refreshAuth.create({refresh: auth.refresh})
                    .then(({ access }) => {
                        localStorage.setItem('access', access);
                        localStorage.setItem('refresh', auth.refresh);
                        localStorage.setItem('refreshExpiry', moment().add(14, 'days').format('LLL'));
                        localStorage.setItem('accessExpiry', moment().add(1, 'days').format('LLL'));
                        actions.fetchAppState().then(() => setLoading(false));
                    });
            }
            else {
                actions.fetchAppState().then(() => setLoading(false));
            }
        }
    }

    useEffect(() => {
        authenticate();
    }, [])

    return (
        <div id="app">
            <AppRouter />
        </div>
    );
}

export default App;
