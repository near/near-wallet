import React, { Component } from 'react';
import { Translate } from 'react-localize-redux';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { checkNearDropBalance, claimLinkdropToAccount, redirectTo, handleRefreshUrl } from '../../actions/account';
import { clearLocalAlert } from '../../actions/status';
import { Mixpanel } from '../../mixpanel/index';
import { actionsPending } from '../../utils/alerts';
import AccountDropdown from '../common/AccountDropdown';
import Balance from '../common/Balance';
import FormButton from '../common/FormButton';
import Container from '../common/styled/Container.css';
import BrokenLinkIcon from '../svg/BrokenLinkIcon';
import NearGiftIcons from '../svg/NearGiftIcons';

const StyledContainer = styled(Container)`
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;

    .near-balance {
        color: #0072CE;
        font-weight: 600;
        border: 1px solid #D6EDFF;
        border-radius: 4px;
        padding: 6px 15px;
        background-color: #F0F9FF;
        margin: 30px 0;
    }

    .desc {
        color: #72727A;
        margin-bottom: 40px;
    }

    h3 {
        margin-top: 40px;
    }

    .or {
        color: #A2A2A8;
        margin: 20px 0 -6px 0;
    }

    button {
        width: 100% !important;
    }

    .account-dropdown-container {
        width: 100%;
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
`;

class LinkdropLanding extends Component {
    state = {
        balance: null,
        invalidNearDrop: null
    }

    componentDidMount() {
        const { fundingContract, fundingKey, handleRefreshUrl } = this.props;
        if (fundingContract && fundingKey) {
            this.handleCheckNearDropBalance();
            handleRefreshUrl();
        }
    }

    handleCheckNearDropBalance = async () => {
        const { fundingContract, fundingKey, checkNearDropBalance } = this.props;
        await Mixpanel.withTracking("CA Check near drop balance",
            async () => {
                const balance = await checkNearDropBalance(fundingContract, fundingKey);
                this.setState({ balance: balance });
            },
            () => this.setState({ invalidNearDrop: true })
        );
    }

    handleClaimNearDrop = async () => {
        const { fundingContract, fundingKey, redirectTo, claimLinkdropToAccount, accountId, url } = this.props;
        await claimLinkdropToAccount(fundingContract, fundingKey);
        localStorage.setItem('linkdropAmount', this.state.balance);
        if (url?.redirectUrl) {
            window.location = `${url.redirectUrl}?accountId=${accountId}`;
        } else {
            redirectTo('/');
        }
    }

    render() {
        const { fundingContract, fundingKey, accountId, mainLoader, history } = this.props;
        const { balance, invalidNearDrop } = this.state;
        const claimingDrop = actionsPending('CLAIM_LINKDROP_TO_ACCOUNT');
        const fundingAmount = balance;

        if (!invalidNearDrop) {
            const params = new URLSearchParams(history.location.search);
            const redirectUrl = params.has('redirectUrl') ? `&redirectUrl=${encodeURIComponent(params.get('redirectUrl'))}` : '';

            return (
                <StyledContainer className='xs-centered'>
                    <NearGiftIcons/>
                    <h3><Translate id='linkdropLanding.title'/></h3>
                    <div className='near-balance'>
                        <Balance amount={balance} symbol='near'/>
                    </div>
                    <div className='desc'>
                        <Translate id='linkdropLanding.desc'/>
                    </div>
                    {accountId ? <AccountDropdown disabled={claimingDrop}/> : null}
                    {accountId ?
                        <FormButton
                            onClick={this.handleClaimNearDrop}
                            sending={claimingDrop}
                            disabled={mainLoader}
                            sendingString='linkdropLanding.claiming'
                        >
                            <Translate id='linkdropLanding.ctaAccount'/>
                        </FormButton>
                        :
                        <FormButton
                            linkTo={`/recover-account?fundingOptions=${encodeURIComponent(JSON.stringify({ fundingContract, fundingKey, fundingAmount }))}${redirectUrl}`}
                        >
                            <Translate id='linkdropLanding.ctaLogin'/>
                        </FormButton>
                    }
                    <div className='or'><Translate id='linkdropLanding.or'/></div>
                    <FormButton color='gray-blue' disabled={claimingDrop} linkTo={`/create/${fundingContract}/${fundingKey}?redirect=false`}>
                        <Translate id='linkdropLanding.ctaNew'/>
                    </FormButton>
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
    clearLocalAlert,
    checkNearDropBalance,
    claimLinkdropToAccount,
    redirectTo,
    handleRefreshUrl
};

const mapStateToProps = ({ account, status }, { match }) => ({
    ...account,
    fundingContract: match.params.fundingContract,
    fundingKey: match.params.fundingKey,
    mainLoader: status.mainLoader
});

export const LinkdropLandingWithRouter = connect(
    mapStateToProps,
    mapDispatchToProps
)(LinkdropLanding);
