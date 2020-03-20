import React from 'react'

import { Image, List } from 'semantic-ui-react'

import NearLogoImage from '../../images/near_logo.svg'

import styled from 'styled-components'

const CustomList = styled(List)`
    background: #f8f8f8;
    width: 360px;
    float: right;

    img {
        width: 160px;
    }

    .text {
        margin: 0 16px 16px 64px;
        line-height: 20px !important;
        color: #24272a;
    }

    @media screen and (max-width: 767px) {
        &&& {
            margin-top: 14px;
            float: left;
            width: 100%;
        }
    }
`

const NearInfo = () => (
    <CustomList className='box'>
        <List.Item>
            <Image src={NearLogoImage} />
        </List.Item>
        <List.Item className='text'>
            NEAR is a scalable computing and storage platform that changes how the web works for the better.
            <a href='https://nearprotocol.com/'>Learn More</a>
        </List.Item>
    </CustomList>
)

export default NearInfo
