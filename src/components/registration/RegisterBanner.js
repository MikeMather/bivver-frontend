import React from 'react';
import styled from 'styled-components';
import { Typography, Card } from 'antd';
import ReactPlayer from 'react-player';

const Banner = styled.div`
    width: 100%;
    min-height: 300px;
    margin-bottom: 30px;
    display: flex;
    justify-content: center;
`;

const RegisterBanner = ({ supplier }) => (
    <Banner>
        <ReactPlayer
            url="https://youtu.be/0ek3DW8BEw4"
            playing={false}
            width="60%"
            controls
        />
    </Banner>
);

export default RegisterBanner;