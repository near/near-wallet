import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { withRouter } from 'react-router-dom';
import styled from 'styled-components';

import { DISABLE_PHONE_RECOVERY } from '../../../config';
import { Mixpanel } from '../../../mixpanel/index';
import { deleteRecoveryMethod } from '../../../redux/actions/account';
import selectRecoveryLoader from '../../../redux/crossStateSelectors/selectRecoveryLoader';
import { selectAccountSlice } from '../../../redux/slices/account';
import { actions as recoveryMethodsActions } from '../../../redux/slices/recoveryMethods';
import { selectStatusMainLoader } from '../../../redux/slices/status';
import SkeletonLoading from '../../common/SkeletonLoading';
import RecoveryMethod from './RecoveryMethod';

const { fetchRecoveryMethods } = recoveryMethodsActions;

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
    }
`;

const RecoveryContainer = ({ type, recoveryMethods }) => {
    const [deletingMethod, setDeletingMethod] = useState('');
    const dispatch = useDispatch();
    const account = useSelector(selectAccountSlice);
    const mainLoader = useSelector(selectStatusMainLoader);
    let userRecoveryMethods = recoveryMethods || [];
    const allKinds = ['email', 'phone', 'phrase'];
    const activeMethods = userRecoveryMethods.filter(({ kind }) => allKinds.includes(kind));
    const currentActiveKinds = new Set(activeMethods.map((method) => method.kind));
    const missingKinds = allKinds.filter((kind) => !currentActiveKinds.has(kind));
    const deleteAllowed = [...currentActiveKinds].length > 1 || account.ledgerKey;
    missingKinds.forEach((kind) => activeMethods.push({ kind: kind }));
    const recoveryLoader = useSelector((state) => selectRecoveryLoader(state, { accountId: account.accountId }));

    const handleDeleteMethod = async (method) => {
        try {
            setDeletingMethod(method.publicKey);
            await Mixpanel.withTracking(method.kind === 'phrase' ? 'SR-SP Delete method' : `SR ${method.kind} Delete method`,
                async () => await dispatch(deleteRecoveryMethod(method, deleteAllowed))
            );
        } finally {
            setDeletingMethod('');
        }
        dispatch(fetchRecoveryMethods({ accountId: account.accountId }));
    };

    if (!recoveryLoader) {
        const currentTypeEnabledMethods = activeMethods.filter(({ kind, publicKey }) => {
            if (DISABLE_PHONE_RECOVERY && kind === 'phone' && !publicKey) {
                return false;
            }

            return kind === type;
        });

        if (currentTypeEnabledMethods.length === 0) { return null; }

        return (
            <Container className='recovery-option'>
                {currentTypeEnabledMethods
                    .map((method, i) => {

                            return <RecoveryMethod
                                key={i}
                                method={method}
                                accountId={account.accountId}
                                deletingMethod={deletingMethod === method.publicKey}
                                onDelete={() => handleDeleteMethod(method)}
                                deleteAllowed={deleteAllowed}
                                mainLoader={mainLoader}
                            />;
                        }
                    )}
            </Container>
        );
    } else {
        return (
            <SkeletonLoading
                height='80px'
                show={recoveryLoader}
            />
        );
    }
};

export default withRouter(RecoveryContainer);
