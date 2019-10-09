import React from 'react';
import { Typography, Icon } from 'antd';
import styled from 'styled-components';
import Image from '../common/Image';


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
        margin-left: 20px;
    }

    .info-container p:first-of-type {
        margin-top: 10px;
    }

    .extra {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        flex-basis: 50%
    }

    .info-container > * {
        margin-left: 20px;
    }

    p {
        margin: 3px 0 0 2px;
    }

    @media screen and (max-width: 768px) {
        .extra {
            flex-basis: 100%;
        }        
    }
`;

const Header = ({ name, image, contact_email, address, city, region, Label, Breadcrumbs, Extra }) => (
    <div>
        {Breadcrumbs &&
            <Breadcrumbs />
        }
        <StyledBanner>
            <Image
                src={image}
                width="200px"
                height="200px"
            />
            <div class="info-container">
                <Typography.Title>{name}</Typography.Title>
                {Label && <Label />}
                <p><Icon type="mail" /> {contact_email}</p>
                <p><Icon type="home" /> {address}, {city}, {region}</p>
            </div>
            <div className="extra">
                {Extra && <Extra />}
            </div>
        </StyledBanner>
    </div>
);

export default Header;
