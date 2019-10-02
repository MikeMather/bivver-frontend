import { CONVERSIONS } from './constants'; 

export const converter = (amount, fromMeasure, toMeasure) => {
    if (fromMeasure != '' && toMeasure != '' && CONVERSIONS[fromMeasure]['base'] == CONVERSIONS[toMeasure]['base']) {
        let baseAmount = amount * CONVERSIONS[fromMeasure]['conversion'];
        let convertedAmount = baseAmount / CONVERSIONS[toMeasure]['conversion'];
        return convertedAmount;
    }
    else {
        throw `Cannot covert ${fromMeasure} to ${toMeasure}`; 
    }
};