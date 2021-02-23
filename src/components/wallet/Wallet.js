import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import styled from 'styled-components'
import { Translate } from 'react-localize-redux'
import FormButton from '../common/FormButton'
import Container from '../common/styled/Container.css'
import NearWithBackgroundIcon from '../svg/NearWithBackgroundIcon'
import SendIcon from '../svg/SendIcon'
import DownArrowIcon from '../svg/DownArrowIcon'
import Balance from '../common/Balance'
import { getTransactions, getTransactionStatus } from '../../actions/transactions'
import { Mixpanel } from "../../mixpanel/index"
import Activities from './Activities'
// import Tokens from './Tokens'

const StyledContainer = styled(Container)`
    display: flex;
    flex-direction: column;
    align-items: center;

    .sub-title {
        margin: -10px 0 0 0;
        font-size: 14px !important;
        color: #72727A !important;

        &.tokens {
            margin-top: 40px;
            margin-bottom: 15px;
            align-self: flex-start;
        }
    }

    > .buttons {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 20px;
        width: 100%;

        button {
            display: flex;
            justify-content: center;
            align-items: center;
            flex: 1;
            svg {
                width: 22px !important;
                height: 22px !important;
                margin: 0 6px 0 0 !important;
            }
            :last-of-type {
                margin-left: 25px;
                @media (max-width: 767px) {
                    margin-left: 10px;
                }
            }
        }
    }

    button {
        &.gray-blue {
            width: 100% !important;
            margin-top: 35px !important;
        }
    }

    h2 {
        font-weight: 600 !important;
        font-size: 22px !important;
        align-self: flex-start;
        margin: 50px 0 30px 0;
    }
`

export function Wallet() {
    
    useEffect(() => {
        let id = Mixpanel.get_distinct_id()
        Mixpanel.identify(id)
        Mixpanel.people.set({relogin_date: new Date().toString()})

        dispatch(getTransactions(accountId))
    }, [])
    

    const { balance, accountId } = useSelector(({ account }) => account)
    const transactions = useSelector(({ transactions }) => transactions)
    const dispatch = useDispatch()

    // const exampleTokens = [
    //     {
    //         name: 'Banana',
    //         symbol: '🍌',
    //         contract: 'berryclub.ek.near',
    //         balance: '500'
    //     },
    //     {
    //         name: 'Avocado',
    //         symbol: '🥑',
    //         contract: 'farm.berryclub.ek.near',
    //         balance: '1000'
    //     }
    // ]

    return (
        <StyledContainer className='small-centered'>
            <NearWithBackgroundIcon/>
            <h1><Balance amount={balance.total} symbol='near'/></h1>
            <div className='sub-title'><Translate id='wallet.balanceTitle' /></div>
            <div className='buttons'>
                <FormButton
                    color='green-pastel'
                    linkTo='/send-money'
                    trackingId='Click Send on Wallet page'
                >
                    <SendIcon/>
                    <Translate id='button.send'/>
                </FormButton>
                <FormButton
                    color='green-pastel'
                    linkTo='/receive-money'
                    trackingId='Click Receive on Wallet page'
                >
                    <DownArrowIcon/>
                    <Translate id='button.receive'/>
                </FormButton>
            </div>
            {/* <div className='sub-title tokens'><Translate id='wallet.tokens' /></div> */}
            {/* <Tokens tokens={exampleTokens}/> */}
            <Activities 
                transactions={transactions[accountId] || []}
                accountId={accountId}
                getTransactionStatus={getTransactionStatus}

            />
        </StyledContainer>
    )
}
