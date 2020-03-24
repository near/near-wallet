import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Translate } from 'react-localize-redux'

import CreateAccountForm from './CreateAccountForm'
import AccountFormSection from './AccountFormSection'
import AccountFormContainer from './AccountFormContainer'
import { checkNewAccount, createNewAccount, clear, refreshAccount, resetAccounts } from '../../actions/account'

class CreateAccount extends Component {
    state = {
        loader: false,
        accountId: '',
        fundingKey: null
    }

    componentDidMount = () => {
        const { loginError, resetAccounts } = this.props;
        this.handleFundingKey();

        if (loginError) {
            console.error('Error loading account:', loginError)

            if (loginError.indexOf('does not exist while viewing') !== -1) {
                resetAccounts()
            }
        }
    }

    handleFundingKey = () => {
        this.setState({fundingKey: this.props.match.params.fundingKey});
    }

    componentWillUnmount = () => {
        this.props.clear()
    }

    handleChange = (e, { name, value }) => {
        this.setState(() => ({
            [name]: value
        }))
    }

    handleSubmit = e => {
        e.preventDefault()

        this.setState(() => ({
            loader: true
        }))

        const { accountId, fundingKey } = this.state

        this.props.createNewAccount(accountId, fundingKey).then(({ error }) => {
            if (error) return;
                
            this.props.refreshAccount()

            let nextUrl = process.env.DISABLE_PHONE_RECOVERY === 'yes' ? `/setup-seed-phrase/${accountId}` : `/set-recovery/${accountId}`
            this.props.history.push(nextUrl)
        })
        .finally(() => {
            this.setState(() => ({
                loader: false
            }))
        })
    }

    handleRecaptcha = value => {
        console.log(value)
    }

    render() {
        const { loader, accountId } = this.state
        const { requestStatus, formLoader, checkNewAccount, location, loginResetAccounts } = this.props
        const useRequestStatus = accountId.length > 0 ? requestStatus : undefined;

        return (
            <AccountFormContainer 
                location={this.props.location}
                title={<Translate id='createAccount.pageTitle' />}
                text={<Translate id='createAccount.pageText' />}
                loginResetAccounts={loginResetAccounts}
            >
                <AccountFormSection 
                    requestStatus={useRequestStatus}
                    handleSubmit={this.handleSubmit}
                    location={location}
                >
                    <CreateAccountForm
                        loader={loader} 
                        requestStatus={useRequestStatus}
                        formLoader={formLoader}
                        handleRecaptcha={this.handleRecaptcha}
                        handleChange={this.handleChange}
                        checkAvailability={checkNewAccount}
                    />
                </AccountFormSection>
            </AccountFormContainer>
        )
    }
}

const mapDispatchToProps = {
    checkNewAccount,
    createNewAccount,
    clear,
    refreshAccount,
    resetAccounts
}

const mapStateToProps = ({ account }) => ({
    ...account
})

export const CreateAccountWithRouter = connect(
    mapStateToProps,
    mapDispatchToProps
)(CreateAccount)
