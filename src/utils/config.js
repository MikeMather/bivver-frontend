const getBaseUrl = () => {
    const env = process.env.NODE_ENV;
    switch (env) {
        case 'local':
            return 'http://127.0.0.1:3000/';
        case 'development':
            return 'http://127.0.0.1:3000/';
        case 'staging':
            return 'http://127.0.0.1:3000/';
        default:
            return 'http://127.0.0.1:3000/';
    }
};


const config = {
    BASE_URL: getBaseUrl(),
    ENV: 'local',
    TABLET_BREAK: 960,
    STRIPE_API_KEY: process.env.NODE_ENV === 'production' ? 'pk_live_kDlSeQ83oNFpI4m6zE1gYWMC' : 'pk_test_BJHlY3dKiWDpjGVihty1Zwm9',
    STRIPE_CLIENT_ID: process.env.NODE_ENV === 'production' ? 'ca_Ehf6IL9J9llQ9DmC4eM04M1PxLa7Sw2P' : 'ca_Ehf6RukQblf1Rg23P0cHAdmBYs7cDGny',
    STRIPE_DASHBOARD_URL: 'https://dashboard.stripe.com/dashboard',
    RECAPTCHA_SITE_KEY: '6LdU7qYUAAAAAGQbwfzdgNrrmxKJp-eNA-MM4jIO',
    S3_IMAGE_BUCKET: 'https://s3.ca-central-1.amazonaws.com/vinocount-images/'
};

export default config;