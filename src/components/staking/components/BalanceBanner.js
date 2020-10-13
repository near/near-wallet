import React from 'react'
import { Translate } from 'react-localize-redux'
import styled from 'styled-components'
import LockIcon from '../../svg/LockIcon.js'
import Balance from '../../common/Balance'

const Container = styled.div`
    background-color: #CEFDE6;
    color: #008D6A;
    display: flex;
    align-items: center;
    padding: 15px;
    border-radius: 4px;

    .icon-background {
        background-color: #ABF3D2;
        border-radius: 50%;
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        padding-bottom: 2px;

        svg {
            width: 18px;
            height: 19px;
        }
    }

    .content {
        margin-left: 15px;
        padding-top: 4px;
        font-size: 13px;

        div {
            color: #24272a;
            margin-top: 4px;
            font-size: 18px;
            font-weight: 500;

            span {
                font-size: 14px;
                font-weight: 400;
            }
        }
    }

`

export default function BalanceBanner({ amount }) {
    
    return (
        <Container className='balance-banner'>
            <div className='icon-background'>
                <LockIcon/>
            </div>
            <div className='content'>
                <Translate id='staking.balanceBanner.title' />
                <div><Balance amount={amount} noSymbol={true} /> <span><Translate id='staking.balanceBanner.currency' /></span></div>
            </div>
        </Container>
    )
}