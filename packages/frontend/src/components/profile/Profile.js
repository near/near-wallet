import BN from 'bn.js';
import { formatNearAmount } from 'near-api-js/lib/utils/format';
import React, { useEffect, useState } from 'react';
import { Translate } from 'react-localize-redux';
import { useDispatch, useSelector } from 'react-redux';

import { IS_MAINNET, MIN_BALANCE_FOR_GAS } from '../../config';
import { useAccount } from '../../hooks/allAccounts';
import { Mixpanel } from '../../mixpanel/index';
import {
    getLedgerKey,
    checkCanEnableTwoFactor,
    redirectTo,
    refreshAccount,
    transferAllFromLockup,
    getProfileStakingDetails,
    getBalance
} from '../../redux/actions/account';
import { selectProfileBalance } from '../../redux/reducers/selectors/balance';
import {
    selectAccountAuthorizedApps,
    selectAccountHas2fa,
    selectAccountHasLockup,
    selectAccountId,
    selectAccountLedgerKey,
    selectAccountExists,
} from '../../redux/slices/account';
import { selectAllAccountsHasLockup } from '../../redux/slices/allAccounts';
import { actions as recoveryMethodsActions, selectRecoveryMethodsByAccountId } from '../../redux/slices/recoveryMethods';
import { selectNearTokenFiatValueUSD } from '../../redux/slices/tokenFiatValues';
import isMobile from '../../utils/isMobile';
import WalletClass, { wallet } from '../../utils/wallet';
import AlertBanner from '../common/AlertBanner';
import FormButton from '../common/FormButton';
import SkeletonLoading from '../common/SkeletonLoading';
import CheckCircleIcon from '../svg/CheckCircleIcon';
import LockIcon from '../svg/LockIcon';
import UserIcon from '../svg/UserIcon';
import { isAccountBricked } from '../wallet-migration/utils';
import AuthorizedApp from './authorized_apps/AuthorizedApp';
import BalanceContainer from './balances/BalanceContainer';
import LockupAvailTransfer from './balances/LockupAvailTransfer';
import ExportKeyWrapper from './export_private_key/ExportKeyWrapper';
import MobileSharingWrapper from './mobile_sharing/MobileSharingWrapper';
import { Recovery } from './recovery';
import RemoveAccountWrapper from './remove_account/RemoveAccountWrapper';
import TwoFactorAuth from './two_factor/TwoFactorAuth';
import { StyledContainer } from './ui';
import { ZeroBalanceAccountWrapper } from './zero_balance/ZeroBalanceAccountWrapper';

const { fetchRecoveryMethods } = recoveryMethodsActions;

const Profile = ({ match }) => {
    const [transferring, setTransferring] = useState(false);
    const accountExists = useSelector(selectAccountExists);
    const has2fa = useSelector(selectAccountHas2fa);
    const authorizedApps = useSelector(selectAccountAuthorizedApps);
    const ledgerKey = useSelector(selectAccountLedgerKey);
    const loginAccountId = useSelector(selectAccountId);
    const nearTokenFiatValueUSD = useSelector(selectNearTokenFiatValueUSD);
    const accountIdFromUrl = match.params.accountId;
    const accountId = accountIdFromUrl || loginAccountId;
    const isOwner = accountId && accountId === loginAccountId && accountExists;
    const [isBrickedAccount, setIsBrickedAccount] = useState(false);
    const account = useAccount(accountId);
    const dispatch = useDispatch();
    const profileBalance = selectProfileBalance(account);
    const hasLockup = isOwner
        ? useSelector(selectAccountHasLockup)
        : useSelector((state) => selectAllAccountsHasLockup(state, { accountId }));
    const [secretKey, setSecretKey] = useState(null);

    const userRecoveryMethods = useSelector((state) =>
        selectRecoveryMethodsByAccountId(state, { accountId: account.accountId }));

    const twoFactor = has2fa && userRecoveryMethods &&
        userRecoveryMethods.filter((m) => m.kind.includes('2fa'))[0];

    useEffect(() => {
        if (!loginAccountId) {
            return;
        }

        if (accountIdFromUrl && accountIdFromUrl !== accountIdFromUrl.toLowerCase()) {
            dispatch(redirectTo(`/profile/${accountIdFromUrl.toLowerCase()}`));
        }

        (async () => {
            if (isOwner) {
                await dispatch(fetchRecoveryMethods({ accountId }));
                if (!ledgerKey) {
                    dispatch(getLedgerKey());
                }
                const balance = await dispatch(getBalance());
                dispatch(checkCanEnableTwoFactor(balance));
                dispatch(getProfileStakingDetails());
            }
        })();
    }, [loginAccountId, isBrickedAccount]);

    useEffect(() => {
        if (isOwner) {
            (async () => {
                const accountKeyType = await wallet.getAccountKeyType(accountId);
                if (accountKeyType === WalletClass.KEY_TYPES.MULTISIG) {
                    let account = await wallet.getAccount(accountId);
                    setIsBrickedAccount(await isAccountBricked(account));
                } else {
                    setIsBrickedAccount(false);
                }
            })();
        }
    }, [accountId]);

    useEffect(() => {
        if (userRecoveryMethods) {
            let id = Mixpanel.get_distinct_id();
            Mixpanel.identify(id);
            Mixpanel.people.set_once({ create_date: new Date().toString(), });
            Mixpanel.people.set({
                relogin_date: new Date().toString(),
                enabled_2FA: account.has2fa
            });
            Mixpanel.alias(accountId);
            userRecoveryMethods.forEach((method) =>
                Mixpanel.people.set({ ['recovery_with_' + method.kind]: true }));
        }
    }, [userRecoveryMethods]);

    useEffect(() => {
        wallet.getLocalKeyPair(accountId).then(async (keyPair) => {
            const isFullAccessKey = keyPair && await wallet.isFullAccessKey(accountId, keyPair);
            setSecretKey(isFullAccessKey ? keyPair.toString() : null);
        });
    }, [userRecoveryMethods]);

    useEffect(() => {
        if (twoFactor) {
            let id = Mixpanel.get_distinct_id();
            Mixpanel.identify(id);
            Mixpanel.people.set({
                create_2FA_at: twoFactor.createdAt,
                enable_2FA_kind: twoFactor.kind,
                enabled_2FA: twoFactor.confirmed
            });
        }
    }, [twoFactor]);

    const handleTransferFromLockup = async () => {
        try {
            setTransferring(true);
            await dispatch(transferAllFromLockup());
            await dispatch(refreshAccount());
            await dispatch(getProfileStakingDetails());
        } finally {
            setTransferring(false);
        }
    };

    const MINIMUM_AVAILABLE_TO_TRANSFER = new BN('10000000000000000000000');
    const hasUnlockedBalance = hasLockup && Boolean(
        new BN(profileBalance.lockupBalance.unlocked.availableToTransfer)
            .gte(MINIMUM_AVAILABLE_TO_TRANSFER)
    );

    const onDisableBrickedAccountComplete = () => setIsBrickedAccount(false);

    return (
        <StyledContainer>
            {isOwner && hasUnlockedBalance && (
                <LockupAvailTransfer
                    available={profileBalance.lockupBalance.unlocked.availableToTransfer || '0'}
                    onTransfer={handleTransferFromLockup}
                    sending={transferring}
                    tokenFiatValue={nearTokenFiatValueUSD}
                />
            )}
            <div className='split'>
                <div className='left'>
                    {accountExists === false && (
                        <AlertBanner
                            title='profile.accountDoesNotExistBanner.desc'
                            data={accountId}
                            theme='light-blue'
                        />
                    )}
                    <h2><UserIcon /><Translate id='profile.pageTitle.default' /></h2>
                    {profileBalance ? (
                        <BalanceContainer
                            account={account}
                            profileBalance={profileBalance}
                            hasLockup={hasLockup}
                            MIN_BALANCE_FOR_GAS_FORMATTED={formatNearAmount(MIN_BALANCE_FOR_GAS)}
                        />
                    ) : (
                        <SkeletonLoading
                            height='323px'
                            show={!profileBalance}
                            number={2}
                        />
                    )}
                    {profileBalance?.lockupIdExists && (
                        <SkeletonLoading
                            height='323px'
                            show={hasLockup === undefined}
                            number={1}
                        />
                    )}
                    {isOwner && authorizedApps?.length ? (
                        <>
                            <hr />
                            <div className='auth-apps'>
                                <h2>
                                    <CheckCircleIcon />
                                    <Translate id='profile.authorizedApps.title' />
                                </h2>
                                <FormButton color='link' linkTo='/authorized-apps'>
                                    <Translate id='button.viewAll' />
                                </FormButton>
                            </div>
                            {authorizedApps.slice(0, 2).map((app, i) => (
                                <AuthorizedApp key={i} app={app} />
                            ))}
                        </>
                    ) : null}
                </div>
                {isOwner && (
                    <div className='right'>
                        <Recovery
                            account={account}
                            userRecoveryMethods={userRecoveryMethods}
                            twoFactor={twoFactor}
                        />
                        {twoFactor && (
                            <>
                                <hr />
                                <h2>
                                    <LockIcon />
                                    <Translate id='profile.twoFactor' />
                                </h2>
                                {account.canEnableTwoFactor !== null ? (
                                    <>
                                        <div className='sub-heading'>
                                            <Translate id='profile.twoFactorDesc' />
                                        </div>
                                        <TwoFactorAuth
                                            twoFactor={twoFactor}
                                            isBrickedAccount={isBrickedAccount}
                                            onDisableBrickedAccountComplete={onDisableBrickedAccountComplete}
                                        />
                                    </>
                                ) : (
                                    <SkeletonLoading
                                        height='80px'
                                        show={true}
                                    />
                                )}
                            </>
                        )}
                        <>
                            <hr />
                            {secretKey ? <ExportKeyWrapper secretKey={secretKey} /> : null}
                            <RemoveAccountWrapper />
                        </>
                        {!IS_MAINNET && !account.ledgerKey && !isMobile() &&
                            <MobileSharingWrapper />
                        }
                    </div>
                )}
                {accountExists === false && !accountIdFromUrl && (
                    <div className='right'>
                        <RemoveAccountWrapper />
                    </div>
                )}
            </div>
            <ZeroBalanceAccountWrapper />
        </StyledContainer>
    );
};

export default Profile;
