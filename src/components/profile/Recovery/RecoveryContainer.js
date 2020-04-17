import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import styled from 'styled-components';
import ActiveMethod from './ActiveMethod';
import InactiveMethod from './InactiveMethod';
import RecoveryIcon from '../../../images/icon-recovery-grey.svg';
import ErrorIcon from '../../../images/icon-problems.svg';
import { Snackbar, snackbarDuration } from '../../common/Snackbar';
import { Translate } from 'react-localize-redux';
import { generateSeedPhrase } from 'near-seed-phrase';
import {
    setupRecoveryMessage,
    deleteRecoveryMethod,
    loadRecoveryMethods,
    sendNewRecoveryLink
} from '../../../actions/account';
import SkeletonLoading from '../../common/SkeletonLoading';

const Container = styled.div`

    border: 2px solid #e6e6e6;
    border-radius: 6px;

    > div {
        padding: 15px 20px;
        border-bottom: 2px solid #f8f8f8;

        &:last-of-type {
            border-bottom: 0;
        }
    }

    button {
        font-size: 14px;
        width: 100px;
        font-weight: 600;
        height: 40px;
        letter-spacing: 0.5px;
    }

`

const Header = styled.div`
    padding: 20px !important;
`

const Title = styled.div`
    font-family: BwSeidoRound;
    color: #24272a;
    font-size: 22px;
    display: flex;
    align-items: center;

    &:before {
        content: '';
        background: center center no-repeat url(${RecoveryIcon});
        width: 28px;
        height: 28px;
        display: inline-block;
        margin-right: 10px;
        margin-top: -2px;
    }
`

const NoRecoveryMethod = styled.div`
    margin-top: 15px;
    color: #FF585D;
    display: flex;
    align-items: center;

    &:before {
        content: '';
        background: center center no-repeat url(${ErrorIcon});
        min-width: 28px;
        width: 28px;
        min-height: 28px;
        height: 28px;
        display: block;
        margin-right: 10px;
    }
`

class RecoveryContainer extends Component {

    state = {
        successSnackbar: false,
        deletingMethod: '',
        resendingLink: ''
    };

    handleEnableMethod = (method) => {
        const { history, accountId } = this.props;

        history.push(`${method !== 'phrase' ? '/set-recovery/' : '/setup-seed-phrase/'}${accountId}`);
    }

    handleDeleteMethod = (method) => {
        const { deleteRecoveryMethod, loadRecoveryMethods, accountId } = this.props;

        this.setState({ deletingMethod: method.kind })
        deleteRecoveryMethod(method)
            .then(({ error }) => {
                if (error) return
                loadRecoveryMethods(accountId);
                this.setState({ deletingMethod: '' });
        })
    }

    handleResendLink = (method) => {
        const { seedPhrase, publicKey } = generateSeedPhrase();
        const { accountId, sendNewRecoveryLink, loadRecoveryMethods } = this.props;
        const { kind, detail } = method;
        let phoneNumber, email;

        if (kind === 'email') {
            email = detail;
        } else if (kind === 'phone') {
            phoneNumber = detail;
        }

        this.setState({ resendingLink: method.kind })
        sendNewRecoveryLink({ accountId, phoneNumber, email, publicKey, seedPhrase, method })
            .then(({ error }) => {
                if (error) return

                loadRecoveryMethods(accountId);
                this.setState({ successSnackbar: true, resendingLink: '' }, () => {
                    setTimeout(() => {
                        this.setState({successSnackbar: false});
                    }, snackbarDuration)
                });
            })
    }
 
    render() {

        const { activeMethods, account, accountId } = this.props;
        const { deletingMethod, resendingLink, successSnackbar } = this.state;
        const allMethods = ['email', 'phone', 'phrase'];
        const inactiveMethods = allMethods.filter((method) => !activeMethods.map(method => method.kind).includes(method));
        const loading = account.actionsPending.includes('LOAD_RECOVERY_METHODS') || account.actionsPending.includes('REFRESH_ACCOUNT');

        return (
            <Container>
                <Header>
                    <Title><Translate id='recoveryMgmt.title'/></Title>
                    {!activeMethods.length && !loading &&
                        <NoRecoveryMethod>
                            <Translate id='recoveryMgmt.noRecoveryMethod'/>
                        </NoRecoveryMethod>
                    }
                </Header>
                {!loading &&
                    <>
                        {activeMethods.map((method, i) =>
                            <ActiveMethod
                                key={i}
                                data={method}
                                onResend={() => this.handleResendLink(method)}
                                onDelete={() => this.handleDeleteMethod(method)}
                                deletingMethod={deletingMethod}
                                resendingLink={resendingLink}
                                accountId={accountId}
                            />
                        )}
                        {inactiveMethods.map((method, i) =>
                            <InactiveMethod
                                key={i}
                                kind={method}
                                onEnable={() => this.handleEnableMethod(method)}
                            />
                        )}
                    </>
                }
                <SkeletonLoading 
                    height='50px'
                    number={3}
                    show={loading}
                />
                <Snackbar
                    theme='success'
                    message={<Translate id='recoveryMgmt.recoveryLinkSent'/>}
                    show={successSnackbar}
                    onHide={() => this.setState({ successSnackbar: false })}
                />
            </Container>
        );
    }
}

const mapDispatchToProps = {
    setupRecoveryMessage,
    deleteRecoveryMethod,
    loadRecoveryMethods,
    sendNewRecoveryLink
}

const mapStateToProps = ({ account }) => ({
    account
})

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(RecoveryContainer));