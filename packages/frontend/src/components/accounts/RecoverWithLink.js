import React, { Component } from 'react';
import { Translate } from 'react-localize-redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import styled from 'styled-components';

import { DISABLE_CREATE_ACCOUNT } from '../../config';
import { Mixpanel } from '../../mixpanel/index';
import { 
    recoverAccountSeedPhrase,
    refreshAccount,
    redirectTo,
    clearAccountState,
    makeAccountActive,
} from '../../redux/actions/account';
import { selectAccountId, selectAccountSlice } from '../../redux/slices/account';
import { selectAvailableAccounts } from '../../redux/slices/availableAccounts';
import { selectActionsPending, selectStatusMainLoader } from '../../redux/slices/status';
import copyText from '../../utils/copyText';
import isMobile from '../../utils/isMobile';
import Button from '../common/Button';
import FormButton from '../common/FormButton';
import { Snackbar, snackbarDuration } from '../common/Snackbar';
import Container from '../common/styled/Container.css';

const StyledContainer = styled.div`
    margin-top: 5px;

    @media (min-width: 768px) {
        margin-top: 32px;
    }

    button {
        width: 100%;
    }
    
    &.error {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding-top: 50px;
        text-align: center;

        div {
            @media (min-width: 768px) {
                max-width: 800px;
            }
        }

        button {
            margin-top: 35px;
            @media (min-width: 768px) {
                max-width: 300px;
            }
        }
    }
`;

const Title = styled.h1`
    margin-bottom: 10px;
    
    @media (min-width: 768px) {
        margin-bottom: 0;
    }
`;

const Desc = styled.div`
    color: #4a4f54;
    font-size: 18px;
    line-height: normal;
    margin-top: ${(props) => props.last ? '20px' : '0'};

    @media (min-width: 768px) {
        font-size: 28px;
    }
`;

const UserName = styled.span`
    color: #24272a;
    background-color: #f8f8f8;
    padding: 5px;
`;

const ButtonWrapper = styled.div`
    display: flex;
    flex-direction: column;
    margin-top: 30px;

    @media (min-width: 768px) {
        flex-direction: row;
    }

    button {

        @media (min-width: 768px) {
            max-width: 300px;
        }

        &:first-of-type {
            margin-top: 0 !important;
        }

        &:last-of-type {
            margin-top: 25px;
            position: relative;
            overflow: hidden;

            @media (min-width: 768px) {
                margin-left: 25px;
                margin-top: 0;
            }

            color: #6AD1E3;
            border: 2px solid #6AD1E3;
            background-color: white;

            &:hover {
                color: white;
                background-color: #6AD1E3;
            }
        }
    }
`;

const RecoverUrl = styled.div`
    position: absolute;
    z-index: -1;
    text-transform: initial;
`;

class RecoverWithLink extends Component {
    constructor(props) {
        super(props);

        this.recoverUrl = React.createRef();

        this.state = {
            accountId: this.props.accountId,
            isSwitchingAccount: false,
            seedPhrase: this.props.seedPhrase,
            successSnackbar: false,
            successView: true
        };
    }

    handleCopyUrl = () => {
        Mixpanel.track('IE with link Click copy url button');
        if (navigator.share && isMobile()) {
            navigator.share({
                url: window.location.href
            }).catch((err) => {
                console.log(err.message);
            });
        } else {
            this.handleCopyDesktop();
        }
    }

    handleCopyDesktop = () => {
        copyText(this.recoverUrl.current);
        this.setState({ successSnackbar: true }, () => {
            setTimeout(() => {
                this.setState({ successSnackbar: false });
            }, snackbarDuration);
        });
    }

    handleContinue = async () => {
        await Mixpanel.withTracking('IE Recover with link', 
            async () => {
                await this.props.recoverAccountSeedPhrase(this.state.seedPhrase, this.props.match.params.accountId, false);
                this.props.refreshAccount();
                this.props.redirectTo('/');
                this.props.clearAccountState();
            },
            () => {
                this.setState({ successView: false });
            }
        );
    }

    componentDidUpdate() {
        const { accountId, isSwitchingAccount } = this.state;
        const { isAccountActive, isAccountAvailable } = this.props;

        // redirect user to home page if active account is being recovered
        // switch to account being recovered if already in the set of available accounts
        if (isAccountActive) {
            this.props.redirectTo('/');
        } else if (isAccountAvailable && !isSwitchingAccount) {
            // reset flag to ensure account switch is only dispatched once
            this.setState({ isSwitchingAccount: true });
            this.props.makeAccountActive(accountId);
            this.props.refreshAccount();
        }
    }

    render() {
        const { accountId, successSnackbar, successView } = this.state;
        const { mainLoader, history, continueSending } = this.props;

        if (successView) {
            return (
              <Container>
                    <Translate>
                    {({ translate }) => (
                        <StyledContainer className='ui container'>
                            <Title>{translate('recoverWithLink.title')}</Title>
                            <Desc>{translate('recoverWithLink.pOne')} <UserName>{accountId}</UserName></Desc>
                            <Desc last>{translate('recoverWithLink.pTwo')}</Desc>
                            <ButtonWrapper>
                                <FormButton
                                    onClick={this.handleContinue}
                                    disabled={mainLoader}
                                    sending={continueSending}
                                    sendingString='button.recovering'
                                >
                                    {translate('button.continue')}
                                </FormButton>
                                <Button onClick={this.handleCopyUrl}>
                                    {translate('button.copyUrl')}
                                    <RecoverUrl ref={this.recoverUrl}>{window.location.href}</RecoverUrl>
                                </Button>
                            </ButtonWrapper>
                            <Snackbar
                                theme='success'
                                message={translate('recoverWithLink.snackbarCopySuccess')}
                                show={successSnackbar}
                                onHide={() => this.setState({ successSnackbar: false })}
                            />
                        </StyledContainer>
                    )}
                </Translate>
              </Container>
            );
        } else {
            return (
               <Container>
                    <Translate>
                    {({ translate }) => (
                        <Container className='ui container error'>
                            <Title>{translate('recoverWithLink.errorTitle')}</Title>
                            <Desc>{translate('recoverWithLink.errorP')}</Desc>
                            {!DISABLE_CREATE_ACCOUNT &&
                                <Button onClick={() => {
                                    Mixpanel.track('IE with link expired click create button');
                                    history.push('/create');
                                }}>
                                    {translate('button.createAccount')}
                                </Button>
                            }
                        </Container>
                    )}
                </Translate>
               </Container>
            );
        }
    }
}

const mapDispatchToProps = {
    recoverAccountSeedPhrase,
    refreshAccount,
    redirectTo,
    clearAccountState,
    makeAccountActive,
};

const mapStateToProps = (state, { match }) => ({
    ...selectAccountSlice(state),
    accountId: match.params.accountId,
    seedPhrase: match.params.seedPhrase,
    mainLoader: selectStatusMainLoader(state),
    continueSending: selectActionsPending(state, { types: ['RECOVER_ACCOUNT_SEED_PHRASE'] }),
    isAccountActive: selectAccountId(state) === match.params.accountId,
    isAccountAvailable: selectAvailableAccounts(state).some((accountId) => accountId === match.params.accountId),
});

export const RecoverWithLinkWithRouter = connect(
    mapStateToProps, 
    mapDispatchToProps
)(withRouter(RecoverWithLink));
