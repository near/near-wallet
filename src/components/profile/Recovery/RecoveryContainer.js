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
import {
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

    componentDidMount = () => {
        this.props.loadRecoveryMethods()
    }

    handleEnableMethod = (method) => {
        const { history, account: { accountId } } = this.props;

        history.push(`${method !== 'phrase' ? '/set-recovery/' : '/setup-seed-phrase/'}${accountId}`);
    }

    handleDeleteMethod = (method) => {
        const { deleteRecoveryMethod, loadRecoveryMethods } = this.props;

        this.setState({ deletingMethod: method.detail })
        deleteRecoveryMethod(method)
            .then(({ error }) => {
                if (error) return
                loadRecoveryMethods();
                this.setState({ deletingMethod: '' });
        })
    }

    handleResendLink = (method) => {
        const { account: { accountId }, sendNewRecoveryLink, loadRecoveryMethods } = this.props;
        
        this.setState({ resendingLink: method.detail })
        sendNewRecoveryLink(method)
            .then(({ error }) => {
                if (error) return

                loadRecoveryMethods();
                this.setState({ successSnackbar: true, resendingLink: '' }, () => {
                    setTimeout(() => {
                        this.setState({successSnackbar: false});
                    }, snackbarDuration)
                });
            })
    }
 
    render() {
        const { recoveryMethods = [], account, account: { accountId } } = this.props;
        const activeMethods = recoveryMethods.filter(method => method.confirmed);
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
    deleteRecoveryMethod,
    loadRecoveryMethods,
    sendNewRecoveryLink
}

const mapStateToProps = ({ account, recoveryMethods }) => ({
    account,
    recoveryMethods: recoveryMethods[account.accountId]
})

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(RecoveryContainer));
