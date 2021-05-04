import React, { Component } from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { Translate } from 'react-localize-redux'
import ReCAPTCHA from "react-google-recaptcha";
import { checkNewAccount, createNewAccount, refreshAccount, checkNearDropBalance, redirectTo } from '../../actions/account'
import { clearLocalAlert } from '../../actions/status'
import { ACCOUNT_ID_SUFFIX } from '../../utils/wallet'
import Container from '../common/styled/Container.css'
import BrokenLinkIcon from '../svg/BrokenLinkIcon';
import FormButton from '../common/FormButton'
import AccountFormAccountId from './AccountFormAccountId'
import AccountNote from '../common/AccountNote'
import { Mixpanel } from '../../mixpanel/index'
import TermsModal from './TermsModal'

// TODO: Background (v3) recaptcha has a different lifecycle and requires a different API key than challenge-based (v2)
// const RECAPTCHA_BACKGROUND_API_KEY = process.env.RECAPTCHA_BACKGROUND_API_KEY;
const RECAPTCHA_CHALLENGE_API_KEY = process.env.RECAPTCHA_CHALLENGE_API_KEY;

const RecaptchaString = styled.div`
    margin-bottom: -10px;
    font-size: 12px;
    padding-top: 24px;
    font-weight: 300;
    a {
        color: inherit;
        text-decoration: underline;
    }
`

const StyledContainer = styled(Container)`

    .input {
        width: 100%;
    }

    button {
        :first-of-type {
            width: 100% !important;
        }
    }

    h6 {
        margin: 30px 0 5px 0 !important;
        font-size: 15px !important;
        color: #24272a;
    }

    .recaptcha-disclaimer {
        font-size: 12px;
        font-weight: 400;
        max-width: 383px;
        margin: 50px auto 0 auto;
        text-align: center;

        a {
            color: inherit;
        }
    }

    a {
        text-decoration: underline;
    }
    
    .alternatives-title {
        color: #24272a;
        text-align: center;
        margin-top: 30px;
    }

    .alternatives {
        display: flex;
        justify-content: center;
        margin-top: 5px;
    }

    &.invalid-link {
        svg {
            display: block;
            margin: 0 auto;
        }

        h2 {
            margin-top: 20px;
        }
    }
`

class CreateAccount extends Component {
    state = {
        loader: false,
        accountId: '',
        recaptchaToken: '',
        invalidNearDrop: null,
        showTerms: false,
        termsChecked: false,
        privacyChecked: false,
        fundingAmount: null,
        recaptchaFallback: false
    }

    componentDidMount() {
        const { fundingContract, fundingKey, history, redirectTo } = this.props;
        const params = new URLSearchParams(history.location.search)

        if (fundingContract && fundingKey) {
            if (params.get('redirect') === 'false') {
                this.handleCheckNearDropBalance()
            } else {
                redirectTo(`/linkdrop/${fundingContract}/${fundingKey}`)
            }
        }
    }

    componentWillUnmount = () => {
        this.props.clearLocalAlert()
    }

    handleCheckNearDropBalance = async () => {
        const { fundingContract, fundingKey, checkNearDropBalance } = this.props;
        await Mixpanel.withTracking("CA Check near drop balance",
            async () =>  {
                const fundingAmount = await checkNearDropBalance(fundingContract, fundingKey)
                this.setState({ fundingAmount })
            },
            () => this.setState({ invalidNearDrop: true })
        )
    }

    handleChange = (e, { name, value }) => {
        if (value.length > 0) {
            this.setState({[name]: `${value}.${ACCOUNT_ID_SUFFIX}`})
        } else {
            this.setState({[name]: value})
        }
    }

    handleCreateAccount = async () => {
        const { accountId, fundingAmount } = this.state;
        const {
            fundingContract, fundingKey,
            fundingAccountId,
        } = this.props

        this.setState({ loader: true });

        let queryString = ''
        if (fundingAccountId || fundingContract) {
            const fundingOptions = fundingAccountId ? { fundingAccountId } : { fundingContract, fundingKey, fundingAmount }
            queryString = `?fundingOptions=${encodeURIComponent(JSON.stringify(fundingOptions))}`
        }

        if(RECAPTCHA_CHALLENGE_API_KEY) {
            const recaptchaToken = encodeURIComponent(this.state.recaptchaToken);
            queryString += `${queryString ? '&' : '?'}recaptchaToken=${recaptchaToken}`
        }
        let nextUrl = process.env.DISABLE_PHONE_RECOVERY === 'yes' ?
            `/setup-seed-phrase/${accountId}/phrase${queryString}` :
            `/set-recovery/${accountId}${queryString}`;
        Mixpanel.track("CA Click create account button")
        this.props.history.push(nextUrl);
    }


    /**
     //
     // If porting to Hooks, use useMemo() to get a stable reference to the function
     /* * Do not refactor this to an in-line function!
     *
     * Must be a stable function, or reCaptcha will infinitely loop on reloading itself
     *
     * @param token recaptchaToken returned by recaptcha API
     */
    handleVerifyRecaptcha = (token) => {
        this.setState({ recaptchaToken: token });
    }

    render() {
        const {
            loader,
            accountId,
            invalidNearDrop,
            showTerms,
            termsChecked,
            privacyChecked,
            recaptchaToken
        } = this.state

        const { localAlert, mainLoader, checkNewAccount, resetAccount, clearLocalAlert } = this.props
        const useLocalAlert = accountId.length > 0 ? localAlert : undefined;

        if (!invalidNearDrop) {
            return (
                <StyledContainer className='small-centered'>
                    <form onSubmit={e => {this.setState({ showTerms: true }); e.preventDefault();}} autoComplete='off'>
                        <h1><Translate id='createAccount.pageTitle'/></h1>
                        <h2><Translate id='createAccount.pageText'/></h2>
                        <h4 className='small'><Translate id='createAccount.accountIdInput.title'/></h4>
                        <AccountFormAccountId
                            mainLoader={mainLoader}
                            handleChange={this.handleChange}
                            type='create'
                            pattern={/[^a-zA-Z0-9_-]/}
                            checkAvailability={checkNewAccount}
                            localAlert={useLocalAlert}
                            accountId={accountId}
                            clearLocalAlert={clearLocalAlert}
                            defaultAccountId={resetAccount && resetAccount.accountIdNotConfirmed.split('.')[0]}
                        />
                        <AccountNote/>
                        <RecaptchaString>
                            This site is protected by reCAPTCHA and the Google <a
                            href='https://policies.google.com/privacy' target='_blank' rel='noopener noreferrer'>Privacy
                            Policy</a> and <a href='https://policies.google.com/terms' target='_blank'
                                              rel='noopener noreferrer'>Terms of Service</a> apply.
                        </RecaptchaString>
                        {RECAPTCHA_CHALLENGE_API_KEY && <ReCAPTCHA
                            sitekey={RECAPTCHA_CHALLENGE_API_KEY}
                            onChange={this.handleVerifyRecaptcha}
                            style={{ marginTop: '25px' }}
                        />}
                        <FormButton
                            type='submit'
                            disabled={!(localAlert && localAlert.success) || !recaptchaToken}
                            sending={loader}
                        >
                            <Translate id='button.createAccountCapital'/>
                        </FormButton>
                        <div className='alternatives-title'><Translate id='createAccount.alreadyHaveAnAccount'/></div>
                        <div className='alternatives' onClick={() => {Mixpanel.track("IE Click import existing account button")}}>
                            <Link to={process.env.DISABLE_PHONE_RECOVERY === 'yes' ? '/recover-seed-phrase' : '/recover-account'}><Translate id='createAccount.recoverItHere' /></Link>
                        </div>
                    </form>
                    {showTerms &&
                        <TermsModal
                            onClose={() => this.setState({ showTerms: false })}
                            open={showTerms}
                            termsChecked={termsChecked}
                            privacyChecked={privacyChecked}
                            handleTermsChange={e => this.setState({ termsChecked: e.target.checked })}
                            handlePrivacyChange={e => this.setState({ privacyChecked: e.target.checked })}
                            handleFinishSetup={this.handleCreateAccount}
                            loading={mainLoader}
                        />
                    }
                </StyledContainer>

            )
        } else {
            return (
                <StyledContainer className='small-centered invalid-link'>
                    <BrokenLinkIcon/>
                    <h1><Translate id='createAccount.invalidLinkDrop.title'/></h1>
                    <h2><Translate id='createAccount.invalidLinkDrop.one'/></h2>
                    <h2><Translate id='createAccount.invalidLinkDrop.two'/></h2>
                </StyledContainer>
            )
        }
    }
}

const mapDispatchToProps = {
    checkNewAccount,
    createNewAccount,
    clearLocalAlert,
    refreshAccount,
    checkNearDropBalance,
    redirectTo
}

const mapStateToProps = ({ account, status }, { match }) => ({
    ...account,
    localAlert: status.localAlert,
    mainLoader: status.mainLoader,
    fundingContract: match.params.fundingContract,
    fundingKey: match.params.fundingKey,
    fundingAccountId: match.params.fundingAccountId,
})

export const CreateAccountWithRouter = connect(
    mapStateToProps,
    mapDispatchToProps
)(CreateAccount)
