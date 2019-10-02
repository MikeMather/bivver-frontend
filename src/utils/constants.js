import React from 'react';


export const PHONE_LARGE = 555;
export const PHONE = 425;
export const TABLET = 960;
export const MONITOR = 1024;
export const MONITOR_LARGE = 1441;

export const SHORTHAND_MEASURES = {
    'unit': 'unit',
    'litre': 'L',
    'millilitre': 'mL',
    'ounce(fl)': 'oz(fl)',
    'ounce': 'oz'
};


export const KEG_SIZES = [
    '20.0',
    '30.0',
    '50.0',
    '58.6'
];

export const COUNT_BYS = [
    'Case',
    'Keg',
    'Bottle',
    'Unit',
];

//Constants to simplify url params
export const URL_PARAM_TRUE = 2;
export const URL_PARAM_FALSE = 3;

export const SUPPLIER_TAG_COLOURS = {
    brewery: 'orange',
    winery: 'magenta',
    distillery: 'purple'
};

export const ORDER_STATES = {
    all: [
        'draft',
        'pending_supplier_approval',
        'pending_client_approval',
        'declined',
        'paid',
        'pending_payment',
        'delivered_pending_payment',
        'delivered_paid'
    ],
    client: {
        'draft': {
            tagColor: 'blue',
            description: '',
            title: 'Draft'
        },
        'pending_supplier_approval': {
            tagColor: 'purple',
            description: '',
            title: 'Pending approval'
        },
        'pending_client_approval': {
            tagColor: 'orange',
            description: 'Changes requested by supplier',
            title: 'Revision Requested'
        },
        'pending_payment': {
            tagColor: 'purple',
            description: 'Payment required',
            title: 'Pending delivery'
        },
        'paid': {
            tagColor: 'purple',
            description: 'Paid',
            title: 'Pending delivery'
        },
        'delivered_paid': {
            tagColor: 'green',
            description: 'Paid',
            title: 'Delivered'
        },
        'delivered_pending_payment': {
            tagColor: 'green',
            description: 'Payment required',
            title: 'Delivered'
        },
        'declined': {
            tagColor: 'red',
            description: '',
            title: 'Declined'
        },
    },

    supplier: {
        'pending_supplier_approval': {
            tagColor: 'blue',
            description: '',
            title: 'New'
        },
        'pending_payment': {
            tagColor: 'purple',
            description: 'Payment deferred',
            title: 'Pending delivery'
        },
        'paid': {
            tagColor: 'purple',
            description: 'Paid',
            title: 'Pending delivery'
        },
        'pending_client_approval': {
            tagColor: 'orange',
            description: '',
            title: 'Pending client revisions'
        },
        'delivered_paid': {
            tagColor: 'green',
            description: 'Paid',
            title: 'Delivered'
        },
        'delivered_pending_payment': {
            tagColor: 'green',
            description: 'Payment required',
            title: 'Delivered'
        },
        'declined': {
            tagColor: 'red',
            description: 'Permanently declined',
            title: 'Declined'
        },
    },
    pending_payment_states: [
        'pending_payment',
        'delivered_pending_payment'
    ],
    pending_delivery_states: [
        'paid',
        'pending_payment'
    ],
    paid_states: [
        'paid',
        'delivered_paid'
    ],
    client_editing_states: [
        'draft',
        'pending_client_approval'
    ],
    delivered_states: [
        'delivered_paid',
        'delivered_pending_payment'
    ],
    outstanding_states: [
        'delivered_pending_payment',
        'pending_payment'
    ]
};

export const PAYMENT_TERMS = [
    {text: 'Cannot defer', days: 0},
    {text: '30 days', days: 30},
    {text: '60 days', days: 60},
    {text: '90 days', days: 90}
];
