import BN from 'bn.js';
import { formatNearAmount } from 'near-api-js/lib/utils/format';
import React, { useEffect, useState } from 'react';
import { Translate } from 'react-localize-redux';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';

import { IMPORT_ZERO_BALANCE_ACCOUNT } from '../../../../../features';
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
    selectAccountExists
} from '../../redux/slices/account';
import { selectAllAccountsHasLockup } from '../../redux/slices/allAccounts';
import { actions as recoveryMethodsActions, selectRecoveryMethodsByAccountId } from '../../redux/slices/recoveryMethods';
import { selectNearTokenFiatValueUSD } from '../../redux/slices/tokenFiatValues';
import isMobile from '../../utils/isMobile';
import { wallet } from '../../utils/wallet';
import AlertBanner from '../common/AlertBanner';
import FormButton from '../common/FormButton';
import SkeletonLoading from '../common/SkeletonLoading';
import Container from '../common/styled/Container.css';
import Tooltip from '../common/Tooltip';
import CheckCircleIcon from '../svg/CheckCircleIcon';
import LockIcon from '../svg/LockIcon';
import ShieldIcon from '../svg/ShieldIcon';
import UserIcon from '../svg/UserIcon';
import AuthorizedApp from './authorized_apps/AuthorizedApp';
import BalanceContainer from './balances/BalanceContainer';
import LockupAvailTransfer from './balances/LockupAvailTransfer';
import ExportKeyWrapper from './export_private_key/ExportKeyWrapper';
import HardwareDevices from './hardware_devices/HardwareDevices';
import MobileSharingWrapper from './mobile_sharing/MobileSharingWrapper';
import RecoveryContainer from './Recovery/RecoveryContainer';
import RemoveAccountWrapper from './remove_account/RemoveAccountWrapper';
import TwoFactorAuth from './two_factor/TwoFactorAuth';
import { ZeroBalanceAccountWrapper } from './zero_balance/ZeroBalanceAccountWrapper';

const { fetchRecoveryMethods } = recoveryMethodsActions;

const StyledContainer = styled(Container)`
    @media (max-width: 991px) {
        .right {
            margin-top: 50px;
        }
    }
    h2 {
        font-weight: 900 !important;
        font-size: 22px !important;
        margin: 10px 0;
        text-align: left !important;
        line-height: 140% !important;
        display: flex;
        align-items: center;
        color: #24272a !important;
        svg {
            margin-right: 15px;
            &.user-icon {
                margin-right: 10px;
            }
            .background {
                display: none;
            }
        }
    }
    .left, .right {
        .animation-wrapper {
            border-radius: 8px;
            overflow: hidden;
        }
    }
    .left {
        @media (min-width: 992px) {
            > hr {
                margin: 50px 0px 30px 0px;
            }
        }
        .animation-wrapper {
            margin-top: 50px;
            :last-of-type {
                margin-top: 30px;
            }
        }
        .tooltip {
            margin-bottom: -1px;
        }
    }
    .right {
        > h4 {
            margin: 50px 0 20px 0;
            display: flex;
            align-items: center;
        }
        .recovery-option,
        .animation-wrapper {
            margin-top: 10px;
        }
        > button {
            &.gray-blue {
                width: 100%;
                margin-top: 30px;
            }
        }
    }
    hr {
        border: 1px solid #F0F0F0;
        margin: 50px 0 40px 0;
    }
    .sub-heading {
        margin: 20px 0;
        color: #72727A;
    }
    .auth-apps {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 35px;
        button {
            &.link {
                text-decoration: none !important;
                white-space: nowrap;
            }
        }
    }
    .authorized-app-box {
        margin-top: 20px !important;
    }
`;

export function Profile({ match }) {
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
    const account = useAccount(accountId);
    const dispatch = useDispatch();
    const profileBalance = selectProfileBalance(account);
    const hasLockup = isOwner
        ? useSelector(selectAccountHasLockup)
        : useSelector((state) => selectAllAccountsHasLockup(state, { accountId }));
    const [secretKey, setSecretKey] = useState(null);

    const userRecoveryMethods = useSelector((state) => selectRecoveryMethodsByAccountId(state, { accountId: account.accountId }));
    const twoFactor = has2fa && userRecoveryMethods && userRecoveryMethods.filter((m) => m.kind.includes('2fa'))[0];

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
    }, [loginAccountId]);

    useEffect(() => {
        if (userRecoveryMethods) {
            let id = Mixpanel.get_distinct_id();
            Mixpanel.identify(id);
            Mixpanel.people.set_once({create_date: new Date().toString(),});
            Mixpanel.people.set({
                relogin_date: new Date().toString(),
                enabled_2FA: account.has2fa
            });
            Mixpanel.alias(accountId);
            userRecoveryMethods.forEach((method) => Mixpanel.people.set({ ['recovery_with_' + method.kind]: true }));
        }
    },[userRecoveryMethods]);

    useEffect(() => {
        wallet.getLocalKeyPair(accountId).then(async (keyPair) => {
            const isFullAccessKey = keyPair && await wallet.isFullAccessKey(accountId, keyPair);
            setSecretKey(isFullAccessKey ? keyPair.toString() : null);
        });
    },[userRecoveryMethods]);

    useEffect(()=> {
        if (twoFactor) {
            let id = Mixpanel.get_distinct_id();
            Mixpanel.identify(id);
            Mixpanel.people.set({
                create_2FA_at: twoFactor.createdAt, 
                enable_2FA_kind:twoFactor.kind, 
                enabled_2FA: twoFactor.confirmed});
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

    return (
        <StyledContainer>
            {isOwner && hasLockup && new BN(profileBalance.lockupBalance.unlocked.availableToTransfer).gte(MINIMUM_AVAILABLE_TO_TRANSFER) &&
                <LockupAvailTransfer
                    available={profileBalance.lockupBalance.unlocked.availableToTransfer || '0'}
                    onTransfer={handleTransferFromLockup}
                    sending={transferring}
                    tokenFiatValue={nearTokenFiatValueUSD}
                />
            }
            <div className='split'>
                <div className='left'>
                    {accountExists === false &&
                        <AlertBanner
                            title='profile.accountDoesNotExistBanner.desc'
                            data={accountId}
                            theme='light-blue'
                        />
                    }
                    <h2><UserIcon/><Translate id='profile.pageTitle.default'/></h2>
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
                    {profileBalance?.lockupIdExists &&
                        <SkeletonLoading
                            height='323px'
                            show={hasLockup === undefined}
                            number={1}
                        />
                    }
                    {isOwner && authorizedApps?.length ?
                        <>
                            <hr/>
                            <div className='auth-apps'>
                                <h2><CheckCircleIcon/><Translate id='profile.authorizedApps.title'/></h2>
                                <FormButton color='link' linkTo='/authorized-apps'><Translate id='button.viewAll'/></FormButton>
                            </div>
                            {authorizedApps.slice(0, 2).map((app, i) => (
                                <AuthorizedApp key={i} app={app}/>
                            ))}
                        </>
                        : null
                    }
                </div>
                {isOwner &&
                    <div className='right'>
                        <h2><ShieldIcon/><Translate id='profile.security.title'/></h2>
                        <h4><Translate id='profile.security.mostSecure'/><Tooltip translate='profile.security.mostSecureDesc' icon='icon-lg'/></h4>
                        {!twoFactor && <HardwareDevices recoveryMethods={userRecoveryMethods}/>}
                        <RecoveryContainer type='phrase' recoveryMethods={userRecoveryMethods}/>
                        <h4><Translate id='profile.security.lessSecure'/><Tooltip translate='profile.security.lessSecureDesc' icon='icon-lg'/></h4>
                        <RecoveryContainer type='email' recoveryMethods={userRecoveryMethods}/>
                        <RecoveryContainer type='phone' recoveryMethods={userRecoveryMethods}/>
                        {!account.ledgerKey &&
                            <>
                                <hr/>
                                <h2><LockIcon/><Translate id='profile.twoFactor'/></h2>
                                {account.canEnableTwoFactor !== null ? (
                                    <>
                                        <div className='sub-heading'><Translate id='profile.twoFactorDesc'/></div>
                                        {/* TODO: Also check recovery methods in DB for Ledger */}
                                        <TwoFactorAuth twoFactor={twoFactor}/>
                                    </>
                                ) : (
                                    <SkeletonLoading
                                        height='80px'
                                        show={true}
                                    />
                                )}
                            </>
                        }
                        <>
                            <hr />
                            {secretKey ? <ExportKeyWrapper secretKey={secretKey}/> : null}
                            <RemoveAccountWrapper/>
                        </>
                        {!IS_MAINNET && !account.ledgerKey && !isMobile() &&
                            <MobileSharingWrapper/>
                        }
                    </div>
                }
                {accountExists === false && !accountIdFromUrl &&
                    <div className='right'>
                        <RemoveAccountWrapper/>
                    </div>
                }
            </div>
            {IMPORT_ZERO_BALANCE_ACCOUNT &&
                <ZeroBalanceAccountWrapper/>
            }
        </StyledContainer>
    );
}
