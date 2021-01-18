import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { withRouter } from 'react-router-dom';
import styled from 'styled-components';
import RecoveryMethod from './RecoveryMethod';
import { Translate } from 'react-localize-redux';
import {
    deleteRecoveryMethod,
    loadRecoveryMethods
} from '../../../actions/account';
import SkeletonLoading from '../../common/SkeletonLoading';
import { useRecoveryMethods } from '../../../hooks/recoveryMethods';

const Container = styled.div`

    border: 2px solid #e6e6e6;
    border-radius: 8px;

    > div {
        padding: 15px 20px;
        border-bottom: 2px solid #f8f8f8;

        &:last-of-type {
            border-bottom: 0;
        }
    }

    button, a {
        font-size: 15px;
        width: 100px;
        height: 36px;
        letter-spacing: 1px;
    }
`

const RecoveryContainer = ({ type }) => {
    const [deletingMethod, setDeletingMethod] = useState('');
    const dispatch = useDispatch();
    const account = useSelector(({ account }) => account);
    const status = useSelector(({ status }) => status);
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

    return (
        <Container className='recovery-option'>
            {!status.mainLoader && activeMethods.filter(method => method.kind === type).map((method, i) =>
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
                show={status.mainLoader}
            />
        </Container>
    );
}

export default withRouter(RecoveryContainer);
