import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import * as Sentry from '@sentry/browser'
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
import { ACCOUNT_HELPER_URL, wallet } from '../../utils/wallet'
import LinkDropSuccessModal from './LinkDropSuccessModal'

import sendJson from 'fetch-send-json'

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
    
    useEffect(() => {
        if (accountId) {
            let id = Mixpanel.get_distinct_id()
            Mixpanel.identify(id)
            Mixpanel.people.set({relogin_date: new Date().toString()})
            dispatch(getTransactions(accountId))
        }
    }, [accountId])

    const logError = (error) => {
        console.warn(error);
        Sentry.captureException()
    };

    // TODO: Refactor loading token balances using Redux
    const cachedTokensKey = `cachedTokens:${accountId}`;
    const cachedTokens = (() => {
        try {
            return JSON.parse(localStorage.getItem(cachedTokensKey));
        } catch(e) {
            logError(e);
            return {};
        }
    })();

    const whitelistedContracts = (process.env.TOKEN_CONTRACTS || 'berryclub.ek.near,farm.berryclub.ek.near,wrap.near').split(',');
    const [tokens, setTokens] = useState(cachedTokens || {});

    const sortedTokens = Object.keys(tokens).map(key => tokens[key]).sort((a, b) => (a.symbol || '') .localeCompare(b.symbol || ''));

    useEffect(() => {
        sendJson('GET', `${ACCOUNT_HELPER_URL}/account/${accountId}/likelyTokens`).then(likelyContracts => {
            const contracts = [...new Set([...likelyContracts, ...whitelistedContracts])];
            let loadedTokens = contracts.map(contract => ({
                [contract]: { contract, ...tokens[contract] }
            }));
            loadedTokens = loadedTokens.reduce((a, b) => Object.assign(a, b), {});

            setTokens(loadedTokens);
            wallet.getAccount(accountId).then(account =>
                // NOTE: This forEach parallelizes requests on purpose
                contracts.forEach(async contract => {
                    try {
                        // TODO: Parallelize balance and metadata calls, use cached metadata?
                        let { name, symbol, decimals, icon } = await account.viewFunction(contract, 'ft_metadata')
                        const balance = await account.viewFunction(contract, 'ft_balance_of', { account_id: accountId })
                        loadedTokens = {
                            ...loadedTokens,
                            [contract]: { contract, balance, name, symbol, decimals, icon }
                        }
                    } catch (e) {
                        if (e.message.includes('FunctionCallError(MethodResolveError(MethodNotFound))')) {
                            loadedTokens = {...loadedTokens};
                            delete loadedTokens[contract];
                            return;
                        }
                        logError(e);
                    } finally {
                        setTokens(loadedTokens);
                        localStorage.setItem(cachedTokensKey, JSON.stringify(loadedTokens));
                    }
                })
            ).catch(logError);
        }).catch(logError);
    }, []);

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
                    {sortedTokens?.length ?
                        <>
                            <div className='sub-title tokens'>
                                <span><Translate id='wallet.tokens' /></span>
                                <span><Translate id='wallet.balance' /></span>
                            </div>
                            <Tokens tokens={sortedTokens} />
                        </>
                        : undefined
                    }
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
