import React, { Component } from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { Translate } from 'react-localize-redux'
import { checkNewAccount, createNewAccount, clear, refreshAccount, setFormLoader, checkNearDropBalance } from '../../actions/account'
import { ACCOUNT_ID_SUFFIX } from '../../utils/wallet'
import Container from '../common/styled/Container.css'
import BrokenLinkIcon from '../svg/BrokenLinkIcon';
import FormButton from '../common/FormButton'
import AccountFormAccountId from './AccountFormAccountId'
import AccountNote from '../common/AccountNote'

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
        letter-spacing: normal !important;
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
        token: '',
        invalidNearDrop: null
    }

    componentDidMount() {
        if (this.props.fundingContract && this.props.fundingKey) {
            this.handleCheckNearDropBalance()
        }
    }

    componentWillUnmount = () => {
        this.props.clear()
    }

    handleCheckNearDropBalance = async () => {
        try {
            await this.props.checkNearDropBalance(this.props.fundingContract, this.props.fundingKey)
        } catch(e) {
            this.setState({ invalidNearDrop: true })
        }
    }

    handleChange = (e, { name, value }) => {
        if (value.length > 0) {
            this.setState({[name]: `${value}.${ACCOUNT_ID_SUFFIX}`})
        } else {
            this.setState({[name]: value})
        }
    }

    handleCreateAccount = async () => {
        const { accountId } = this.state;
        const { 
            setFormLoader,
            fundingContract, fundingKey,
        } = this.props

        setFormLoader(false)
        
        this.setState({ loader: true });

        const linkdropParams = fundingContract ? `${fundingContract}/${fundingKey}` : ``
        let nextUrl = process.env.DISABLE_PHONE_RECOVERY === 'yes' ?
            `/setup-seed-phrase/${accountId}/phrase/1/${linkdropParams}` :
            `/set-recovery/${accountId}/1/${linkdropParams}`;


        this.props.history.push(nextUrl);
    }

    render() {
        const { loader, accountId, invalidNearDrop } = this.state
        const { requestStatus, formLoader, checkNewAccount, resetAccount, clear, setFormLoader } = this.props
        const useRequestStatus = accountId.length > 0 ? requestStatus : undefined;
        
        if (!invalidNearDrop) {
            return (
                <StyledContainer className='small-centered'>
                    <form onSubmit={e => {this.handleCreateAccount(); e.preventDefault();}} autoComplete='off'>
                        <h1><Translate id='createAccount.pageTitle'/></h1>
                        <h2><Translate id='createAccount.pageText'/></h2>
                        <h6><Translate id='createAccount.accountIdInput.title'/></h6>
                        <AccountFormAccountId
                            formLoader={formLoader}
                            handleChange={this.handleChange}
                            type='create'
                            pattern={/[^a-zA-Z0-9_-]/}
                            checkAvailability={checkNewAccount}
                            requestStatus={useRequestStatus}
                            accountId={accountId}
                            clearRequestStatus={clear}
                            setFormLoader={setFormLoader}
                            defaultAccountId={resetAccount && resetAccount.accountIdNotConfirmed.split('.')[0]}
                        />
                        <AccountNote/>
                        <FormButton
                            type='submit'
                            disabled={!(requestStatus && requestStatus.success)}
                            sending={loader}
                        >
                            <Translate id='button.createAccountCapital'/>
                        </FormButton>
                        <div className='alternatives-title'><Translate id='createAccount.alreadyHaveAnAccount'/></div>
                        <div className='alternatives'>
                            <Link to='/sign-in-ledger'><Translate id='createAccount.signInLedger'/></Link>
                            &nbsp; <Translate id='or'/> &nbsp;
                            <Link to={process.env.DISABLE_PHONE_RECOVERY === 'yes' ? '/recover-seed-phrase' : '/recover-account'}><Translate id='createAccount.recoverItHere' /></Link>
                        </div>
                    </form>
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
    clear,
    refreshAccount,
    setFormLoader,
    checkNearDropBalance
}

const mapStateToProps = ({ account }, { match }) => ({
    ...account,
    fundingContract: match.params.fundingContract,
    fundingKey: match.params.fundingKey,
})

export const CreateAccountWithRouter = connect(
    mapStateToProps,
    mapDispatchToProps
)(CreateAccount)
