import types from './types';
import api from '../utils/api';


export const useActions = (state, dispatch) => {

    const fetchAppState = () => {
        return api.user.getAll()
            .then(user => {
                dispatch({ 
                    type: types.SET_APP_STATE, 
                    payload: {
                        ...user,
                        authenticated: true
                    } 
                });
            })
            .catch(err => console.log(err));
    }

    const clearAppState = () => {
        return dispatch({ 
            type: types.CLEAR_APP_STATE
        });
    }

    return {
        fetchAppState,
        clearAppState
    };
}