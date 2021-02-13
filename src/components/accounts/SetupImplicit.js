import React, { Component } from 'react'
import styled from 'styled-components'
import * as nearApiJs from 'near-api-js'
import { formatNearAmount, parseNearAmount } from 'near-api-js/lib/utils/format'
import BN from 'bn.js'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { Translate } from 'react-localize-redux'
import copyText from '../../utils/copyText'
import isMobile from '../../utils/isMobile'
import { Snackbar, snackbarDuration } from '../common/Snackbar'
import Container from '../common/styled/Container.css'
import FormButton from '../common/FormButton'
import WhereToBuyNearModal from '../common/WhereToBuyNearModal'
import AccountFundedModal from './AccountFundedModal'
import { createAccountFromImplicit, redirectTo } from '../../actions/account'
import { NETWORK_ID, NODE_URL, ACCOUNT_HELPER_URL, MIN_BALANCE_FOR_GAS } from '../../utils/wallet'
import sendJson from 'fetch-send-json'
import { Mixpanel } from '../../mixpanel'

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
            display: block !important;

            :hover {
                text-decoration: underline !important;
            }
        }
    }
`

// TODO: Make configurable
const MIN_BALANCE_TO_CREATE = new BN(parseNearAmount('1'))

const MOONPAY_API_KEY = process.env.MOONPAY_API_KEY || 'pk_test_wQDTsWBsvUm7cPiz9XowdtNeL5xasP9';

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

    fundWithMoonpay = async () => {
        // TODO: Push new URL with Redux?
        window.location = this.state.moonpaySignedURL
    }

    isMoonpayAvailable = async () => {
        const MOONPAY_API_URL = 'https://api.moonpay.com'
        const moonpayGet = (path) => sendJson('GET', `${MOONPAY_API_URL}${path}?apiKey=${MOONPAY_API_KEY}`)
        const isAllowed = ({ isAllowed, isBuyAllowed }) => isAllowed && isBuyAllowed

        const ipAddressInfo = await moonpayGet('/v4/ip_address')
        if (!isAllowed(ipAddressInfo)) {
            return false
        }
        const { alpha2, alpha3, state } = ipAddressInfo

        const countries = await moonpayGet('/v3/countries')
        const country = countries.find(c => c.alpha2 === alpha2 && c.alpha3 === alpha3) || {}
        if (!isAllowed(country)) {
            return false
        }

        const currencies = await moonpayGet('/v3/currencies')
        const currency = currencies.find(({ code }) => code === 'near') || {}
        const { isSupportedInUS, notAllowedUSStates } = currency

        if (alpha2 === 'US' && (!isSupportedInUS || notAllowedUSStates.includes(state))) {
            return false
        }

        return true
    }

    checkMoonpay = async () => {
        await Mixpanel.withTracking("CA Check moonpay available start", 
            async () => {
                const moonpayAvailable = await this.isMoonpayAvailable()
                if (moonpayAvailable) {
                    const MOONPAY_URL = `https://buy.moonpay.io?apiKey=${MOONPAY_API_KEY}`
                    const { implicitAccountId } = this.props
                    const widgetUrl = `${MOONPAY_URL}&walletAddress=${encodeURIComponent(implicitAccountId)}&currencyCode=NEAR` +
                        `&redirectURL=${encodeURIComponent(window.location.href)}`
    
                    const { signature } = await sendJson('GET', `${ACCOUNT_HELPER_URL}/moonpay/signURL?url=${encodeURIComponent(widgetUrl)}`)
                    const moonpaySignedURL = `${widgetUrl}&signature=${encodeURIComponent(signature)}`
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

    componentDidMount = () => {
        this.connection = nearApiJs.Connection.fromConfig({
            networkId: NETWORK_ID,
            provider: { type: 'JsonRpcProvider', args: { url: NODE_URL + '/' } },
            signer: {},
        })

        // TODO: Use wallet/Redux for queries? Or at least same connection.

        clearInterval(pollingInterval)
        pollingInterval = setInterval(this.checkBalance, 2000)

        this.checkMoonpay()
    }

    componentWillUnmount = () => {
        clearInterval(pollingInterval)
    }

    // TODO: Refactor: Extract utility to copy text
    // optionally pass in string to copy: textToCopy
    handleCopyPhrase = (textToCopy) => {
        Mixpanel.track("CA Copy funding address")
        if (typeof textToCopy !== 'string') {
            textToCopy = null
        }
        if (navigator.share && isMobile()) {
            navigator.share({
                text: textToCopy
            }).catch(err => {
                console.log(err.message);
            });
        } else {
            this.handleCopyDesktop(textToCopy);
        }
    }

    handleCopyDesktop = (textToCopy) => {
        // TODO: Use actual textToCopy passed as parameter
        copyText(document.getElementById('implicit-account-id'));
        this.setState({ successSnackbar: true }, () => {
            setTimeout(() => {
                this.setState({ successSnackbar: false });
            }, snackbarDuration)
        });
    }

    render() {
        const {
            snackBarMessage,
            successSnackbar,
            whereToBuy,
            checked,
            createAccount,
            moonpayAvailable
        } = this.state

        const { implicitAccountId, accountId, mainLoader } = this.props

        return (
            <Translate>
                {({ translate }) => (
                    <StyledContainer className='small-centered'>
                        <h1><Translate id='account.createImplicit.pre.title' /></h1>
                        <h2><Translate id='account.createImplicit.pre.descOne' data={{ amount: formatNearAmount(MIN_BALANCE_TO_CREATE) }}/></h2>
                        <h2><Translate id='account.createImplicit.pre.descTwo'/></h2>
                        <FormButton
                            onClick={() => this.setState({ whereToBuy: true })}
                            color='link'
                            className='where-to-buy-link'
                            trackingId="CA Click where to buy button"
                        >
                            <Translate id='account.createImplicit.pre.whereToBuy.button' />
                        </FormButton>
                        <h4 className='small'><Translate id='account.createImplicit.pre.addressHeader'/></h4>
                        <div className='account-id-wrapper'>
                            {implicitAccountId}
                        </div>
                        <FormButton
                            onClick={() => this.handleCopyPhrase(implicitAccountId)}
                            color='gray-blue border'
                        >
                            <Translate id='button.copyImplicitAddress' />
                        </FormButton>
                        <p id="implicit-account-id" style={{ display: 'none' }}>
                            <span>{implicitAccountId}</span>
                        </p>
                        { moonpayAvailable &&
                            <div style={{ marginTop: '1em' }}>
                                <FormButton
                                    onClick={this.fundWithMoonpay}
                                    color='black'
                                    sending={this.props.formLoader}
                                >
                                    Fund with Credit/Debit Card
                                </FormButton>
                            </div>
                        }
                        <Snackbar
                            theme='success'
                            message={translate(snackBarMessage)}
                            show={successSnackbar}
                            onHide={() => this.setState({ successSnackbar: false })}
                        />
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
                )}
            </Translate>
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
