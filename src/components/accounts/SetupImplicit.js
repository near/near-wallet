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

const IMPLICIT_ACCOUNT_KEY = '__IMPLICIT_ACCOUNT_KEY'

class SetupImplicit extends Component {
    state = {
        seedPhrase: '',
        enterWord: '',
        wordId: null,
        requestStatus: null,
        successSnackbar: false,
        sending: false,
        snackBarMessage: 'setupSeedPhrase.snackbarCopySuccess'
    }

    async checkBalance() {
        const recoveryKeyPair = JSON.parse(localStorage.getItem(IMPLICIT_ACCOUNT_KEY) || '{}')
        this.setState({ sending: true })
        const account = new nearApiJs.Account(this.connection, recoveryKeyPair.implicitAccountId)
        try {
            const state = await account.state()
            if (new BN(state.amount).gte(new BN('1000000000000000000000000', 10))) {
                window.removeEventListener('beforeunload')
                window.location.href = `${window.location.origin}/recover-with-link/${recoveryKeyPair.implicitAccountId}/${recoveryKeyPair.seedPhrase}`
            }
        } catch (e) {
            if (e.message.indexOf('exist while viewing') > -1) {
                console.warn('account does not exist yet')
            } else {
                throw(e)
            }
        }
        setTimeout(() => this.setState({ sending: false }), 1000)
    }

    componentDidUpdate = (props, state) => {
        const recoveryKeyPair = JSON.parse(localStorage.getItem(IMPLICIT_ACCOUNT_KEY) || '{}')
        if (this.props.location.pathname !== '/create-implicit/fund' && recoveryKeyPair.publicKey) {
            const confirm = confirm('WARNING! If you have funded your account, press "Cancel".\n\nIf you would like to start over with a new account, press "OK".')
            if (confirm) {
                localStorage.removeItem(IMPLICIT_ACCOUNT_KEY)
                this.refreshData()
                this.props.history.push('/create-implicit')
            } else {
                this.props.history.push('/create-implicit/fund')
            }
        }
        if (this.props.location.pathname === '/create-implicit/fund' && state.snackBarMessage !== 'setupSeedPhrase.snackbarCopyImplicitAccountId') {
            this.setState({
                snackBarMessage: 'setupSeedPhrase.snackbarCopyImplicitAccountId'
            })
        }
    }

    componentDidMount = () => {
        this.connection = nearApiJs.Connection.fromConfig({
            networkId: NETWORK_ID,
            provider: { type: 'JsonRpcProvider', args: { url: NODE_URL + '/' } },
            signer: {},
        })

        const recoveryKeyPair = JSON.parse(localStorage.getItem(IMPLICIT_ACCOUNT_KEY) || '{}')

        if (!recoveryKeyPair.publicKey) {
            if (this.props.location.pathname === '/create-implicit') {
                this.refreshData()
            }
        } else {
            this.setState({ recoveryKeyPair })
        }
    }

    refreshData = () => {
        const { seedPhrase, publicKey, secretKey } = generateSeedPhrase()
        const recoveryKeyPair = KeyPair.fromString(secretKey)
        const wordId = Math.floor(Math.random() * 12)

        this.setState((prevState) => ({
            ...prevState,
            seedPhrase,
            publicKey,
            wordId,
            enterWord: '',
            requestStatus: null,
            recoveryKeyPair
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
        const { seedPhrase, enterWord, wordId, recoveryKeyPair } = this.state
        if (enterWord !== seedPhrase.split(' ')[wordId]) {
            this.setState(() => ({
                requestStatus: {
                    success: false,
                    messageCode: 'account.verifySeedPhrase.error'
                }
            }))
            return false
        }
        console.log('verified', recoveryKeyPair)
        recoveryKeyPair.seedPhrase = seedPhrase
        recoveryKeyPair.implicitAccountId = Buffer.from(recoveryKeyPair.publicKey.data).toString('hex')
        localStorage.setItem(IMPLICIT_ACCOUNT_KEY, JSON.stringify(recoveryKeyPair))
        history.push(`/create-implicit/fund`)
    }

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
        if (!this.state.recoveryKeyPair) return null

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
                                        seedPhrase={this.state.seedPhrase}
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
                                            enterWord={this.state.enterWord}
                                            wordId={this.state.wordId}
                                            handleChangeWord={this.handleChangeWord}
                                            handleStartOver={this.handleStartOver}
                                            formLoader={this.props.formLoader}
                                            requestStatus={this.state.requestStatus}
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
                                        defaultValue={this.state.recoveryKeyPair.implicitAccountId} 
                                    />
                                    <FormButton
                                        onClick={() => this.handleCopyPhrase(this.state.recoveryKeyPair.implicitAccountId)}
                                        color='seafoam-blue-white'
                                    >
                                        <Translate id='button.copyImplicitAccountId' />
                                        <IconMCopy color='#6ad1e3' />
                                    </FormButton>
                                    <p id="implicit-account-id" style={{display: 'none'}}>
                                        <span>{this.state.recoveryKeyPair.implicitAccountId}</span>
                                    </p>
                                    <p style={{marginTop: 16}}>
                                        Once funded, you will be automatically redirected to a "Restore Account" page where you can sign into the wallet by clicking "Continue".
                                    </p>
                                    <FormButton
                                        onClick={() => this.checkBalance()}
                                        color='green'
                                        sending={this.state.sending}
                                        sendingString="implicitBalanceCheck">
                                        Check Balance
                                    </FormButton>
                                </Container>
                            )}
                        />
                        <Snackbar
                            theme='success'
                            message={translate(this.state.snackBarMessage)}
                            show={this.state.successSnackbar}
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
