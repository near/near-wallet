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
import { redirectTo } from '../../../actions/account'
import { MIN_BALANCE_TO_CREATE } from '../../../utils/wallet'
import { Mixpanel } from '../../../mixpanel'
import { isMoonpayAvailable, getSignedUrl } from '../../../utils/moonpay'
import AccountFundedStatus from './AccountFundedStatus'
import Divider from '../../common/Divider'
import FundWithMoonpay from './FundWithMoonpay'

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
    }
`
class ActivateAccount extends Component {
    state = { 
        whereToBuy: false,
        moonpayAvailable: false,
        moonpaySignedURL: null,
        accountFunded: false
    }

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
            (e) => console.warn('Error checking Moonpay', e)
        )
    }

    checkBalance = () => {
        const { balance } = this.props
        const { accountFunded } = this.state

        if (!accountFunded && new BN(balance.available).gte(new BN(MIN_BALANCE_TO_CREATE))) {
            this.setState({ accountFunded: true })
            window.scrollTo(0, 0)
        }
    }

    componentDidMount = () => {
        // FIX: Check if account has already been unlocked and if so, navigate to dashboard
        this.interval = setInterval(() => this.checkBalance(), 2000)
        this.checkMoonPay()
    }

    componentWillUnmount = () => {
        clearInterval(this.interval)
    }

    handleClaimAccount = async () => {
        const { dispatch } = this.props;
        // FIX: POST to /clearInitialFundedAccountBalance
        // FIX: SET REDUX STATE 'inactiveAccount'
        dispatch(redirectTo('/'))
    }

    render() {
        const {
            whereToBuy,
            moonpayAvailable,
            moonpaySignedURL,
            accountFunded
        } = this.state

        const { accountId, balance, mainLoader } = this.props;

        if (accountFunded) {
            return (
                <StyledContainer className='small-centered funded' >
                    <h1><Translate id='account.activateAccount.post.title' /></h1>
                    <h2><Translate id='account.activateAccount.post.descOne'/></h2>
                    <h2><Translate id='account.activateAccount.post.descTwo'/></h2>
                    <AccountFundedStatus
                        intitalDeposit={balance?.available}
                        accountId={accountId}
                    />
                    <FormButton
                        onClick={this.handleClaimAccount}
                        trackingId="CA implicit click continue to my account"
                        disabled={mainLoader}
                    >
                        <Translate id='button.continueToMyAccount' />
                    </FormButton>
                </StyledContainer>
            )
        }

        return (
            <StyledContainer className='small-centered'>
                <h1><Translate id='account.activateAccount.pre.title' /></h1>
                <h2><Translate id='account.activateAccount.pre.desc' data={{ amount: formatNearAmount(MIN_BALANCE_TO_CREATE) }}/></h2>
                <FormButton
                    onClick={() => this.setState({ whereToBuy: true })}
                    color='link'
                    className='where-to-buy-link'
                    trackingId="CA Click where to buy button"
                >
                    <Translate id='account.createImplicit.pre.whereToBuy.button' />
                </FormButton>
                <AccountFundedStatus
                    accountId={accountId}
                    minDeposit={MIN_BALANCE_TO_CREATE}
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
    mainLoader: status.mainLoader
})

export const ActivateAccountWithRouter = connect(mapStateToProps)(withRouter(ActivateAccount))
