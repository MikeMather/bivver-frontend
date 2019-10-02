import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Typography, Select, Icon, Button } from 'antd';
import { CountryRegionData } from 'react-country-region-selector';

const StyledBanner = styled.div`
    width: 100%;
    border-radius: 3px;
    position: relative;
    border: 1px solid #9E9E9E
    background-image: url('/images/background.png');
    padding: 50px 0;
    box-sizing: border-box;
    text-align: center;
    margin-bottom: 15px;

    h1 {
        font-family: 'Crimson Text', serif;
        letter-spacing: 2px;
        color: #F7F7F7;
    }

    p {
        color: #F7F7F7;
        font-size: 18px;
    }
`;

const Banner = ({ handleSelectRegion, region }) => {
    // Why tf do they store the data like this?
    const [provinces, setProvinces] = useState([]);

    useEffect(() => {
        setProvinces(CountryRegionData[39][2].replace(/~\w{2}/g, '').split('|'));
    }, [CountryRegionData])

    return (
        <StyledBanner>
            <Typography.Title>Explore your local craft product suppliers</Typography.Title>
            <span style={{display: 'flex', justifyContent: 'center', alignItems: 'baseline', flexWrap: 'wrap'}}>
                <p>I'm looking for suppliers in </p>
                <Select 
                    style={{width: 230, marginLeft: 20}} 
                    placeholder="Select your location"
                    onChange={handleSelectRegion}
                    value={region}
                >
                    {provinces.map(p => <Select.Option key={p} value={p}>{p}</Select.Option>)}
                </Select>
                {region &&
                    <Button type="link" onClick={() => handleSelectRegion(null)}><Icon type="close-circle" style={{color: 'white'}}/></Button>
                }
            </span>
        </StyledBanner>
    );
};

export default Banner;