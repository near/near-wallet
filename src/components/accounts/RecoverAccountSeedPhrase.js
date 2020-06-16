import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { Translate } from 'react-localize-redux'

import { recoverAccountSeedPhrase, redirectToApp, checkAccountAvailable, clear, refreshAccount, setFormLoader } from '../../actions/account'

import RecoverAccountSeedPhraseForm from './RecoverAccountSeedPhraseForm'
import AccountFormSection from './AccountFormSection'
import AccountFormContainer from './AccountFormContainer'

class RecoverAccountSeedPhrase extends Component {
    state = {
        loader: false,
        accountId: this.props.accountId,
        seedPhrase: this.props.seedPhrase
    }

    // TODO: Use some validation framework?
    validators = {
        accountId: value => this.props.requestStatus && this.props.requestStatus.success,
        seedPhrase: value => value.length // TODO validate seed phrase
    }

    get isLegit() {
        return Object.keys(this.validators).every(field => this.validators[field](this.state[field]))
    }

    componentDidMount = () => {}

    componentWillUnmount = () => {
        this.props.clear()
    }

    handleChange = (e, { name, value }) => {
        this.setState(() => ({
            [name]: value
        }))
    }

    handleSubmit = () => {

        if (!this.isLegit) {
            return false
        }

        this.setState({ loader: true });

        this.props.recoverAccountSeedPhrase(this.state.seedPhrase)
            .then(({ error }) => {
                this.setState({ loader: false });

                if (error) return
                this.props.refreshAccount()
                this.props.redirectToApp()
            })
    }

    render() {
        const combinedState = {
            ...this.props,
            ...this.state,
            isLegit: this.isLegit && !this.props.formLoader
        }

        return (
            <AccountFormContainer 
                wide={true} 
                title={<Translate id='recoverSeedPhrase.pageTitle' />}
                text={<Translate id='recoverSeedPhrase.pageText' />}
            >
                <AccountFormSection requestStatus={this.props.requestStatus} handleSubmit={this.handleSubmit}>
                    <RecoverAccountSeedPhraseForm
                        {...combinedState}
                        handleChange={this.handleChange}
                        checkAvailability={this.props.checkAccountAvailable}
                        clearRequestStatus={clear}
                        setFormLoader={this.props.setFormLoader}
                        loader={this.state.loader}
                    />
                </AccountFormSection>
            </AccountFormContainer>
        )
    }
}

const mapDispatchToProps = {
    recoverAccountSeedPhrase, 
    redirectToApp,
    checkAccountAvailable,
    clear,
    refreshAccount,
    setFormLoader
}

const mapStateToProps = ({ account }, { match }) => ({
    ...account,
    accountId: match.params.accountId || '',
    seedPhrase: match.params.seedPhrase || '',
})

export const RecoverAccountSeedPhraseWithRouter = connect(
    mapStateToProps, 
    mapDispatchToProps
)(withRouter(RecoverAccountSeedPhrase))
