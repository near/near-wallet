import BN from 'bn.js';
import React, { Component } from 'react';
import { Translate } from 'react-localize-redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import styled from 'styled-components';

import { createAccountFromImplicit, redirectTo } from '../../actions/account';
import { Mixpanel } from '../../mixpanel';
import { selectNearTokenFiatValueUSD } from '../../slices/tokenFiatValues';
import { isMoonpayAvailable, getSignedUrl } from '../../utils/moonpay';
import { MIN_BALANCE_TO_CREATE } from '../../utils/wallet';
import { wallet } from '../../utils/wallet';
import { getNearAndFiatValue } from '../common/balance/helpers';
import Divider from '../common/Divider';
import FormButton from '../common/FormButton';
import Container from '../common/styled/Container.css';
import WhereToBuyNearModal from '../common/WhereToBuyNearModal';
import AccountFundedModal from './AccountFundedModal';
import FundWithMoonpay from './create/FundWithMoonpay';
import AccountFunded from './create/status/AccountFunded';
import AccountNeedsFunding from './create/status/AccountNeedsFunding';

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
    }
`;
class SetupImplicit extends Component {
    state = { 
        balance: null,
        whereToBuy: false,
        accountFunded: false,
        moonpayAvailable: false,
        moonpaySignedURL: null,
        creatingAccount: false,
        claimMyAccount: false
    }

    pollAccountBalanceHandle = null;

    handleContinue = async () => {
        const { dispatch, newAccountId, implicitAccountId, recoveryMethod } = this.props;
        this.setState({ creatingAccount: true });
        await Mixpanel.withTracking("CA Create account from implicit", 
            async () => {
                await dispatch(createAccountFromImplicit(newAccountId, implicitAccountId, recoveryMethod));
            },
            () => {
                this.setState({ creatingAccount: false });
            }
        );
        dispatch(redirectTo('/fund-create-account/success'));
    }

    checkMoonPay = async () => {
        const { implicitAccountId } = this.props;
        await Mixpanel.withTracking("CA Check Moonpay available", 
            async () => {
                const moonpayAvailable = await isMoonpayAvailable();
                if (moonpayAvailable) {
                    const moonpaySignedURL = await getSignedUrl(implicitAccountId, window.location.origin);
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
        const { implicitAccountId } = this.props;
        const { accountFunded } = this.state;

        if (!accountFunded) {
            const account = wallet.getAccountBasic(implicitAccountId);
            await Mixpanel.withTracking("CA Check balance from implicit",
                async () => {
                    const state = await account.state();
                    if (new BN(state.amount).gte(new BN(MIN_BALANCE_TO_CREATE))) {
                        Mixpanel.track("CA Check balance from implicit: sufficient");
                        this.setState({ 
                            balance: state.amount,
                            whereToBuy: false,
                            accountFunded: true
                        });
                        window.scrollTo(0, 0);
                        return;
                    } else {
                        Mixpanel.track("CA Check balance from implicit: insufficient");
                    }
                },
                (e) => { 
                    if (e.message.indexOf('exist while viewing') === -1) {
                        throw e;
                    }
                    this.setState({ balance: 0 });
                }
            );
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
        // TODO: Check if account has already been created and if so, navigate to dashboard
        this.startPollingAccountBalance();
        this.checkMoonPay();
    }

    componentWillUnmount = () => {
        this.stopPollingAccountBalance();
    }

    handleClaimAccount = () => {
        const { dispatch, newAccountId, activeAccountId } = this.props;
        if (newAccountId === activeAccountId) {
            dispatch(redirectTo('/'));
            return;
        }
        this.setState({ claimMyAccount: true });
    }

    render() {
        const {
            whereToBuy,
            accountFunded,
            moonpayAvailable,
            moonpaySignedURL,
            balance,
            claimMyAccount,
            creatingAccount
        } = this.state;

        const { implicitAccountId, newAccountId, mainLoader, nearTokenFiatValueUSD } = this.props;

        if (accountFunded) {
            return (
                <StyledContainer className='small-centered funded' >
                    <h1><Translate id='account.createImplicit.post.title' /></h1>
                    <h2><Translate id='account.createImplicit.post.descOne'/></h2>
                    <h2><b><Translate id='account.createImplicit.post.descTwo'/></b></h2>
                    {!creatingAccount &&
                        <AccountFunded
                            fundingAddress={implicitAccountId}
                            initialDeposit={balance}
                            accountId={newAccountId}
                        />
                    }
                    <FormButton
                        onClick={this.handleClaimAccount}
                        trackingId="CA implicit click claim my account"
                        disabled={creatingAccount}
                    >
                        <Translate id='button.claimMyAccount' />
                    </FormButton>
                    {claimMyAccount &&
                        <AccountFundedModal
                            onClose={() => {}}
                            open={claimMyAccount}
                            implicitAccountId={implicitAccountId}
                            accountId={newAccountId}
                            handleFinishSetup={this.handleContinue}
                            loading={mainLoader}
                        />
                    }
                </StyledContainer>
            );
        }

        return (
            <StyledContainer className='small-centered funded'>
                <h1><Translate id='account.createImplicit.pre.title' /></h1>
                <h2>
                    <Translate
                        id='account.createImplicit.pre.descOne'
                        data={{ amount: getNearAndFiatValue(MIN_BALANCE_TO_CREATE, nearTokenFiatValueUSD) }}
                    />
                </h2>
                <FormButton
                    onClick={() => this.setState({ whereToBuy: true })}
                    color='link'
                    className='where-to-buy-link'
                    trackingId="CA Click where to buy button"
                >
                    <Translate id='account.createImplicit.pre.whereToBuy.button' />
                </FormButton>
                <AccountNeedsFunding
                    fundingAddress={implicitAccountId}
                    minDeposit={MIN_BALANCE_TO_CREATE}
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

const mapStateToProps = (state, ownProps) => {
    const { account, status } = state;
    const { match } = ownProps;
    const { params } = match;
    const { accountId, implicitAccountId, recoveryMethod } = params;

    return {
        ...account,
        activeAccountId: account.accountId,
        newAccountId: accountId,
        implicitAccountId,
        recoveryMethod,
        mainLoader: status.mainLoader,
        nearTokenFiatValueUSD: selectNearTokenFiatValueUSD(state)
    };
};

export const SetupImplicitWithRouter = connect(mapStateToProps)(withRouter(SetupImplicit));
