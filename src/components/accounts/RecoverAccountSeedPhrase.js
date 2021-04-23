import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { Translate } from 'react-localize-redux'
import styled from 'styled-components'
import { parse as parseQuery } from 'query-string'
import { recoverAccountSeedPhrase, redirectToApp, redirectTo, refreshAccount } from '../../actions/account'
import { staking } from '../../actions/staking'
import { clearLocalAlert } from '../../actions/status'
import RecoverAccountSeedPhraseForm from './RecoverAccountSeedPhraseForm'
import Container from '../common/styled/Container.css'
import { Mixpanel } from '../../mixpanel/index'

const StyledContainer = styled(Container)`
    .input {
        width: 100%;
    }

    .input-sub-label {
        margin-bottom: 30px;
    }

    h4 {
        :first-of-type {
            margin: 30px 0 0 0 !important;
        }
    }

    button {
        width: 100% !important;
        margin-top: 30px !important;
    }
`

class RecoverAccountSeedPhrase extends Component {
    state = {
        seedPhrase: this.props.seedPhrase,
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

        this.props.clearLocalAlert()
    }

    handleSubmit = async () => {
        if (!this.isLegit) {
            Mixpanel.track("IE-SP Recover seed phrase link not valid")
            return false
        }
        const { seedPhrase } = this.state
        const { fundingContract, fundingKey } = JSON.parse(parseQuery(this.props.location.search).fundingOptions || 'null')
        await Mixpanel.withTracking("IE-SP Recovery with seed phrase",
            async () => {
                await this.props.recoverAccountSeedPhrase(seedPhrase)
                await this.props.refreshAccount()
            }
        )
        if (fundingContract && fundingKey) {
            this.props.redirectTo(`/linkdrop/${fundingContract}/${fundingKey}`)
        } else {
            this.props.redirectToApp('/')
        }
        this.props.clearState()
    }

    render() {
        const combinedState = {
            ...this.props,
            ...this.state,
            isLegit: this.isLegit && !(this.props.localAlert && this.props.localAlert.success === false)
        }

        return (
            <StyledContainer className='small-centered'>
                <h1><Translate id='recoverSeedPhrase.pageTitle' /></h1>
                <h2><Translate id='recoverSeedPhrase.pageText' /></h2>
                <form onSubmit={e => {this.handleSubmit(); e.preventDefault();}} autoComplete='off'>
                    <RecoverAccountSeedPhraseForm
                        {...combinedState}
                        handleChange={this.handleChange}
                    />
                </form>
            </StyledContainer>
        )
    }
}

const mapDispatchToProps = {
    recoverAccountSeedPhrase,
    redirectTo,
    redirectToApp,
    refreshAccount,
    clearLocalAlert,
    clearState: staking.clearState
}

const mapStateToProps = ({ account, status, router }, { match }) => ({
    ...account,
    router,
    seedPhrase: match.params.seedPhrase || '',
    localAlert: status.localAlert,
    mainLoader: status.mainLoader
})

export const RecoverAccountSeedPhraseWithRouter = connect(
    mapStateToProps, 
    mapDispatchToProps
)(withRouter(RecoverAccountSeedPhrase))
