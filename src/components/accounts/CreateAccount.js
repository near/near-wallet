import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Translate } from 'react-localize-redux'
import { GoogleReCaptchaProvider, GoogleReCaptcha } from 'react-google-recaptcha-v3'
import CreateAccountForm from './CreateAccountForm'
import AccountFormSection from './AccountFormSection'
import AccountFormContainer from './AccountFormContainer'
import { checkNewAccount, createNewAccount, clear, handleRefreshAccount } from '../../actions/account'

class CreateAccount extends Component {
    state = {
        loader: false,
        accountId: '',
        recaptchaToken: ''
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

    handleSubmit = e => {
        e.preventDefault()

        this.setState(() => ({
            loader: true
        }))

        const { accountId, recaptchaToken } = this.state

        this.props.createNewAccount(accountId, recaptchaToken).then(({ error }) => {
            if (error) return

            this.props.handleRefreshAccount()

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
        const { requestStatus, formLoader, checkNewAccount } = this.props
        const useRequestStatus = accountId.length > 0 ? requestStatus : undefined;

        return (
            <AccountFormContainer 
                location={this.props.location}
                title={<Translate id='createAccount.pageTitle' />}
                text={<Translate id='createAccount.pageText' />}
            >
                <AccountFormSection 
                    requestStatus={useRequestStatus}
                    handleSubmit={this.handleSubmit}
                    location={this.props.location}
                >
                    <CreateAccountForm
                        loader={loader} 
                        requestStatus={useRequestStatus}
                        formLoader={formLoader}
                        handleRecaptcha={this.handleRecaptcha}
                        handleChange={this.handleChange}
                        checkAvailability={checkNewAccount}
                    />
                    <GoogleReCaptchaProvider reCaptchaKey="6LfSgNoUAAAAABKb2sk4Rs3TS0RMx9zrVwyTBSc6">
                        <GoogleReCaptcha onVerify={token => this.setState({recaptchaToken: token})}/>
                    </GoogleReCaptchaProvider>
                </AccountFormSection>
            </AccountFormContainer>
        )
    }
}

const mapDispatchToProps = {
    checkNewAccount,
    createNewAccount,
    clear,
    handleRefreshAccount
}

const mapStateToProps = ({ account }) => ({
    ...account
})

export const CreateAccountWithRouter = connect(
    mapStateToProps,
    mapDispatchToProps
)(CreateAccount)
