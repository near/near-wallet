import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { Translate } from 'react-localize-redux'
import styled from 'styled-components'
import { recoverAccountSeedPhrase, redirectToApp, refreshAccount, clear } from '../../actions/account'
import RecoverAccountSeedPhraseForm from './RecoverAccountSeedPhraseForm'
import Container from '../common/styled/Container.css'

const StyledContainer = styled(Container)`
    .input {
        width: 100%;
    }

    h3 {
        :first-of-type {
            margin-top: 30px !important;
        }
    }

    button {
        width: 100% !important;
        margin-top: 50px !important;
    }
`

class RecoverAccountSeedPhrase extends Component {
    state = {
        seedPhrase: this.props.seedPhrase
    }

    // TODO: Use some validation framework?
    validators = {
        seedPhrase: value => !!value.length // TODO validate seed phrase
    }

    get isLegit() {
        return Object.keys(this.validators).every(field => this.validators[field](this.state[field]))
    }

    componentDidMount = () => {}

    handleChange = (e, { name, value }) => {
        this.setState(() => ({
            [name]: value
        }))

        this.props.clear()
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

    isSeedPhraseValid = () => !(this.props.requestStatus.errorMessage && this.props.requestStatus.errorMessage.includes('Cannot find matching public key'))

    get requestStatusWithFormValidation() {
        return this.props.requestStatus
            ? this.isSeedPhraseValid()
                ? this.props.requestStatus
                : this.invalidSeedPhraseRequestStatus
            : null
    }

    get invalidSeedPhraseRequestStatus() {
        return {
            success: false,
            messageCode: 'account.recoverAccount.errorInvalidSeedPhrase'
        }
    }

    render() {
        const combinedState = {
            ...this.props,
            ...this.state,
            isLegit: this.isLegit && !(this.props.requestStatus && this.props.requestStatus.success === false)
        }

        return (
            <StyledContainer className='small-centered'>
                <h1><Translate id='recoverSeedPhrase.pageTitle' /></h1>
                <h2><Translate id='recoverSeedPhrase.pageText' /></h2>
                <form onSubmit={e => {this.handleSubmit(); e.preventDefault();}} autoComplete='off'>
                    <RecoverAccountSeedPhraseForm
                        {...combinedState}
                        handleChange={this.handleChange}
                        requestStatus={this.requestStatusWithFormValidation}
                    />
                </form>
            </StyledContainer>
        )
    }
}

const mapDispatchToProps = {
    recoverAccountSeedPhrase, 
    redirectToApp,
    refreshAccount,
    clear
}

const mapStateToProps = ({ account }, { match }) => ({
    ...account,
    seedPhrase: match.params.seedPhrase || '',
})

export const RecoverAccountSeedPhraseWithRouter = connect(
    mapStateToProps, 
    mapDispatchToProps
)(withRouter(RecoverAccountSeedPhrase))
