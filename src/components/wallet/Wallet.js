import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import styled from 'styled-components'
import { Translate } from 'react-localize-redux'
import FormButton from '../common/FormButton'
import Container from '../common/styled/Container.css'
import NearWithBackgroundIcon from '../svg/NearWithBackgroundIcon'
import SendIcon from '../svg/SendIcon'
import DownArrowIcon from '../svg/DownArrowIcon'
import BuyIcon from '../svg/BuyIcon'
import Balance from '../common/Balance'
import { getTransactions, getTransactionStatus } from '../../actions/transactions'
import { Mixpanel } from "../../mixpanel/index"
import Activities from './Activities'
import ExploreApps from './ExploreApps'
import Tokens from './Tokens'
import LinkDropSuccessModal from './LinkDropSuccessModal'
import { selectTokensDetails } from '../../reducers/tokens'

import { handleGetTokens } from '../../actions/tokens'
import classNames from '../../utils/classNames'
import { actionsPendingByPrefix } from '../../utils/alerts'

const StyledContainer = styled(Container)`
    .sub-title {
        margin: -10px 0 0 0;
        font-size: 14px !important;
        color: #72727A !important;

        &.tokens {
            margin-top: 40px;
            margin-bottom: 15px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            width: 100%;
            max-width: unset;

            .dots {
                :after {
                    position: absolute;
                    content: '.';
                    animation: link 1s steps(5, end) infinite;
                
                    @keyframes link {
                        0%, 20% {
                            color: rgba(0,0,0,0);
                            text-shadow:
                                .3em 0 0 rgba(0,0,0,0),
                                .6em 0 0 rgba(0,0,0,0);
                        }
                        40% {
                            color: #24272a;
                            text-shadow:
                                .3em 0 0 rgba(0,0,0,0),
                                .6em 0 0 rgba(0,0,0,0);
                        }
                        60% {
                            text-shadow:
                                .3em 0 0 #24272a,
                                .6em 0 0 rgba(0,0,0,0);
                        }
                        80%, 100% {
                            text-shadow:
                                .3em 0 0 #24272a,
                                .6em 0 0 #24272a;
                        }
                    }
                }
            }
        }
    }

    .left {
        display: flex;
        flex-direction: column;
        align-items: center;

        @media (min-width: 992px) {
            border: 2px solid #F0F0F0;
            border-radius: 8px;
            padding: 30px 20px 20px 20px;
            height: max-content;
        }

        .buttons {
            display: flex;
            justify-content: center;
            align-items: center;
            margin: 30px 0;
            width: 100%;
    
            button {
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                width: auto;
                height: auto;
                background-color: transparent !important;
                border: 0;
                padding: 0;
                color: #3F4045;
                font-weight: 400;
                font-size: 14px;
                margin: 20px;
                border-radius: 0;

                :hover {
                    color: #3F4045;

                    > div {
                        background-color: #1f1f1f;
                    }
                }

                > div {
                    background-color: #111618;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    min-height: 56px;
                    height: 56px;
                    min-width: 56px;
                    width: 56px;
                    border-radius: 20px;
                    margin-bottom: 10px;
                }
                svg {
                    width: 22px !important;
                    height: 22px !important;
                    margin: 0 !important;

                    path {
                        stroke: white;
                    }
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
        font-weight: 900 !important;
        font-size: 22px !important;
        align-self: flex-start;
        margin: 50px 0 30px 0;
        text-align: left !important;
    }
`

export function Wallet() {
    const [exploreApps, setExploreApps] = useState(null);
    const [showLinkdropModal, setShowLinkdropModal] = useState(null);
    const { balance, accountId } = useSelector(({ account }) => account)
    const transactions = useSelector(({ transactions }) => transactions)
    const dispatch = useDispatch()
    const hideExploreApps = localStorage.getItem('hideExploreApps')
    const linkdropAmount = localStorage.getItem('linkdropAmount')
    const linkdropModal = linkdropAmount && showLinkdropModal !== false;
    const tokens = useSelector(state => selectTokensDetails(state))
    const tokensLoader = actionsPendingByPrefix('TOKENS/') || !balance?.total
    
    useEffect(() => {
        if (accountId) {
            let id = Mixpanel.get_distinct_id()
            Mixpanel.identify(id)
            Mixpanel.people.set({relogin_date: new Date().toString()})
            dispatch(getTransactions(accountId))
        }
    }, [accountId])

    const sortedTokens = Object.keys(tokens).map(key => tokens[key]).sort((a, b) => (a.symbol || '').localeCompare(b.symbol || ''));

    useEffect(() => {
        if (!accountId) {
            return
        }

        dispatch(handleGetTokens())
    }, [accountId]);

    const handleHideExploreApps = () => {
        localStorage.setItem('hideExploreApps', true)
        setExploreApps(false)
        Mixpanel.track("Click explore apps dismiss")
    }

    const handleCloseLinkdropModal = () => {
        localStorage.removeItem('linkdropAmount')
        setShowLinkdropModal(false)
        Mixpanel.track("Click dismiss NEAR drop success modal")
    }

    return (
        <StyledContainer>
            <div className='split'>
                <div className='left'>
                    <NearWithBackgroundIcon/>
                    <h1><Balance amount={balance?.total} symbol={false}/></h1>
                    <div className='sub-title'><Translate id='wallet.balanceTitle' /></div>
                    <div className='buttons'>
                        <FormButton
                            linkTo='/send-money'
                            trackingId='Click Send on Wallet page'
                        >
                            <div>
                                <SendIcon/>
                            </div>
                            <Translate id='button.send'/>
                        </FormButton>
                        <FormButton
                            linkTo='/receive-money'
                            trackingId='Click Receive on Wallet page'
                        >
                            <div>
                                <DownArrowIcon/>
                            </div>
                            <Translate id='button.receive'/>
                        </FormButton>
                        <FormButton
                            linkTo='/buy'
                            trackingId='Click Receive on Wallet page'
                        >
                            <div>
                                <BuyIcon/>
                            </div>
                            <Translate id='button.buy'/>
                        </FormButton>
                    </div>
                    <div className='sub-title tokens'>
                        <span className={classNames({ dots: tokensLoader })}><Translate id='wallet.tokens' /></span>
                        <span><Translate id='wallet.balance' /></span>
                    </div>
                    <Tokens tokens={sortedTokens} />
                </div>
                <div className='right'>
                    {!hideExploreApps && exploreApps !== false &&
                        <ExploreApps onClick={handleHideExploreApps}/>
                    }
                    <Activities 
                        transactions={transactions[accountId] || []}
                        accountId={accountId}
                        getTransactionStatus={getTransactionStatus}

                    />
                </div>
            </div>
            {linkdropModal &&
                <LinkDropSuccessModal
                    onClose={handleCloseLinkdropModal}
                    open={linkdropModal}
                    linkdropAmount={linkdropAmount}
                />
            }
        </StyledContainer>
    )
}
