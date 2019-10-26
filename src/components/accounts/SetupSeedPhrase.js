import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'

import AccountFormSection from './AccountFormSection'
import AccountFormContainer from './AccountFormContainer'
import { redirectToApp, addAccessKey } from '../../actions/account'
import { generate } from '../../utils/seed-phrase'

class SetupSeedPhrase extends Component {
    state = {}

    componentDidMount = () => {
        const { seedPhrase, publicKey } = generate()
        this.setState((prevState) => ({
            ...prevState,
            seedPhrase,
            publicKey
        }))
    }

    handleSubmit = e => {
        e.preventDefault()

        const contractName = null;
        this.props.addAccessKey(this.props.accountId, contractName, this.state.publicKey)
            .then(({ error }) => {
                if (error) return
                this.props.history.push('/full-access-keys')
            })
    }

    render() {
        return (
            <AccountFormContainer
                title={`Protect your Account`}
                text={`Write down this seed phrase to allow you to recover account in the future.`}
            >
                <AccountFormSection handleSubmit={this.handleSubmit} requestStatus={this.props.requestStatus}>
                    <p style={{ fontSize: '2em' }}>{this.state.seedPhrase}</p>
                    <p>Public Key: {this.state.publicKey}</p>
                    <input type="submit" value="Setup Seed Phrase" />
                </AccountFormSection>
            </AccountFormContainer>
        )
    }
}

const mapDispatchToProps = {
    redirectToApp,
    addAccessKey
}

const mapStateToProps = ({ account }, { match }) => ({
    ...account,
    accountId: match.params.accountId
})

export const SetupSeedPhraseWithRouter = connect(mapStateToProps, mapDispatchToProps)(withRouter(SetupSeedPhrase))
