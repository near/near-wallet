import React, { Component } from 'react'
import { connect } from 'react-redux'
import { GoogleReCaptchaProvider, GoogleReCaptcha } from 'react-google-recaptcha-v3'
import CreateAccountForm from './CreateAccountForm'
import AccountFormSection from './AccountFormSection'
import AccountFormContainer from './AccountFormContainer'
import { checkNewAccount, createNewAccount, clear, handleRefreshAccount } from '../../actions/account'

class CreateAccount extends Component {
    state = {
        loader: false,
        accountId: '',
        userVerified: false,
        recaptchaTwo: false
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

    verifyRecaptchaThree = (token) => {
        /*
            TODO:
            - Verify recaptcha score on back-end using token
                - if score is high -> this.setState({ userVerified: true });
                - if score is low -> this.setState({ recaptchaTwo: true });
        */
    }

    verifyRecaptchaTwo = (token) => {
        /*
            TODO:
            - Verify recaptcha token on back-end
                - if verified -> this.setState({ userVerified: true });
        */
    }

    render() {
        const { loader, accountId, userVerified, recaptchaTwo } = this.state
        const { requestStatus, formLoader, checkNewAccount } = this.props
        const useRequestStatus = accountId.length > 0 ? requestStatus : undefined;

        return (
            <AccountFormContainer 
                location={this.props.location}
                title='Create Account'
                text='Just choose a username and you’re all set.'
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
                        handleChange={this.handleChange}
                        checkAvailability={checkNewAccount}
                        userVerified={userVerified}
                        recaptchaTwo={recaptchaTwo}
                        verifyRecaptchaTwo={this.verifyRecaptchaTwo}
                    />
                    <GoogleReCaptchaProvider reCaptchaKey="6LfSgNoUAAAAABKb2sk4Rs3TS0RMx9zrVwyTBSc6">
                        <GoogleReCaptcha onVerify={this.verifyRecaptchaThree}/>
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
