import React from 'react';
import { Typography, Row, Col, Empty, Divider } from 'antd';
import uuid from 'uuidv4';
import styled from 'styled-components';

const colLayout = {
    xs: 24,
    sm: 12,
    lg: 6,
}

const StyledItemLayout = styled.div`
    display: flex;
    align-items: center;
    justify-content: flex-start;
    flex-wrap: wrap;
    width: 100%;

    .list-item {
        margin: 10px; 10px;
    }

    .list-item:first-of-type {
        margin-left: 0;
    }

    @media screen and (max-width: 450px) {
        justify-content: center;
    }
`;

const ItemList = ({ children, title }) => (
    <div style={{marginBottom: 30}}>
        <Typography.Title level={3}>{title}</Typography.Title>
        <StyledItemLayout>
            {children.length
                ? children.map(child => (
                    <div className="list-item">
                        {child}
                    </div>
                ))
                : <Empty
                    style={{padding: 100}}
                    description={
                        <Typography.Text>We couldn't find anything that matches your search criteria</Typography.Text>
                    }
                    image="/images/empty.svg"
                />
            }
        </StyledItemLayout>
        <Divider />
    </div>
);

export default ItemList;