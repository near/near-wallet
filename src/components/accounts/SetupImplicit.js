import React, { Component, Fragment } from 'react'

import * as nearApiJs from 'near-api-js' 
import BN from 'bn.js'

import { withRouter, Route } from 'react-router-dom'
import { connect } from 'react-redux'
import { Translate } from 'react-localize-redux'

import { redirectToApp, handleAddAccessKeySeedPhrase, clearAlert, refreshAccount, checkCanEnableTwoFactor, checkIsNew, handleCreateAccountWithSeedPhrase } from '../../actions/account'
import { generateSeedPhrase } from 'near-seed-phrase'
import SetupSeedPhraseVerify from './SetupSeedPhraseVerify'
import SetupSeedPhraseForm from './SetupSeedPhraseForm'
import copyText from '../../utils/copyText'
import isMobile from '../../utils/isMobile'
import { Snackbar, snackbarDuration } from '../common/Snackbar'
import Container from '../common/styled/Container.css'
import { KeyPair } from 'near-api-js'
import FormButton from '../common/FormButton'
import IconMCopy from '../../images/IconMCopy'
const NETWORK_ID = process.env.REACT_APP_NETWORK_ID || 'default'
const NODE_URL = process.env.REACT_APP_NODE_URL || 'https://rpc.nearprotocol.com'

const IMPLICIT_ACCOUNT_ID = '__IMPLICIT_ACCOUNT_ID'
let pollingInterval = null

const initialState = {
    seedPhrase: '',
    enterWord: '',
    wordId: null,
    requestStatus: null,
    successSnackbar: false,
    sending: false,
    snackBarMessage: 'setupSeedPhrase.snackbarCopySuccess',
    balance: null,
    accountId: '',
}

class SetupImplicit extends Component {
    state = {...initialState}

    handleContinue = () => {
        this.props.history.push(`/recover-with-link/${this.state.accountId}/${this.state.seedPhrase}`)
    }

    handleReset = () => {
        localStorage.removeItem(IMPLICIT_ACCOUNT_ID)
        this.refreshData()
        this.props.history.push('/create-implicit')
    }

    checkBalance = async () => {
        const accountId = localStorage.getItem(IMPLICIT_ACCOUNT_ID)
        if (!accountId) return
        this.setState({ sending: true })
        const account = new nearApiJs.Account(this.connection, accountId)
        try {
            const state = await account.state()
            if (new BN(state.amount).gte(new BN('1000000000000000000000000', 10))) {
                return this.setState({ balance: nearApiJs.utils.format.formatNearAmount(state.amount, 2) })
            }
        } catch (e) {
            if (e.message.indexOf('exist while viewing') === -1) {
                throw(e)
            }
            this.setState({ hasBalance: false })
        }
        setTimeout(() => this.setState({ sending: false }), 1000)
    }

    componentDidUpdate = (props, state) => {
        const accountId = localStorage.getItem(IMPLICIT_ACCOUNT_ID)
        if (accountId && this.props.location.pathname !== '/create-implicit/fund') {
            const confirm = window.confirm('WARNING! If you have funded your account, press "Cancel".\n\nIf you would like to start over with a new account, press "OK".')
            if (confirm) {
                this.handleReset()
            } else {
                this.props.history.push('/create-implicit/fund')
            }
        }
        if (this.props.location.pathname === '/create-implicit/fund' && state.snackBarMessage !== 'setupSeedPhrase.snackbarCopyImplicitAccountId') {
            this.setState({
                snackBarMessage: 'setupSeedPhrase.snackbarCopyImplicitAccountId'
            })
            clearInterval(pollingInterval)
            pollingInterval = setInterval(this.checkBalance, 2000)
        }
    }

    componentDidMount = async () => {
        this.connection = nearApiJs.Connection.fromConfig({
            networkId: NETWORK_ID,
            provider: { type: 'JsonRpcProvider', args: { url: NODE_URL + '/' } },
            signer: {},
        })

        this.keyStore = new nearApiJs.keyStores.BrowserLocalStorageKeyStore(window.localStorage, 'nearlib:keystore:')
        const accountId = localStorage.getItem(IMPLICIT_ACCOUNT_ID)

        if (accountId) {
            const keyPair = await this.keyStore.getKey(NETWORK_ID, accountId)
            const seedPhrase = localStorage.getItem(accountId)
            this.setState({ accountId, keyPair, seedPhrase })
        }
        if (this.props.location.pathname === '/create-implicit') {
            this.refreshData()
        }
    }

    refreshData = () => {
        const { seedPhrase, publicKey, secretKey } = generateSeedPhrase()
        const keyPair = KeyPair.fromString(secretKey)
        const wordId = Math.floor(Math.random() * 12)
        this.setState((prevState) => ({
            ...prevState,
            seedPhrase,
            publicKey,
            wordId,
            enterWord: '',
            requestStatus: null,
            keyPair,
            snackBarMessage: 'setupSeedPhrase.snackbarCopySuccess',
            balance: null,
        }))
    }

    handleChangeWord = (e, { name, value }) => {
        if (value.match(/[^a-zA-Z]/)) {
            return false
        }

        this.setState((state) => ({
           [name]: value.trim().toLowerCase(),
           requestStatus: null
        }))
    }

    handleStartOver = e => {
        const {
            history
        } = this.props

        this.refreshData()
        history.push(`/create-implicit`)
    }

    handleSubmit = async () => {
        const {
            history
        } = this.props
        const { seedPhrase, enterWord, wordId, keyPair } = this.state
        if (enterWord !== seedPhrase.split(' ')[wordId]) {
            this.setState(() => ({
                requestStatus: {
                    success: false,
                    messageCode: 'account.verifySeedPhrase.error'
                }
            }))
            return false
        }
        const accountId = Buffer.from(keyPair.publicKey.data).toString('hex')
        localStorage.setItem(accountId, seedPhrase)
        this.keyStore.setKey(NETWORK_ID, accountId, keyPair)
        localStorage.setItem(IMPLICIT_ACCOUNT_ID, accountId)
        this.setState({ accountId })
        history.push(`/create-implicit/fund`)
    }

    // optionally pass in string to copy: textToCopy
    handleCopyPhrase = (textToCopy) => {
        if (typeof textToCopy !== 'string') {
            textToCopy = null
        }
        if (navigator.share && isMobile()) {
            navigator.share({
                text: textToCopy ? textToCopy : this.state.seedPhrase
            }).catch(err => {
                console.log(err.message);
            });
        } else {
            this.handleCopyDesktop(textToCopy);
        }
    }

    handleCopyDesktop = (textToCopy) => {
        copyText(textToCopy ? document.getElementById('implicit-account-id') : document.getElementById('seed-phrase'));
        this.setState({ successSnackbar: true }, () => {
            setTimeout(() => {
                this.setState({ successSnackbar: false });
            }, snackbarDuration)
        });
    }

    render() {
        const {
            accountId, balance, seedPhrase,
            enterWord, wordId, requestStatus,
            snackBarMessage, successSnackbar,
        } = this.state

        return (
            <Translate>
                {({ translate }) => (
                    <Fragment>
                        <Route 
                            exact
                            path={`/create-implicit`}
                            render={() => (
                                <Container className='small-centered'>
                                    <h1><Translate id='setupSeedPhrase.pageTitle'/></h1>
                                    <h2><Translate id='setupSeedPhrase.pageText'/></h2>
                                    <SetupSeedPhraseForm
                                        linkTo="/create-implicit/verify"
                                        seedPhrase={seedPhrase}
                                        handleCopyPhrase={this.handleCopyPhrase}
                                    />
                                </Container>
                            )}
                        />
                        <Route 
                            exact
                            path={`/create-implicit/verify`}
                            render={() => (
                                <Container className='small-centered'>
                                    <form onSubmit={e => {this.handleSubmit(); e.preventDefault();}} autoComplete='off'>
                                    <h1><Translate id='setupSeedPhraseVerify.pageTitle'/></h1>
                                    <h2><Translate id='setupSeedPhraseVerify.pageText'/></h2>
                                        <SetupSeedPhraseVerify
                                            enterWord={enterWord}
                                            wordId={wordId}
                                            handleChangeWord={this.handleChangeWord}
                                            handleStartOver={this.handleStartOver}
                                            formLoader={this.props.formLoader}
                                            requestStatus={requestStatus}
                                            globalAlert={this.props.globalAlert}
                                        />
                                    </form>
                                </Container>
                            )}
                        />
                        <Route 
                            exact
                            path={`/create-implicit/fund`}
                            render={() => (

                                !balance ?

                                <Container style={{ textAlign: 'center' }} className='small-centered'>
                                    <h1>Fund Account</h1>
                                    <p>This is your account name (64 characters). Send at least 1 NEAR to your account to continue.</p>
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
                                        defaultValue={accountId} 
                                    />
                                    <FormButton
                                        onClick={() => this.handleCopyPhrase(accountId)}
                                        color='seafoam-blue-white'
                                    >
                                        <Translate id='button.copyImplicitAccountId' />
                                        <IconMCopy color='#6ad1e3' />
                                    </FormButton>
                                    <p id="implicit-account-id" style={{display: 'none'}}>
                                        <span>{accountId}</span>
                                    </p>
                                    <p style={{marginTop: 16}}>
                                        Once funded, return to this page.
                                    </p>
                                    {
                                        !!balance &&
                                        <>
                                            <p style={{marginTop: 16}}>
                                                Click "Continue". You will be redirected to a page titled "Restore Account". Click "Continue" again.
                                            </p>
                                            <FormButton
                                                onClick={() => this.handleContinue()}
                                                color='green'
                                            >
                                                Continue
                                            </FormButton>
                                        </>
                                    }
                                </Container>

                                :

                                <Container style={{ textAlign: 'center' }} className='small-centered'>
                                    <h1>Claim Account</h1>
                                    <p>Your account has been funded and is ready to be claimed!</p>
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
                                        defaultValue={accountId} 
                                    />
                                    <FormButton
                                        onClick={() => this.handleContinue()}
                                        color='green'
                                    >
                                        Continue
                                    </FormButton>
                                </Container>
                            )}
                        />
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

const mapDispatchToProps = {
    redirectToApp,
    handleAddAccessKeySeedPhrase,
    clearAlert,
    refreshAccount,
    checkCanEnableTwoFactor,
    checkIsNew,
    handleCreateAccountWithSeedPhrase
}

const mapStateToProps = ({ account }, { match }) => ({
    ...account,
    verify: match.params.verify,
})

export const SetupImplicitWithRouter = connect(mapStateToProps, mapDispatchToProps)(withRouter(SetupImplicit))
