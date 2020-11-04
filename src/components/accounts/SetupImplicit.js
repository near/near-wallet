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
import { createAccountFromImplicit } from '../../actions/account'
import { NETWORK_ID, NODE_URL, MIN_BALANCE_FOR_GAS } from '../../utils/wallet'

const StyledContainer = styled(Container)`
    .account-id-wrapper {
        background-color: #F2F2F2;
        width: 100%;
        border-radius: 4px;
        padding: 25px;
        font-size: 20px;
        word-break: break-all;
        line-height: 140%;
        margin: 40px 0;
        text-align: center;
    }

    p {
        margin: 25px 0;
    }

    button {
        margin: 0 auto !important;
        display: block !important
    }
`

// TODO: Make configurable
const MIN_BALANCE_TO_CREATE = new BN(MIN_BALANCE_FOR_GAS).add(new BN(parseNearAmount('1')))

let pollingInterval = null

const initialState = {
    successSnackbar: false,
    snackBarMessage: 'setupSeedPhrase.snackbarCopyImplicitAddress',
    balance: null,
}

class SetupImplicit extends Component {
    state = { ...initialState }

    handleContinue = async () => {
        const { dispatch, accountId, implicitAccountId, recoveryMethod } = this.props
        await dispatch(createAccountFromImplicit(accountId, implicitAccountId, recoveryMethod))
    }

    checkBalance = async () => {
        const { implicitAccountId } = this.props

        const account = new nearApiJs.Account(this.connection, implicitAccountId)
        try {
            const state = await account.state()
            if (new BN(state.amount).gte(MIN_BALANCE_TO_CREATE)) {
                return this.setState({ balance: nearApiJs.utils.format.formatNearAmount(state.amount, 2) })
            }
        } catch (e) {
            if (e.message.indexOf('exist while viewing') === -1) {
                throw e
            }
            this.setState({ hasBalance: false })
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
        } = this.state

        const { implicitAccountId, accountId } = this.props

        return (
            <Translate>
                {({ translate }) => (
                    <StyledContainer className='small-centered'>
                        {!balance
                            ? <>
                                <h1><Translate id='account.createImplicit.pre.title' /></h1>
                                <p><Translate id='account.createImplicit.pre.descOne' data={{ amount: formatNearAmount(MIN_BALANCE_TO_CREATE) }}/></p>
                                <p><Translate id='account.createImplicit.pre.descTwo'/></p>
                            </>
                            : <>
                                <h1><Translate id='account.createImplicit.post.title' /></h1>
                                <p><Translate id='account.createImplicit.post.descOne'/></p>
                                <p><Translate id='account.createImplicit.post.descTwo'/></p>
                            </>
                        }
                        <div className='account-id-wrapper'>
                            {!balance ? implicitAccountId : accountId}
                        </div>
                        {!balance
                            ? <>
                                <FormButton
                                    onClick={() => this.handleCopyPhrase(implicitAccountId)}
                                    color='seafoam-blue-white'
                                >
                                    <Translate id='button.copyImplicitAddress' />
                                </FormButton>
                                <p id="implicit-account-id" style={{ display: 'none' }}>
                                    <span>{implicitAccountId}</span>
                                </p>
                            </>
                            : <>
                                <FormButton
                                    onClick={this.handleContinue}
                                    color='green'
                                    sending={this.props.formLoader}
                                >
                                    <Translate id='button.claimAccount' />
                                </FormButton>
                            </>
                        }
                        <Snackbar
                            theme='success'
                            message={translate(snackBarMessage)}
                            show={successSnackbar}
                            onHide={() => this.setState({ successSnackbar: false })}
                        />
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
