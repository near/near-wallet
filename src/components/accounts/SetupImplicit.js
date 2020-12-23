import React, { Component, Fragment } from 'react'
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
import { NETWORK_ID, NODE_URL, MIN_BALANCE_FOR_GAS } from '../../utils/wallet'

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
const MIN_BALANCE_TO_CREATE = new BN(MIN_BALANCE_FOR_GAS).add(new BN(parseNearAmount('1')))

let pollingInterval = null

const initialState = {
    successSnackbar: false,
    snackBarMessage: 'setupSeedPhrase.snackbarCopyImplicitAddress',
    balance: null,
    whereToBuy: false,
    checked: false,
    creatingAccount: null
}

class SetupImplicit extends Component {
    state = { ...initialState }

    handleContinue = async () => {
        this.setState({ creatingAccount: true })
        const { dispatch, accountId, implicitAccountId, recoveryMethod } = this.props
        try {
            await dispatch(createAccountFromImplicit(accountId, implicitAccountId, recoveryMethod))
        } catch(e) {
            this.setState({ creatingAccount: false })
        }
        await dispatch(redirectTo('/fund-create-account/success', { globalAlertPreventClear: true }))
    }

    checkBalance = async () => {
        const { implicitAccountId } = this.props

        const account = new nearApiJs.Account(this.connection, implicitAccountId)
        try {
            const state = await account.state()
            if (new BN(state.amount).gte(MIN_BALANCE_TO_CREATE)) {
                return this.setState({ balance: nearApiJs.utils.format.formatNearAmount(state.amount, 2), whereToBuy: false })
            }
        } catch (e) {
            if (e.message.indexOf('exist while viewing') === -1) {
                throw e
            }
            this.setState({ balance: false })
        }
    }

    componentDidMount = async () => {
        this.connection = nearApiJs.Connection.fromConfig({
            networkId: NETWORK_ID,
            provider: { type: 'JsonRpcProvider', args: { url: NODE_URL + '/' } },
            signer: {},
        })

        this.keyStore = new nearApiJs.keyStores.BrowserLocalStorageKeyStore(window.localStorage, 'nearlib:keystore:')
        // TODO: Use wallet/Redux for queries? Or at least same connection.

        clearInterval(pollingInterval)
        pollingInterval = setInterval(this.checkBalance, 2000)
    }

    componentWillUnmount = () => {
        clearInterval(pollingInterval)
    }

    // TODO: Refactor: Extract utility to copy text
    // optionally pass in string to copy: textToCopy
    handleCopyPhrase = (textToCopy) => {
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
            balance,
            snackBarMessage,
            successSnackbar,
            whereToBuy,
            checked,
            creatingAccount
        } = this.state

        const { implicitAccountId, accountId, formLoader } = this.props
        const showSuccessModal = balance || creatingAccount

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
                        {showSuccessModal &&
                            <AccountFundedModal
                                onClose={() => {}}
                                open={showSuccessModal}
                                checked={checked}
                                handleCheckboxChange={e => this.setState({ checked: e.target.checked })}
                                implicitAccountId={implicitAccountId}
                                accountId={accountId}
                                handleFinishSetup={this.handleContinue}
                                loading={formLoader}
                            />
                        }
                    </StyledContainer>
                )}
            </Translate>
        )
    }
}

const mapStateToProps = ({ account }, { match: { params: { accountId, implicitAccountId, recoveryMethod } } }) => ({
    ...account,
    accountId,
    implicitAccountId,
    recoveryMethod,
})

export const SetupImplicitWithRouter = connect(mapStateToProps)(withRouter(SetupImplicit))
