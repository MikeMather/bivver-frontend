import React from 'react';
import { Typography, Tag, Icon, Breadcrumb } from 'antd';
import styled from 'styled-components';
import { S3Image, capitalize } from '../../utils/utils';
import { SUPPLIER_TAG_COLOURS } from '../../utils/constants';
import { Link } from 'react-router-dom';

export const StyledBanner = styled.div`
    width: 100%;
    padding: 20px 0;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    position: relative;
    flex-wrap: wrap;

    h1 {
        font-family: 'Crimson Text', serif;
        letter-spacing: 2px;
        margin-bottom: 5px;
    }

    img {
        margin-right: 20px;
    }

    .info-container {
        margin-top: 10px;
    }

    p {
        margin: 3px 0 0 2px;
    }
`;

const StoreBanner = ({ name, supplier_type, image, contact_email, address, city, region, Breadcrumbs=null }) => (
    <div>
        {Breadcrumbs
            ? <Breadcrumbs />
            : <Breadcrumb>
                <Breadcrumb.Item>
                    <Link to={`/?${region}`}>Suppliers</Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item>{name}</Breadcrumb.Item>
            </Breadcrumb>
        }
        <StyledBanner>
            <img
                src={S3Image(image)}
                width="200"
                height="200"
                alt={name}
            />
            <div>
                <Typography.Title>{name}</Typography.Title>
                {supplier_type && <Tag color={SUPPLIER_TAG_COLOURS[supplier_type]}>{capitalize(supplier_type || '')}</Tag>}
                <div className="info-container">
                    <p><Icon type="mail" /> {contact_email}</p>
                    <p><Icon type="home" /> {address}, {city}, {region}</p>
                </div>
            </div>
        </StyledBanner>
    </div>
);

export default StoreBanner;
