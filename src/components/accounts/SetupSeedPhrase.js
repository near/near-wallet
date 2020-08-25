import React, { Component, Fragment } from 'react'
import { withRouter, Route } from 'react-router-dom'
import { connect } from 'react-redux'
import { Translate } from 'react-localize-redux'

import { redirectToApp, addAccessKeySeedPhrase, clearAlert, refreshAccount } from '../../actions/account'
import { generateSeedPhrase } from 'near-seed-phrase'
import SetupSeedPhraseVerify from './SetupSeedPhraseVerify'
import SetupSeedPhraseForm from './SetupSeedPhraseForm'
import copyText from '../../utils/copyText'
import isMobile from '../../utils/isMobile'
import { Snackbar, snackbarDuration } from '../common/Snackbar'
import Container from '../common/styled/Container.css'
import { BN } from 'bn.js'
import { utils, KeyPair } from 'near-api-js'
import { MULTISIG_MIN_AMOUNT } from '../../utils/wallet'

class SetupSeedPhrase extends Component {
    state = {
        seedPhrase: '',
        enterWord: '',
        wordId: null,
        requestStatus: null,
        successSnackbar: false
    }

    componentDidMount = () => {
        this.refreshData()
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
            history, isNew, accountId, fundingContract, fundingKey,
        } = this.props

        this.refreshData()
        history.push(`/setup-seed-phrase/${accountId}/phrase/${isNew ? '1' : '0'}/${fundingContract ? `${fundingContract}/${fundingKey}/` : ``}`)
    }

    handleSubmit = async () => {
        const { 
            accountId, isNew, fundingContract, fundingKey,
            redirectToApp, addAccessKeySeedPhrase, refreshAccount, history
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
        const contractName = null;

        let account;

        try {
            await addAccessKeySeedPhrase(accountId, contractName, recoveryKeyPair, isNew, fundingContract, fundingKey)
            account = await refreshAccount()
        } finally {
            const availableBalance = new BN(account.balance.available)
            const multisigMinAmount = new BN(utils.format.parseNearAmount(MULTISIG_MIN_AMOUNT))

            if (fundingContract && multisigMinAmount.lt(availableBalance)) {
                history.push('/enable-two-factor')
            } else {
                redirectToApp('/profile');
            }
        }
    }

    handleCopyPhrase = () => {
        if (navigator.share && isMobile()) {
            navigator.share({
                text: this.state.seedPhrase
            }).catch(err => {
                console.log(err.message);
            });
        } else {
            this.handleCopyDesktop();
        }
    }

    handleCopyDesktop = () => {
        copyText(document.getElementById('seed-phrase'));
        this.setState({ successSnackbar: true }, () => {
            setTimeout(() => {
                this.setState({ successSnackbar: false });
            }, snackbarDuration)
        });
    }

    render() {
        return (
            <Translate>
                {({ translate }) => (
                    <Fragment>
                        <Route 
                            exact
                            path={`/setup-seed-phrase/:accountId/phrase/:isNew?/:fundingContract?/:fundingKey?`}
                            render={() => (
                                <Container className='small-centered'>
                                    <h1><Translate id='setupSeedPhrase.pageTitle'/></h1>
                                    <h2><Translate id='setupSeedPhrase.pageText'/></h2>
                                    <SetupSeedPhraseForm
                                        seedPhrase={this.state.seedPhrase}
                                        handleCopyPhrase={this.handleCopyPhrase}
                                    />
                                </Container>
                            )}
                        />
                        <Route 
                            exact
                            path={`/setup-seed-phrase/:accountId/verify/:isNew?/:fundingContract?/:fundingKey?`}
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
                        <Snackbar
                            theme='success'
                            message={translate('setupSeedPhrase.snackbarCopySuccess')}
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
    addAccessKeySeedPhrase,
    clearAlert,
    refreshAccount
}

const mapStateToProps = ({ account }, { match }) => ({
    ...account,
    verify: match.params.verify,
    accountId: match.params.accountId,
    isNew: !!parseInt(match.params.isNew),
    fundingContract: match.params.fundingContract,
    fundingKey: match.params.fundingKey,
})

export const SetupSeedPhraseWithRouter = connect(mapStateToProps, mapDispatchToProps)(withRouter(SetupSeedPhrase))
