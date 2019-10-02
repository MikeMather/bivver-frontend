import React from 'react';
import styled from 'styled-components';
import { Typography } from 'antd';

const LoaderWrapper = styled.div`
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;

const FullLoader = () => (
    <LoaderWrapper>
        <img
            height="300"
            width="300"
            src="/images/logoWithName.png"
        />
        <Typography.Title>Loading...</Typography.Title>
    </LoaderWrapper>
);

export default FullLoader;