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
    loadRecoveryMethods
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
        font-weight: 400;
        width: 100px;
        height: 36px;
        letter-spacing: 1px;
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
    const dispatch = useDispatch();
    const account = useSelector(({ account }) => account);
    const allKinds = ['email', 'phone', 'phrase'];
    const activeMethods = useRecoveryMethods(account.accountId).filter(({ kind }) => allKinds.includes(kind));
    const currentActiveKinds = new Set(activeMethods.map(method => method.kind));
    const missingKinds = allKinds.filter(kind => !currentActiveKinds.has(kind))
    const deleteAllowed = [...currentActiveKinds].length > 1 || account.ledgerKey;

    missingKinds.forEach(kind => activeMethods.push({kind: kind}));

    const handleDeleteMethod = async (method) => {
        try {
            setDeletingMethod(method.publicKey)
            await dispatch(deleteRecoveryMethod(method, deleteAllowed))
        } finally {
            setDeletingMethod('')
        }
        dispatch(loadRecoveryMethods())
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
                {!account.formLoader && !sortedActiveMethods.some(method => method.publicKey) && !account.ledgerKey &&
                    <NoRecoveryMethod>
                        <Translate id='recoveryMgmt.noRecoveryMethod' />
                    </NoRecoveryMethod>
                }
            </Header>
            {!account.formLoader && sortedActiveMethods.map((method, i) =>
                <RecoveryMethod
                    key={i}
                    method={method}
                    accountId={account.accountId}
                    deletingMethod={deletingMethod === method.publicKey}
                    onDelete={() => handleDeleteMethod(method)}
                    deleteAllowed={deleteAllowed}
                />
            )}
            <SkeletonLoading
                height='50px'
                number={3}
                show={account.formLoader}
            />
        </Container>
    );
}

export default withRouter(RecoveryContainer);
