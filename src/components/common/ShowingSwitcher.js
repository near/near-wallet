import React from 'react'
import { Button, List } from 'semantic-ui-react'
import styled from 'styled-components'

const ShowingSwitcherList = styled(List)`
    padding: 0px;

    .showing {
        padding-left: 0px;
        padding-right: 0px;
    }

    && .switcher {
        padding-left: 0px;
        padding-right: 20px;
        border-right: 1px solid #e6e6e6;
    }

    .button-radio {
        height: 36px;
        border: 2px solid #e6e6e6;
        border-radius: 20px;
        background: #f8f8f8;
        line-height: 36px;
        font-weight: 600;

        padding-top: 0px;
        padding-left: 0px;
        padding-right: 0px;
        display: flex;

        &:hover {
            background: #e6e6e6;
        }

        .on {
            border: 2px solid #e6e6e6;
            border-radius: 20px;
            background: #fff;
            padding: 0px;
        }
        .off {
            border: 0px solid #e6e6e6;
            margin-top: 0px;
            border-radius: 20px;
            padding: 0px;
            color: #0072ce;
        }
        .left {
            width: 70px;
            height: 36px;
            float: left;
        }
        .right {
            width: 70px;
            height: 36px;
            float: right;
        }
        .right.on {
            border-right: 0px;
        }
        & > div {
            margin: -2px 0 0 -2px;
        }
    }
`

const ShowingSwitcher = ({ buttonRadioClick, buttonRadio }) => (
    <ShowingSwitcherList horizontal>
        <List.Item as='h6' className='showing'>
            SHOWING
        </List.Item>
        <List.Item className='switcher'>
            <Button className='button-radio' onClick={buttonRadioClick}>
                <div className={`left ${!buttonRadio ? 'on' : 'off'}`}>ALL</div>
                <div className={`right ${buttonRadio ? 'on' : 'off'}`}>MINE</div>
            </Button>
        </List.Item>
    </ShowingSwitcherList>
)

export default ShowingSwitcher
