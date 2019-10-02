import React from 'react';
import { S3Image } from '../../utils/utils';
import styled from 'styled-components';


const Image = styled.div`
    width: ${props => props.width || '100%'}
    height: ${props => props.height || '100%'}
    background-image: url('${props => props.presigned ? props.src : S3Image(props.src)}');
    background-size: contain;
    background-position: center;
    background-repeat: no-repeat;
`;

export default Image;