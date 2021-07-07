import BN from 'bn.js';
import { formatNearAmount, parseNearAmount } from 'near-api-js/lib/utils/format';
import React, { Component } from 'react';
import { Translate } from 'react-localize-redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import styled from 'styled-components';

import { redirectTo, clearFundedAccountNeedsDeposit, getBalance, getAccountHelperWalletState } from '../../../actions/account';
import { Mixpanel } from '../../../mixpanel';
import { removeAccountIsInactive } from '../../../utils/localStorage';
import { isMoonpayAvailable, getSignedUrl } from '../../../utils/moonpay';
import { WALLET_APP_MIN_AMOUNT } from '../../../utils/wallet';
import Divider from '../../common/Divider';
import FormButton from '../../common/FormButton';
import Container from '../../common/styled/Container.css';
import WhereToBuyNearModal from '../../common/WhereToBuyNearModal';
import FundWithMoonpay from './FundWithMoonpay';
import AccountFunded from './status/AccountFunded';
import AccountNeedsFunding from './status/AccountNeedsFunding';

const StyledContainer = styled(Container)`

    h2 {
        b {
            color: #3F4045;
        }
    }
    button {
        margin: 0 auto !important;
        width: 100% !important;

        &.where-to-buy-link {
            text-decoration: none !important;
            font-weight: 400 !important;
            font-size: 16px !important;
            width: auto !important;
            text-align: left;
            margin-bottom: 50px !important;
            transition: 100ms;

            :hover {
                text-decoration: underline !important;
            }
        }

        &.black {
            height: 54px !important;
            width: 100% !important;
            display: flex !important;
            align-items: center;
            justify-content: center;
            border: 0 !important;

            svg {
                width: initial !important;
                height: initial !important;
                margin: initial !important;
                margin-left: 10px !important;
            }
        }
    }

    .divider-container {
        margin: 50px 0;
    }

    &.funded {
        .funded {
            margin: 60px 0;
        }

        a {
            color: #72727A;
            text-decoration: underline;

            :hover {
                color: #72727A;
                text-decoration: none;
            }
        }
    }
`;
class ActivateAccount extends Component {
    state = { 
        whereToBuy: false,
        moonpayAvailable: false,
        moonpaySignedURL: null,
        activatingAccount: false
    }

    pollAccountBalanceHandle = null;

    checkMoonPay = async () => {
        const { accountId } = this.props;
        await Mixpanel.withTracking("CA Check Moonpay available", 
            async () => {
                const moonpayAvailable = await isMoonpayAvailable();
                if (moonpayAvailable) {
                    const moonpaySignedURL = await getSignedUrl(accountId, window.location.origin);
                    this.setState({ moonpayAvailable, moonpaySignedURL });
                }
            },
            (e) => {
                this.setState({ moonpayAvailable: false });
                console.warn('Error checking Moonpay', e);
            }
        );
    }

    checkBalance = async () => {
        const { dispatch, needsDeposit } = this.props;

        if (needsDeposit || !this.accountHasMinimumBalanceToUnlock()) {
            await dispatch(getBalance());
        }

        if (this.accountHasMinimumBalanceToUnlock()) {
            this.stopPollingAccountBalance();
        }
    
    }

    startPollingAccountBalance = () => {
        const handleCheckBalance = async () => {
            await this.checkBalance().catch(() => {});
            if (this.pollAccountBalanceHandle) {
                this.pollAccountBalanceHandle = setTimeout(() => handleCheckBalance(), 3000);
            }
        };
        this.pollAccountBalanceHandle = setTimeout(() => handleCheckBalance(), 3000);
    }

    stopPollingAccountBalance = () => {
        clearTimeout(this.pollAccountBalanceHandle);
        this.pollAccountBalanceHandle = null;
    }
 
    componentDidMount = () => {
        this.startPollingAccountBalance();
        this.checkMoonPay();

    }

    handleClearAccountNeedsDeposit = async () => {
        const { dispatch, accountId } = this.props;
        await dispatch(clearFundedAccountNeedsDeposit(accountId));
        await dispatch(getAccountHelperWalletState(accountId));
    }

    componentWillUnmount = () => {
        this.stopPollingAccountBalance();
    }

    handleClaimAccount = async () => {
        const { dispatch, accountId, needsDeposit } = this.props;

        this.setState({ activatingAccount: true });

        if (needsDeposit) {
            try {
                await this.handleClearAccountNeedsDeposit();
            } catch(e) {
                this.setState({ activatingAccount: false });
                throw e;
            }
        }

        removeAccountIsInactive(accountId);
        dispatch(redirectTo('/'));
    }

    accountHasMinimumBalanceToUnlock = () => {
        const { balance, minBalanceToUnlock } = this.props;
        return new BN(balance?.available).gte(new BN(minBalanceToUnlock));
    }

    render() {
        const {
            whereToBuy,
            moonpayAvailable,
            moonpaySignedURL,
            activatingAccount
        } = this.state;

        const { accountId, balance, minBalanceToUnlock } = this.props;
        const accountFunded = this.accountHasMinimumBalanceToUnlock();

        if (accountFunded) {
            return (
                <StyledContainer className='small-centered border funded' >
                    <h1><Translate id='account.activateAccount.post.title' /></h1>
                    <h2><Translate id='account.activateAccount.post.descOne'/></h2>
                    <h2><Translate id='account.activateAccount.post.descTwo'/></h2>
                    <AccountFunded
                        initialDeposit={balance?.available}
                        accountId={accountId}
                    />
                    <FormButton
                        onClick={this.handleClaimAccount}
                        trackingId="CA activate account click continue to my account"
                        disabled={activatingAccount}
                        sending={activatingAccount}
                    >
                        <Translate id='button.continueToMyAccount' />
                    </FormButton>
                </StyledContainer>
            );
        }

        return (
            <StyledContainer className='small-centered border'>
                <h1><Translate id='account.activateAccount.pre.title' /></h1>
                <h2><Translate id='account.activateAccount.pre.desc' data={{ amount: formatNearAmount(minBalanceToUnlock) }}/></h2>
                <FormButton
                    onClick={() => this.setState({ whereToBuy: true })}
                    color='link'
                    className='where-to-buy-link'
                    trackingId="CA Click where to buy button"
                >
                    <Translate id='account.createImplicit.pre.whereToBuy.button' />
                </FormButton>
                <AccountNeedsFunding
                    accountId={accountId}
                    minDeposit={minBalanceToUnlock}
                />
                {moonpayAvailable &&
                    <>
                        <Divider/>
                        <FundWithMoonpay
                            moonpaySignedURL={moonpaySignedURL}
                        />
                    </>
                }
                {whereToBuy &&
                    <WhereToBuyNearModal
                        onClose={() => this.setState({ whereToBuy: false })}
                        open={whereToBuy}
                    />
                }
            </StyledContainer>
        );
    }
}

const mapStateToProps = ({ account, status }) => ({
    ...account,
    mainLoader: status.mainLoader,
    minBalanceToUnlock: account.accountHelperWalletState?.requiredUnlockBalance || parseNearAmount(WALLET_APP_MIN_AMOUNT),
    needsDeposit: account.accountHelperWalletState?.fundedAccountNeedsDeposit
});

export const ActivateAccountWithRouter = connect(mapStateToProps)(withRouter(ActivateAccount));
