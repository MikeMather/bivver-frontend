import ModelRequest from './requests';
import config from './config';

//Backend models and their respective url 
const urls = {
    auth                   : 'auth/token/',
    refreshAuth            : 'auth/refresh/',
    items                  : 'item/items/',
    products               : 'item/browse/',
    user                   : 'user/user/',
    register               : 'user/register/',
    emailVerify            : 'user/verify/',
    supplierSearch         : 'supplier/search/',
    orders                 : 'order/orders/',
    lineItems              : 'order/line-items/',
    taxRates               : 'order/tax-rates/',
    signatures             : 'order/signatures/',
    settings               : 'user/settings/',
    paymentAccountTokens   : 'user/payment-token/',
    paymentAccounts        : 'user/payment-account/',
    orderActivities        : 'order/order-activities/',
    markActivitiesSeen     : 'order/activities-seen/',
    payments               : 'order/payments/'
};

let api = {};

for (const model in urls) {
    if (urls.hasOwnProperty(model)) {
        api[model] = new ModelRequest(urls[model]);
    }
}

export default api;