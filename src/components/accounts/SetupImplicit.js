import React, { Component, Fragment } from 'react'

import * as nearApiJs from 'near-api-js' 
import { PublicKey, KeyType } from 'near-api-js/lib/utils/key_pair'
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
import IconMCopy from '../../images/IconMCopy'
import { createAccountFromImplicit } from '../../actions/account' 
import { NETWORK_ID, NODE_URL, MIN_BALANCE_FOR_GAS } from '../../utils/wallet'

// TODO: Make configurable
const MIN_BALANCE_TO_CREATE = new BN(MIN_BALANCE_FOR_GAS).add(new BN(parseNearAmount('1')))

let pollingInterval = null

const initialState = {
    successSnackbar: false,
    snackBarMessage: 'setupSeedPhrase.snackbarCopySuccess',
    balance: null,
}

class SetupImplicit extends Component {
    state = {...initialState}

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

        const { implicitAccountId } = this.props

        return (
            <Translate>
                {({ translate }) => (
                    <Fragment>
                        <Container style={{ textAlign: 'center' }} className='small-centered'>
                            {!balance
                                ? <>
                                    <h1>Fund Account</h1>
                                    <p>This is your account name (64 characters). Send at least {formatNearAmount(MIN_BALANCE_TO_CREATE)} NEAR to your account to continue.</p>
                                </>
                                : <>
                                    <h1>Claim Account</h1>
                                    <p>Your account has been funded and is ready to be claimed!</p>
                                </>
                            }
                            <textarea 
                                style={{
                                    width: '100%',
                                    border: '2px solid #eee',
                                    borderRadius: 4,
                                    padding: 16,
                                    fontSize: 18,
                                    resize: 'none',
                                    outline: 'none',
                                    textAlign: 'center',
                                }}
                                readOnly={true}
                                defaultValue={implicitAccountId} 
                            />

                            {!balance
                                ? <>
                                    <FormButton
                                        onClick={() => this.handleCopyPhrase(implicitAccountId)}
                                        color='seafoam-blue-white'
                                    >
                                        <Translate id='button.copyImplicitAccountId' />
                                        <IconMCopy color='#6ad1e3' />
                                    </FormButton>
                                    <p id="implicit-account-id" style={{ display: 'none' }}>
                                        <span>{implicitAccountId}</span>
                                    </p>
                                    <p style={{ marginTop: 16 }}>
                                        Once funded, return to this page.
                                    </p>
                                </>
                                : <>
                                    <FormButton
                                        onClick={() => this.handleContinue()}
                                        color='green'
                                        sending={this.props.formLoader}
                                    >
                                        Continue
                                    </FormButton>
                                </>
                            }
                        </Container>
                        <Snackbar
                            theme='success'
                            message={translate(snackBarMessage)}
                            show={successSnackbar}
                            onHide={() => this.setState({ successSnackbar: false })}
                        />
                    </Fragment>
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
