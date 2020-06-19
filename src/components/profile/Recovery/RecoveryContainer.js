import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { withRouter } from 'react-router-dom';
import styled from 'styled-components';
import RecoveryMethod from './RecoveryMethod';
import RecoveryIcon from '../../../images/icon-recovery-grey.svg';
import ErrorIcon from '../../../images/icon-problems.svg';
import { Translate } from 'react-localize-redux';
import {
    deleteRecoveryMethod,
    loadRecoveryMethods,
    sendNewRecoveryLink
} from '../../../actions/account';
import SkeletonLoading from '../../common/SkeletonLoading';
import { useRecoveryMethods } from '../../../hooks/recoveryMethods';

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

    button, a {
        font-size: 14px;
        width: 100px;
        font-weight: 500;
        height: 40px;
        letter-spacing: 0.5px;
    }
`

const Header = styled.div`
    padding: 20px !important;
`

const Title = styled.h2`
    display: flex;
    align-items: center;

    &:before {
        content: '';
        background: center center no-repeat url(${RecoveryIcon});
        width: 28px;
        height: 28px;
        display: inline-block;
        margin-right: 10px;
        margin-top: -3px;
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

const RecoveryContainer = () => {
    
    const [deletingMethod, setDeletingMethod] = useState('');
    const [resendingLink, setResendingLink] = useState('');

    const dispatch = useDispatch();
    const account = useSelector(({ account }) => account);
    const accountId = account.accountId;
    const activeMethods = useRecoveryMethods(accountId).filter(method => method.confirmed);

    const allKinds = ['email', 'phone', 'phrase'];
    const activeKinds = activeMethods.map(method => method.kind)
    const uniqueActiveKinds = [...new Set(activeKinds)]

    const loading = account.actionsPending.includes('LOAD_RECOVERY_METHODS') || account.actionsPending.includes('REFRESH_ACCOUNT');

    const handleDeleteMethod = async (method) => {

        setDeletingMethod(method.publicKey)
        const { error } = await dispatch(deleteRecoveryMethod(method))

        if (!error) {
            dispatch(loadRecoveryMethods())
        }

        setDeletingMethod('')
    }

    const handleResendLink = async (method) => {

        setResendingLink(method.publicKey)
        const { error } = await dispatch(sendNewRecoveryLink(method))

        if (!error) {
            dispatch(loadRecoveryMethods())
        }

        setResendingLink('')
    }

    if (!allKinds.every(i => uniqueActiveKinds.includes(i))) {
        if (!uniqueActiveKinds.includes('email')) {
            activeMethods.push({kind:'email'})
        }
        if (!uniqueActiveKinds.includes('phone')) {
            activeMethods.push({kind:'phone'})
        }
        if (!uniqueActiveKinds.includes('phrase')) {
            activeMethods.push({kind:'phrase'})
        }
    }

    const sortedActiveMethods = activeMethods.sort((a, b) => {
        let kindA = a.kind
        let kindB = b.kind
        if (kindA < kindB) {
            return -1;
        }
        if (kindA > kindB) {
            return 1;
        }
        return 0;
    });

    return (
        <Container>
            <Header>
                <Title><Translate id='recoveryMgmt.title' /></Title>
                {!loading && !sortedActiveMethods.some(method => method.publicKey) &&
                    <NoRecoveryMethod>
                        <Translate id='recoveryMgmt.noRecoveryMethod' />
                    </NoRecoveryMethod>
                }
            </Header>
            {!loading && sortedActiveMethods.map((method, i) =>
                <RecoveryMethod
                    key={i}
                    method={method}
                    accountId={accountId}
                    resendingLink={resendingLink === method.publicKey}
                    deletingMethod={deletingMethod === method.publicKey}
                    onResend={() => handleResendLink(method)}
                    onDelete={() => handleDeleteMethod(method)}
                />
            )}
            <SkeletonLoading
                height='50px'
                number={3}
                show={loading}
            />
        </Container>
    );
}

export default withRouter(RecoveryContainer);