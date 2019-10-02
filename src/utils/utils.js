import config from './config';
import moment from 'moment';
import { SHORTHAND_MEASURES } from './constants';

export const capitalize = text => {
    return text.charAt(0).toUpperCase() + text.slice(1);
};

export const currencyFormat = moneyString => {
    return (parseFloat(moneyString)).toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2
      });
};

export const S3Image = key => `${config.S3_IMAGE_BUCKET}${key}`;

export const getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
}

export const getItemDescription = (orderBy, measure, amount_per_unit, quantity) => {
    const amount = parseFloat(amount_per_unit) % 1 === 0 ? parseFloat(amount_per_unit) : parseFloat(amount_per_unit).toFixed(2);
    if (orderBy === 'Case') {
        return `${quantity} pack, ${amount}${SHORTHAND_MEASURES[measure]} per bottle`;
    }
    else if (orderBy === 'Keg') {
        return `${amount}${SHORTHAND_MEASURES[measure]} keg`;
    }
    else {
        return `${amount}${SHORTHAND_MEASURES[measure]} bottle`;
    }
};