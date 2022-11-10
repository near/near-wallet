import React, {useCallback, useEffect, useState} from 'react';
import { Translate } from 'react-localize-redux';
import {useDispatch, useSelector} from 'react-redux';

import { Mixpanel } from '../../../mixpanel';
import { deleteRecoveryMethod, redirectTo } from '../../../redux/actions/account';
import { selectAccountLedgerKey } from '../../../redux/slices/account';
import {
    actions as recoveryMethodsActions,
    selectRecoveryMethodsStatus
} from '../../../redux/slices/recoveryMethods';
import Modal from '../../common/modal/Modal';
import Tooltip from '../../common/Tooltip';
import ShieldIcon from '../../svg/ShieldIcon';
import ConfirmDisableMethod from '../ConfirmDisableMethod';
import HardwareDevices from '../HardwareDevices';
import { RecoveryOption } from '../ui';
import { formatCreatedAt } from './lib/format';
import { createUserRecoveryMethodsMap } from './lib/recovery-methods';
import RecoveryMethod from './RecoveryMethod';

const { fetchRecoveryMethods } = recoveryMethodsActions;

const RECOVERY_METHOD = {
    LEDGER: 'ledger',
    PHRASE: 'phrase',
};

// TODO https://mnw.atlassian.net/browse/MNW-213
const SHOULD_SHOW_PASSWORD_PROTECTION = false;

export const Recovery = ({
    account,
    userRecoveryMethods,
    twoFactor
}) => {
    const [recoveryMethodsMap, setMethodsMap] = useState(
        createUserRecoveryMethodsMap(userRecoveryMethods)
    );

    const [showPhraseDisabling, setPhraseDisabling] = useState(false);
    const [isPhraseProcessing, setPhraseProcessing] = useState(false);
    const [showDisabledModal, setShowDisabledModal] = useState(false);

    useEffect(() => {
        /** Cache list for easy access */
        setMethodsMap(createUserRecoveryMethodsMap(userRecoveryMethods));
    }, [userRecoveryMethods]);

    const dispatch = useDispatch();

    const hasLedger = Boolean(recoveryMethodsMap[RECOVERY_METHOD.LEDGER]);
    const ledgerIsConnected = useSelector(selectAccountLedgerKey);
    const hasLedgerButNotConnected = hasLedger && !ledgerIsConnected;

    const phraseMethod = recoveryMethodsMap[RECOVERY_METHOD.PHRASE];

    const loadingStatus = useSelector((state) =>
        selectRecoveryMethodsStatus(state, { accountId: account.accountId }));

    const handleEnableSeedPhrase = useCallback(() => {
        Mixpanel.track('SR-SP Click enable button');
        dispatch(redirectTo(`/set-recovery/${account.accountId}`));
    }, [dispatch, account]);

    const handleDisablePassPhrase = useCallback(async () => {
        const deleteAllowed = Boolean(account.ledgerKey);

        if (!deleteAllowed) {
            setShowDisabledModal(true);

            return;
        }

        setPhraseDisabling(true);
    }, [account]);

    const handlePhraseDelete = useCallback(async () => {
        setPhraseProcessing(true);
        await Mixpanel.withTracking(
            'SR-SP Delete method',
            async () => await dispatch(
                deleteRecoveryMethod(phraseMethod, true)
            )
        );

        dispatch(fetchRecoveryMethods({
            accountId: account.accountId
        }));
        setPhraseProcessing(false);
    }, [account, phraseMethod]);

    const handleModalClose = useCallback(() => {
        setShowDisabledModal(false);
    }, []);

    const handleEnablePassword = useCallback(() => {
        //  TODO https://mnw.atlassian.net/browse/MNW-213
    }, []);

    const handleDisablePassword = useCallback(() => {
        // TODO https://mnw.atlassian.net/browse/MNW-213
    }, []);

    return (
        <>
            <h2>
                <ShieldIcon />
                <Translate id='profile.security.title' />
            </h2>
            <h4>
                <Translate id='profile.security.mostSecure' />
                <Tooltip translate='profile.security.mostSecureDesc' icon='icon-lg' />
            </h4>

            {!twoFactor && (
                <HardwareDevices
                    recoveryMethods={userRecoveryMethods}
                    hasLedger={hasLedger}
                    ledgerIsConnected={ledgerIsConnected}
                    hasLedgerButNotConnected={hasLedgerButNotConnected}
                />
            )}
            {SHOULD_SHOW_PASSWORD_PROTECTION && (
                <RecoveryOption>
                    <Translate>
                        {({ translate }) => (
                            <RecoveryMethod
                                title={translate('passwordProtection.title')}
                                description={translate('passwordProtection.description')}
                                methodEnabled={false}
                                onEnable={handleEnablePassword}
                                onDisable={handleDisablePassword}
                            />
                        )}
                    </Translate>
                </RecoveryOption>
            )}
            <h4>
                <Translate id='profile.security.lessSecure' />
                <Tooltip
                    translate='profile.security.lessSecureDesc'
                    icon='icon-lg' />
            </h4>
            <RecoveryOption>
                <RecoveryMethod
                    title={
                        <Translate id='recoveryMgmt.methodTitle.phrase' />
                    }
                    description={phraseMethod?.confirmed ?
                        (
                            <>
                                <Translate id='recoveryMgmt.enabled'/>&nbsp;
                                {formatCreatedAt(phraseMethod?.createdAt)}
                            </>
                        ) : null
                    }
                    methodEnabled={phraseMethod?.confirmed}
                    skeleton={loadingStatus.isInitialized ? undefined : '80px'}
                    onEnable={handleEnableSeedPhrase}
                    onDisable={handleDisablePassPhrase}
                />
                { showPhraseDisabling && (
                    <ConfirmDisableMethod
                        title={<Translate id='recoveryMgmt.disableTitle' />}
                        description={<Translate id='recoveryMgmt.disableTextPhrase' />}
                        isProcessing={isPhraseProcessing}
                        isOpen={showPhraseDisabling}
                        onClose={() => setPhraseDisabling(false)}
                        onSubmit={handlePhraseDelete}
                    />
                )}
            </RecoveryOption>
            {showDisabledModal && (
                <Modal
                    isOpen={showDisabledModal}
                    onClose={handleModalClose}>
                    <Translate id='recoveryMgmt.disableNotAllowed' />
                </Modal>
            )}
        </>
    );
};
