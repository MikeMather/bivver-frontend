import React from 'react';
import { Result, Button } from 'antd';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const Container = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const NotFound = () => (
    <Container>
        <Result
            status="404"
            title="Not Found"
            subTitle="Sorry, the page you're looking for doesn't exist."
            extra={<Link to="/"><Button type="primary">Back Home</Button></Link>}
        />
    </Container>
);

export default NotFound;