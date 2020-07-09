import React, { Component, Fragment } from 'react'
import { withRouter, Route } from 'react-router-dom'
import { connect } from 'react-redux'
import { Translate } from 'react-localize-redux'

import { redirectToApp, addAccessKeySeedPhrase, clearAlert } from '../../actions/account'
import { generateSeedPhrase } from 'near-seed-phrase'
import SetupSeedPhraseVerify from './SetupSeedPhraseVerify'
import SetupSeedPhraseForm from './SetupSeedPhraseForm'
import copyText from '../../utils/copyText'
import isMobile from '../../utils/isMobile'
import { Snackbar, snackbarDuration } from '../common/Snackbar'
import Container from '../common/styled/Container.css'

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
        // console.log('new seed phrase')
        const { seedPhrase, publicKey } = generateSeedPhrase()
        const wordId = Math.floor(Math.random() * 12)

        this.setState((prevState) => ({
            ...prevState,
            seedPhrase,
            publicKey,
            wordId,
            enterWord: '',
            requestStatus: null
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
        this.refreshData()
        this.props.history.push(`/setup-seed-phrase/${this.props.accountId}`)
    }

    handleSubmit = () => {
        const { redirectToApp, accountId, addAccessKeySeedPhrase } = this.props
        const { seedPhrase, enterWord, wordId, publicKey } = this.state
        
        console.log(enterWord, seedPhrase)

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
        addAccessKeySeedPhrase(accountId, contractName, publicKey)
            .then(({ error }) => {
                if (error) return
                redirectToApp('/profile');
            })
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
                            path={`/setup-seed-phrase/:accountId`}
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
                            path={`/setup-seed-phrase/:accountId/verify`}
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
    clearAlert
}

const mapStateToProps = ({ account }, { match }) => ({
    ...account,
    accountId: match.params.accountId
})

export const SetupSeedPhraseWithRouter = connect(mapStateToProps, mapDispatchToProps)(withRouter(SetupSeedPhrase))
