import moment from 'moment';

export const updateAuthCredentials = tokens => {
    localStorage.setItem('access', tokens.access);
    localStorage.setItem('refresh', tokens.refresh);
    localStorage.setItem('accessExpiry', moment().add(1, 'days'));
    localStorage.setItem('refreshExpiry', moment().add(14, 'days'));
};