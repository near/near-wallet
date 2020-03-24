import React from 'react'

import { List, Image } from 'semantic-ui-react'

import CloseImage from '../../images/icon-close.svg'

import styled from 'styled-components'

const CustomList = styled(List)`
    &&& {
        background: #fff;
        width: 100%;
        padding: 20px;
        margin: 12px 0 12px 0;

        .img {
            width: 20px;
            position: absolute;
            top: 20px;
            right: 20px;

            img {
                cursor: pointer;
            }
        }

        .text {
            margin: 0 10% 0 0;
            color: #24272a;
            float: left;

            .header {
                font-family: 'benton-sans', sans-serif;
            }
            .content {
                color: #999999;
                padding-top: 12px;
                line-height: 20px;
            }
        }

        @media screen and (max-width: 767px) {
        }
    }
`

const DashboardNotice = ({ handleNotice }) => (
    <CustomList horizontal className='box'>
        <List.Item className='text'>
            <List.Header>Here’s a Notice of some sort</List.Header>
            <List.Content>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce nec
                ex non augue volutpat finibus. Suspendisse fringilla consequat magna
                a finibus.{` `}
                <a href='/'>Call to Action</a>
            </List.Content>
        </List.Item>
        <List.Item className='img'>
            <Image onClick={handleNotice} src={CloseImage} />
        </List.Item>
    </CustomList>
)

export default DashboardNotice
