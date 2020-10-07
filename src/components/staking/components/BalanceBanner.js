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

    svg {
        background-color: #ABF3D2;
        border-radius: 50%;
        padding: 10px;
        width: 40px;
        height: 40px;
    }

    > div {
        margin-left: 15px;
        padding-top: 4px;
        font-size: 13px;

        div {
            color: #24272a;
            font-family: BwSeidoRound;
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
            <LockIcon/>
            <div>
                <Translate id='staking.balanceBanner.title' />
                <div><Balance amount={amount} noSymbol={true} /> <span><Translate id='staking.balanceBanner.currency' /></span></div>
            </div>
        </Container>
    )
}