import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { Translate } from 'react-localize-redux'
import styled from 'styled-components'
import { recoverAccountSeedPhrase, redirectToApp, checkAccountAvailable, clear, refreshAccount, setFormLoader } from '../../actions/account'

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
        accountId: this.props.accountId,
        seedPhrase: this.props.seedPhrase
    }

    // TODO: Use some validation framework?
    validators = {
        seedPhrase: value => true // TODO validate seed phrase
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

        const accountId = this.state.accountId
        this.props.recoverAccountSeedPhrase(this.state.seedPhrase, accountId)
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
            <StyledContainer className='small-centered'>
                <h1><Translate id='recoverSeedPhrase.pageTitle' /></h1>
                <h2><Translate id='recoverSeedPhrase.pageText' /></h2>
                <form onSubmit={e => {this.handleSubmit(); e.preventDefault();}} autoComplete='off'>
                    <RecoverAccountSeedPhraseForm
                        {...combinedState}
                        handleChange={this.handleChange}
                        checkAvailability={this.props.checkAccountAvailable}
                        clearRequestStatus={clear}
                        setFormLoader={this.props.setFormLoader}
                    />
                </form>
            </StyledContainer>
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
