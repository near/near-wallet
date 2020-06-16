import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { Translate } from 'react-localize-redux'

import { recoverAccountSeedPhrase, redirectToApp, refreshAccount } from '../../actions/account'

import RecoverAccountSeedPhraseForm from './RecoverAccountSeedPhraseForm'
import AccountFormSection from './AccountFormSection'
import AccountFormContainer from './AccountFormContainer'

class RecoverAccountSeedPhrase extends Component {
    state = {
        seedPhrase: this.props.seedPhrase
    }

    // TODO: Use some validation framework?
    validators = {
        seedPhrase: value => value.length // TODO validate seed phrase
    }

    get isLegit() {
        return Object.keys(this.validators).every(field => this.validators[field](this.state[field]))
    }

    componentDidMount = () => {}

    handleChange = (e, { name, value }) => {
        this.setState(() => ({
            [name]: value
        }))
    }

    handleSubmit = () => {

        if (!this.isLegit) {
            return false
        }

        this.props.recoverAccountSeedPhrase(this.state.seedPhrase)
            .then(({ error }) => {
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
                    />
                </AccountFormSection>
            </AccountFormContainer>
        )
    }
}

const mapDispatchToProps = {
    recoverAccountSeedPhrase, 
    redirectToApp,
    refreshAccount
}

const mapStateToProps = ({ account }, { match }) => ({
    ...account,
    seedPhrase: match.params.seedPhrase || '',
})

export const RecoverAccountSeedPhraseWithRouter = connect(
    mapStateToProps, 
    mapDispatchToProps
)(withRouter(RecoverAccountSeedPhrase))
