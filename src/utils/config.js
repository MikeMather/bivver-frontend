
const config = {
    BASE_URL: process.env.REACT_APP_DOMAIN,
    ENV: 'local',
    TABLET_BREAK: 960,
    STRIPE_API_KEY: process.env.NODE_ENV === 'production' ? 'pk_live_kDlSeQ83oNFpI4m6zE1gYWMC' : 'pk_test_BJHlY3dKiWDpjGVihty1Zwm9',
    STRIPE_CLIENT_ID: process.env.NODE_ENV === 'production' ? 'ca_Ehf6IL9J9llQ9DmC4eM04M1PxLa7Sw2P' : 'ca_Ehf6RukQblf1Rg23P0cHAdmBYs7cDGny',
    STRIPE_DASHBOARD_URL: 'https://dashboard.stripe.com/dashboard',
    RECAPTCHA_SITE_KEY: '6Ley_bsUAAAAADR4CwVlp2UH6LcLjB5mX7eHFJwm',
    S3_IMAGE_BUCKET: 'https://bivver-public.s3.amazonaws.com/'
};

export default config;