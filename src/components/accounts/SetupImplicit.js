import React, { Component } from 'react'
import styled from 'styled-components'
import * as nearApiJs from 'near-api-js'
import { formatNearAmount, parseNearAmount } from 'near-api-js/lib/utils/format'
import BN from 'bn.js'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { Translate } from 'react-localize-redux'
import Container from '../common/styled/Container.css'
import FormButton from '../common/FormButton'
import WhereToBuyNearModal from '../common/WhereToBuyNearModal'
import AccountFundedModal from './AccountFundedModal'
import { createAccountFromImplicit, redirectTo } from '../../actions/account'
import { NETWORK_ID, NODE_URL } from '../../utils/wallet'
import { Mixpanel } from '../../mixpanel'
import { isMoonpayAvailable, getSignedUrl } from '../../utils/moonpay'
import MoonPayIcon from '../svg/MoonPayIcon';
import AccountFundedStatus from './create/AccountFundedStatus'

const StyledContainer = styled(Container)`
    .account-id-wrapper {
        background-color: #FAFAFA;
        width: 100%;
        border-radius: 4px;
        border: 2px solid #F0F0F0;
        padding: 20px;
        font-size: 16px;
        word-break: break-all;
        line-height: 140%;
        margin: 10px 0 40px 0;
        text-align: center;
        color: #72727A;
    }

    h2 {
        span {
            b {
                white-space: nowrap;
            }
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

        &.gray-blue, &.black {
            height: 54px !important;
        }

        &.black {
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
`

// TODO: Make configurable
const MIN_BALANCE_TO_CREATE = new BN(parseNearAmount('0.35'))

let pollingInterval = null

const initialState = {
    successSnackbar: false,
    snackBarMessage: 'setupSeedPhrase.snackbarCopyImplicitAddress',
    balance: null,
    whereToBuy: false,
    checked: false,
    createAccount: null,
    moonpayAvailable: false,
    moonpaySignedURL: null,
}

class SetupImplicit extends Component {
    state = { ...initialState }

    handleContinue = async () => {
        const { dispatch, accountId, implicitAccountId, recoveryMethod } = this.props
        this.setState({ createAccount: true })
        await Mixpanel.withTracking("CA Create account from implicit", 
            async () => await dispatch(createAccountFromImplicit(accountId, implicitAccountId, recoveryMethod))
        )
        await dispatch(redirectTo('/fund-create-account/success'))
    }

    checkMoonPay = async () => {
        await Mixpanel.withTracking("CA Check Moonpay available", 
            async () => {
                const moonpayAvailable = await isMoonpayAvailable()
                if (moonpayAvailable) {
                    const moonpaySignedURL = await getSignedUrl(this.props.implicitAccountId, window.location.origin)
                    this.setState({ moonpayAvailable, moonpaySignedURL })
                }
            },
            (e) => console.warn('Error checking Moonpay', e)
        )
    }

    checkBalance = async () => {
        const { implicitAccountId } = this.props

        const account = new nearApiJs.Account(this.connection, implicitAccountId)

        await Mixpanel.withTracking("CA Check balance from implicit",
            async () => {
                const state = await account.state()
                if (new BN(state.amount).gte(MIN_BALANCE_TO_CREATE)) {
                    Mixpanel.track("CA Check balance from implicit: sufficient")
                    return this.setState({ balance: formatNearAmount(state.amount, 2), whereToBuy: false, createAccount: true })
                }else {
                    Mixpanel.track("CA Check balance from implicit: insufficient")
                }
            },
            (e) => { 
                if (e.message.indexOf('exist while viewing') === -1) {
                    throw e
                }
                this.setState({ balance: false })
        }
        )
    }

    // componentDidMount = () => {

    //     this.connection = nearApiJs.Connection.fromConfig({
    //         networkId: NETWORK_ID,
    //         provider: { type: 'JsonRpcProvider', args: { url: NODE_URL + '/' } },
    //         signer: {},
    //     })

    //     // TODO: Use wallet/Redux for queries? Or at least same connection.

    //     clearInterval(pollingInterval)
    //     pollingInterval = setInterval(this.checkBalance, 2000)

    //     this.checkMoonPay()
    // }

    componentWillUnmount = () => {
        clearInterval(pollingInterval)
    }

    render() {
        const {
            whereToBuy,
            checked,
            createAccount,
            moonpayAvailable,
            moonpaySignedURL
        } = this.state

        const { implicitAccountId, accountId, mainLoader } = this.props

        return (
            <StyledContainer className='small-centered'>
                <h1><Translate id='account.createImplicit.pre.title' /></h1>
                <h2><Translate id='account.createImplicit.pre.descOne' data={{ amount: formatNearAmount(MIN_BALANCE_TO_CREATE) }}/></h2>
                <FormButton
                    onClick={() => this.setState({ whereToBuy: true })}
                    color='link'
                    className='where-to-buy-link'
                    trackingId="CA Click where to buy button"
                >
                    <Translate id='account.createImplicit.pre.whereToBuy.button' />
                </FormButton>
                <AccountFundedStatus
                    fundingAddress='0026506d88a4bbdb4973f1fe0004e988d32616e746f9444779ff28e9904c66de'
                    minDeposit={MIN_BALANCE_TO_CREATE}
                    intitalDeposit={null}
                    accountId={null}
                />
                {moonpayAvailable &&
                    <div style={{ marginTop: '1em' }}>
                        <FormButton
                            linkTo={moonpaySignedURL}
                            color='black'
                            onClick={() => Mixpanel.track("CA Click Fund with Moonpay")}
                        >
                            <Translate id='account.createImplicit.pre.fundWith'/>
                            <MoonPayIcon/>
                        </FormButton>
                    </div>
                }
                {whereToBuy &&
                    <WhereToBuyNearModal
                        onClose={() => this.setState({ whereToBuy: false })}
                        open={whereToBuy}
                    />
                }
                {createAccount &&
                    <AccountFundedModal
                        onClose={() => {}}
                        open={createAccount}
                        checked={checked}
                        handleCheckboxChange={e => this.setState({ checked: e.target.checked })}
                        implicitAccountId={implicitAccountId}
                        accountId={accountId}
                        handleFinishSetup={this.handleContinue}
                        loading={mainLoader}
                    />
                }
            </StyledContainer>
        )
    }
}

const mapStateToProps = ({ account, status }, { match: { params: { accountId, implicitAccountId, recoveryMethod } } }) => ({
    ...account,
    accountId,
    implicitAccountId,
    recoveryMethod,
    mainLoader: status.mainLoader
})

export const SetupImplicitWithRouter = connect(mapStateToProps)(withRouter(SetupImplicit))
