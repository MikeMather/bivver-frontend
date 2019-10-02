import React from 'react';
import styled from 'styled-components';
import { Typography, Card } from 'antd';


const Banner = styled.div`
    width: 100%;
    min-height: 300px;
    margin-bottom: 30px;
    border: 1px solid #e8e8e8;
    display: flex;
    padding: 30px 18px;
    box-sizing: border-box;

    h1 {
        font-family: 'Crimson Text', serif;
        margin-top: 40px;
        margin-bottom: 10px;
    }

    p {
        color: #9E9E9E;
        max-width: 500px;
        font-size: 18px;
        margin: 0;
    }

    @media screen and (max-width: 450px) {
        padding: 5px;
        > {
            width: 100%;
        }
        h1 {
            margin-top: 0;
        }
    }

    @media screen and (max-width: 768px) {
        justify-content: center;
        align-items: center;
        flex-wrap: wrap;
        img:last-of-type {
            display: none;
        }
    }
`;

const RegisterBanner = () => (
    <Banner>
        <img 
            src="/images/beer.svg"
            width="200"
            height="300"
            style={{marginRight: 40}}
        />
        <div style={{flexBasis: '60%'}}>
            <Typography.Title>The B2B Alcohol Marketplace</Typography.Title>
            <p>
                We're all about helping you improve operations.
                Track your orders online, find new clients and optimize your production.
            </p>
        </div>
        <img 
            src="/images/macbook.png"
            width="250"
            height="300"
        />
    </Banner>
);

export default RegisterBanner;