import React, { useState, useEffect } from 'react'
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
import ExploreApps from './ExploreApps'
import Tokens from './Tokens'
import { wallet } from '../../utils/wallet'
import { formatTokenAmount } from '../../utils/amounts'

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
            justify-content: space-between;
            align-items: center;
            margin: 30px 0;
            width: 100%;
    
            button {
                display: flex;
                justify-content: center;
                align-items: center;
                flex: 1;
                width: auto;
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
    
    useEffect(() => {
        let id = Mixpanel.get_distinct_id()
        Mixpanel.identify(id)
        Mixpanel.people.set({relogin_date: new Date().toString()})
        dispatch(getTransactions(accountId))
    }, [])

    // TODO: Refactor loading token balances using Redux
    // TODO: Load potential token contract list from contract helper
    const contracts = (process.env.TOKEN_CONTRACTS || 'berryclub.ek.near,farm.berryclub.ek.near,wrap.near').split(',');
    const [tokens, setTokens] = useState(contracts.map(contract => ({ contract })));

    useEffect(() => {
        const loadedTokens = tokens;
        wallet.getAccount(accountId).then(account =>
            contracts.forEach(async contractId => {
                let { name, symbol, decimals } = await account.viewFunction(contractId, 'ft_metadata')
                const balance = formatTokenAmount(
                    await account.viewFunction(contractId, 'ft_balance_of', { account_id: accountId }), decimals);
                const tokenIndex = contracts.findIndex(c => c === contractId);
                loadedTokens[tokenIndex] = { ...loadedTokens[tokenIndex], balance, name, symbol }
                setTokens(loadedTokens);
            }));
        
    }, []);

    const handleHideExploreApps = () => {
        localStorage.setItem('hideExploreApps', true)
        setExploreApps(false)
        Mixpanel.track("Click explore apps dismiss")
    }
    
    const [exploreApps, setExploreApps] = useState(null);
    const { balance, accountId } = useSelector(({ account }) => account)
    const transactions = useSelector(({ transactions }) => transactions)
    const dispatch = useDispatch()
    const hideExploreApps = localStorage.getItem('hideExploreApps')

    return (
        <StyledContainer>
            <div className='split'>
                <div className='left'>
                    <NearWithBackgroundIcon/>
                    <h1><Balance amount={balance.total} symbol={false}/></h1>
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
                    <div className='sub-title tokens'>
                        <span><Translate id='wallet.tokens' /></span>
                        <span><Translate id='wallet.balance' /></span>
                    </div>
                    <Tokens tokens={tokens}/>
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
        </StyledContainer>
    )
}
