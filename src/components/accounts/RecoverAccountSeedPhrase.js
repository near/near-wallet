import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'

import { recoverAccountSeedPhrase, redirectToApp, checkAccountAvailable, clear, handleRefreshAccount } from '../../actions/account'

import RecoverAccountSeedPhraseForm from './RecoverAccountSeedPhraseForm'
import AccountFormSection from './AccountFormSection'
import AccountFormContainer from './AccountFormContainer'

class RecoverAccountSeedPhrase extends Component {
    state = {
        accountId: '',
        seedPhrase: '',
        isLegit: false
    }

    componentDidMount = () => {}

    componentWillUnmount = () => {
        this.props.clear()
    }

    handleChange = (e, { name, value }) => {
        this.setState((state) => ({
            [name]: value,
            isLegit: name === 'accountId' ? state.isLegit : this.isLegitField(name, value)
        }))
    }

    isLegitField(name, value) {
        // TODO: Use some validation framework?
        let validators = {
            seedPhrase: value => true // TODO validate seed phrase
        }
        return validators[name](value);
    }

    handleSubmit = e => {
        e.preventDefault()

        if (!this.state.isLegit) {
            return false
        }

        const accountId = this.state.accountId
        this.props.recoverAccountSeedPhrase(this.state.seedPhrase, accountId)
            .then(({ error }) => {
                if (error) return
                this.props.handleRefreshAccount()
                this.props.redirectToApp()
            })
            .finally(() => {
                this.setState(() => ({
                    isLegit: false
                }))
            })
    }

    render() {
        const combinedState = {
            ...this.props,
            ...this.state,
            isLegit: this.state.isLegit && !this.props.formLoader
        }
        
        return (
            <AccountFormContainer 
                wide={true} 
                title="Recover using Seed Phrase"
                text={"Enter the backup seed phrase associated with the account"}
            >
                <AccountFormSection requestStatus={this.props.requestStatus} handleSubmit={this.handleSubmit.bind(this)}>
                    <RecoverAccountSeedPhraseForm
                        {...combinedState}
                        handleChange={this.handleChange}
                        checkAvailability={this.props.checkAccountAvailable}
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
    handleRefreshAccount
}

const mapStateToProps = ({ account }) => ({
    ...account
})

export const RecoverAccountSeedPhraseWithRouter = connect(
    mapStateToProps, 
    mapDispatchToProps
)(withRouter(RecoverAccountSeedPhrase))
