import React, { Component } from 'react'
import styled from 'styled-components'
import { formatNearAmount } from 'near-api-js/lib/utils/format'
import BN from 'bn.js'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { Translate } from 'react-localize-redux'
import Container from '../../common/styled/Container.css'
import FormButton from '../../common/FormButton'
import WhereToBuyNearModal from '../../common/WhereToBuyNearModal'
import { redirectTo, clearFundedAccountNeedsDeposit, getBalance, getAccountHelperWalletState } from '../../../actions/account'
import { Mixpanel } from '../../../mixpanel'
import { isMoonpayAvailable, getSignedUrl } from '../../../utils/moonpay'
import AccountNeedsFunding from './status/AccountNeedsFunding'
import AccountFunded from './status/AccountFunded'
import Divider from '../../common/Divider'
import FundWithMoonpay from './FundWithMoonpay'
import { removeAccountIsInactive } from '../../../utils/localStorage'

const StyledContainer = styled(Container)`

    h2 {
        b {
            color: #3F4045;
        }
    }
    button {
        margin: 0 auto !important;
        width: 100% !important;

        &.where-to-buy-link {
            text-decoration: none !important;
            font-weight: 400 !important;
            font-size: 16px !important;
            width: auto !important;
            text-align: left;
            margin-bottom: 50px !important;
            transition: 100ms;

            :hover {
                text-decoration: underline !important;
            }
        }

        &.black {
            height: 54px !important;
            width: 100% !important;
            display: flex !important;
            align-items: center;
            justify-content: center;
            border: 0 !important;

            svg {
                width: initial !important;
                height: initial !important;
                margin: initial !important;
                margin-left: 10px !important;
            }
        }
    }

    .divider-container {
        margin: 50px 0;
    }

    &.funded {
        .funded {
            margin: 60px 0;
        }

        a {
            color: #72727A;
            text-decoration: underline;

            :hover {
                color: #72727A;
                text-decoration: none;
            }
        }
    }
`
class ActivateAccount extends Component {
    state = { 
        whereToBuy: false,
        moonpayAvailable: false,
        moonpaySignedURL: null,
        accountFunded: false
    }

    pollAccountBalanceHandle = null;

    checkMoonPay = async () => {
        const { accountId } = this.props
        await Mixpanel.withTracking("CA Check Moonpay available", 
            async () => {
                const moonpayAvailable = await isMoonpayAvailable()
                if (moonpayAvailable) {
                    const moonpaySignedURL = await getSignedUrl(accountId, window.location.origin)
                    this.setState({ moonpayAvailable, moonpaySignedURL })
                }
            },
            (e) => {
                this.setState({ moonpayAvailable: false });
                console.warn('Error checking Moonpay', e)
            }
        )
    }

    checkBalance = async () => {
        const { dispatch, balance, minBalanceToUnlock, accountId, needsDeposit } = this.props;

        if (needsDeposit) {
            await dispatch(getBalance())
        }
        
        if (minBalanceToUnlock && new BN(balance.available).gte(new BN(minBalanceToUnlock))) {
            this.setState({ accountFunded: true });
            if (needsDeposit) {
                await dispatch(clearFundedAccountNeedsDeposit(accountId));
                await dispatch(getAccountHelperWalletState(accountId))
                window.scrollTo(0, 0);
            }
        }
    }

    startPollingAccountBalance = () => {
        const handleCheckBalance = async () => {
            await this.checkBalance().catch(() => {});
            this.pollAccountBalanceHandle = setTimeout(() => handleCheckBalance(), 3000);
        }
        this.pollAccountBalanceHandle = setTimeout(() => handleCheckBalance(), 3000);
    }

    stopPollingAccountBalance = () => {
        clearTimeout(this.pollAccountBalanceHandle)
        this.pollAccountBalanceHandle = null;
    }
 
    componentDidMount = () => {
        this.startPollingAccountBalance()
        this.checkMoonPay()
    }

    componentDidUpdate = (prevProps) => {
        const { windowIsVisible } = this.props;

        if (prevProps.windowIsVisible !== windowIsVisible) {
            if (windowIsVisible) {
                this.startPollingAccountBalance()
            } else {
                this.stopPollingAccountBalance()
            }
        }
    }

    componentWillUnmount = () => {
        this.stopPollingAccountBalance()
    }

    handleClaimAccount = () => {
        const { dispatch, accountId } = this.props;
        removeAccountIsInactive(accountId);
        dispatch(redirectTo('/'))
    }

    render() {
        const {
            whereToBuy,
            moonpayAvailable,
            moonpaySignedURL,
            accountFunded
        } = this.state

        const { accountId, balance, mainLoader, minBalanceToUnlock } = this.props;

        if (accountFunded) {
            return (
                <StyledContainer className='small-centered border funded' >
                    <h1><Translate id='account.activateAccount.post.title' /></h1>
                    <h2><Translate id='account.activateAccount.post.descOne'/></h2>
                    <h2><Translate id='account.activateAccount.post.descTwo'/></h2>
                    <AccountFunded
                        initialDeposit={balance?.available}
                        accountId={accountId}
                    />
                    <FormButton
                        onClick={this.handleClaimAccount}
                        trackingId="CA activate account click continue to my account"
                        disabled={mainLoader}
                    >
                        <Translate id='button.continueToMyAccount' />
                    </FormButton>
                </StyledContainer>
            )
        }

        return (
            <StyledContainer className='small-centered border'>
                <h1><Translate id='account.activateAccount.pre.title' /></h1>
                <h2><Translate id='account.activateAccount.pre.desc' data={{ amount: formatNearAmount(minBalanceToUnlock) }}/></h2>
                <FormButton
                    onClick={() => this.setState({ whereToBuy: true })}
                    color='link'
                    className='where-to-buy-link'
                    trackingId="CA Click where to buy button"
                >
                    <Translate id='account.createImplicit.pre.whereToBuy.button' />
                </FormButton>
                <AccountNeedsFunding
                    accountId={accountId}
                    minDeposit={minBalanceToUnlock}
                />
                {moonpayAvailable &&
                    <>
                        <Divider/>
                        <FundWithMoonpay
                            moonpaySignedURL={moonpaySignedURL}
                        />
                    </>
                }
                {whereToBuy &&
                    <WhereToBuyNearModal
                        onClose={() => this.setState({ whereToBuy: false })}
                        open={whereToBuy}
                    />
                }
            </StyledContainer>
        )
    }
}

const mapStateToProps = ({ account, status }) => ({
    ...account,
    mainLoader: status.mainLoader,
    minBalanceToUnlock: account.accountHelperWalletState?.requiredUnlockBalance,
    needsDeposit: account.accountHelperWalletState?.fundedAccountNeedsDeposit,
    windowIsVisible: status.windowIsVisible
})

export const ActivateAccountWithRouter = connect(mapStateToProps)(withRouter(ActivateAccount))
