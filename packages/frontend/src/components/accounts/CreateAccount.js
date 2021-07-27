import { utils } from 'near-api-js';
import React, { Component } from 'react';
import { Translate } from 'react-localize-redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import { checkNewAccount, createNewAccount, refreshAccount, checkNearDropBalance, redirectTo } from '../../actions/account';
import { clearLocalAlert } from '../../actions/status';
import { Mixpanel } from '../../mixpanel/index';
import { ACCOUNT_ID_SUFFIX, MIN_BALANCE_TO_CREATE, IS_MAINNET } from '../../utils/wallet';
import AccountNote from '../common/AccountNote';
import FormButton from '../common/FormButton';
import Container from '../common/styled/Container.css';
import WhereToBuyNearModal from '../common/WhereToBuyNearModal';
import BrokenLinkIcon from '../svg/BrokenLinkIcon';
import FundNearIcon from '../svg/FundNearIcon';
import AccountFormAccountId from './AccountFormAccountId';

const StyledContainer = styled(Container)`

    .input {
        width: 100%;
    }

    button {
        &.blue {
            width: 100% !important;
        }
        &.link {
            &.blue {
                text-decoration: underline;
                font-weight: 400 !important;
                margin-bottom: 60px !important;

                :hover {
                    text-decoration: none !important;
                }
            }

            &.gray {
                color: #72727A !important;
                margin: 35px auto !important;
                display: block !important;
            }
        }
    }

    h6 {
        margin: 30px 0 5px 0 !important;
        font-size: 15px !important;
        color: #24272a;
    }

    a {
        text-decoration: underline;
        color: #72727A;

        :hover {
            text-decoration: none;
            color: #72727A;
        }
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

    .disclaimer {
        color: #72727A;
        text-align: center;
        font-size: 12px;
        max-width: 350px;
        margin: 0 auto;

        &.no-terms-page {
            margin-top: 35px;
        }
    }

    .fund-with-near-icon {
        margin: 0 auto 40px auto;
        display: block;
    }
`;

class CreateAccount extends Component {
    state = {
        loader: false,
        accountId: '',
        invalidNearDrop: null,
        fundingAmount: null,
        termsAccepted: false,
        whereToBuy: false
    }

    componentDidMount() {
        const { fundingContract, fundingKey, history, redirectTo } = this.props;
        const params = new URLSearchParams(history.location.search);

        if (fundingContract && fundingKey) {
            if (params.get('redirect') === 'false') {
                this.handleCheckNearDropBalance();
            } else {
                const redirectUrl = params.has('redirectUrl') ? `?redirectUrl=${encodeURIComponent(params.get('redirectUrl'))}` : '';
                redirectTo(`/linkdrop/${fundingContract}/${fundingKey}${redirectUrl}`);
            }
        }
    }

    componentWillUnmount = () => {
        this.props.clearLocalAlert();
    }

    handleCheckNearDropBalance = async () => {
        const { fundingContract, fundingKey, checkNearDropBalance } = this.props;
        await Mixpanel.withTracking("CA Check near drop balance",
            async () =>  {
                const fundingAmount = await checkNearDropBalance(fundingContract, fundingKey);
                this.setState({ fundingAmount });
            },
            () => this.setState({ invalidNearDrop: true })
        );
    }

    handleChange = (value) => {
        if (value.length > 0) {
            this.setState({accountId: `${value}.${ACCOUNT_ID_SUFFIX}`});
        } else {
            this.setState({accountId: value});
        }
    }

    handleCreateAccount = async () => {
        const { accountId, fundingAmount } = this.state;
        const {
            fundingContract, fundingKey,
            fundingAccountId,
        } = this.props;

        this.setState({ loader: true });

        let queryString = '';
        if (fundingAccountId || fundingContract) {
            const fundingOptions = fundingAccountId ? { fundingAccountId } : { fundingContract, fundingKey, fundingAmount };
            queryString = `?fundingOptions=${encodeURIComponent(JSON.stringify(fundingOptions))}`;
        }
        let nextUrl = process.env.DISABLE_PHONE_RECOVERY === 'yes' ?
            `/setup-seed-phrase/${accountId}/phrase${queryString}` :
            `/set-recovery/${accountId}${queryString}`;
        Mixpanel.track("CA Click create account button");
        this.props.history.push(nextUrl);
    }

    render() {
        const {
            loader,
            accountId,
            invalidNearDrop,
            termsAccepted,
            whereToBuy
        } = this.state;

        const { localAlert, mainLoader, checkNewAccount, resetAccount, clearLocalAlert, fundingContract, fundingKey, isMobile } = this.props;
        const isLinkDrop = fundingContract && fundingKey;
        const useLocalAlert = accountId.length > 0 ? localAlert : undefined;
        const showTermsPage = IS_MAINNET && !isLinkDrop && !termsAccepted;

        if (showTermsPage) {
            return (
                <StyledContainer className='small-centered border'>
                    <FundNearIcon/>
                    <h1><Translate id='createAccount.termsPage.title'/></h1>
                    <h2><Translate id='createAccount.termsPage.descOne' data={{ data: utils.format.formatNearAmount(MIN_BALANCE_TO_CREATE) }}/></h2>
                    <h2><Translate id='createAccount.termsPage.descTwo'/></h2>
                    <FormButton
                        onClick={() => this.setState({ whereToBuy: true })}
                        color='blue'
                        className='link'
                        trackingId="CA Click where to buy button"
                    >
                        <Translate id='account.createImplicit.pre.whereToBuy.button' />
                    </FormButton>
                    <FormButton
                        onClick={() => {
                            this.setState({ termsAccepted: true });
                            window.scrollTo(0, 0);
                        }}
                    >
                        <Translate id='createAccount.terms.agreeBtn'/>
                    </FormButton>
                    <FormButton
                        color='gray'
                        className='link'
                        onClick={() => this.props.redirectTo('/')}
                    >
                        <Translate id='button.cancel'/>
                    </FormButton>
                    <div className='disclaimer'>
                        <Translate id='createAccount.termsPage.disclaimer'/>
                    </div>
                    {whereToBuy &&
                        <WhereToBuyNearModal
                            onClose={() => this.setState({ whereToBuy: false })}
                            open={whereToBuy}
                        />
                    }
                </StyledContainer>
            );
        }

        if (!invalidNearDrop) {
            return (
                <StyledContainer className='small-centered border'>
                    <form onSubmit={e => {this.handleCreateAccount(); e.preventDefault();}} autoComplete='off'>
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
                            autoFocus={isMobile ? false : true}
                        />
                        <AccountNote/>
                        <FormButton
                            type='submit'
                            disabled={!(localAlert && localAlert.success)}
                            sending={loader}
                        >
                            <Translate id='button.reserveMyAccountId'/>
                        </FormButton>
                        {!termsAccepted && 
                            <div className='disclaimer no-terms-page'>
                                <Translate id='createAccount.termsPage.disclaimer'/>
                            </div>
                        }
                        <div className='alternatives-title'><Translate id='createAccount.alreadyHaveAnAccount'/></div>
                        <div className='alternatives' onClick={() => {Mixpanel.track("IE Click import existing account button");}}>
                            <Link to={process.env.DISABLE_PHONE_RECOVERY === 'yes' ? '/recover-seed-phrase' : '/recover-account'}><Translate id='createAccount.recoverItHere' /></Link>
                        </div>
                    </form>
                </StyledContainer>

            );
        } else {
            return (
                <StyledContainer className='small-centered invalid-link'>
                    <BrokenLinkIcon/>
                    <h1><Translate id='createAccount.invalidLinkDrop.title'/></h1>
                    <h2><Translate id='createAccount.invalidLinkDrop.one'/></h2>
                    <h2><Translate id='createAccount.invalidLinkDrop.two'/></h2>
                </StyledContainer>
            );
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
};

const mapStateToProps = ({ account, status }, { match }) => ({
    ...account,
    localAlert: status.localAlert,
    mainLoader: status.mainLoader,
    isMobile: status.isMobile,
    fundingContract: match.params.fundingContract,
    fundingKey: match.params.fundingKey,
    fundingAccountId: match.params.fundingAccountId,
});

export const CreateAccountWithRouter = connect(
    mapStateToProps,
    mapDispatchToProps
)(CreateAccount);
