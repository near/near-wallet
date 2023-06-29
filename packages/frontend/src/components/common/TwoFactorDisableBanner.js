import React, { useEffect, useState, useMemo } from 'react';
import { Translate } from 'react-localize-redux';
import { useSelector } from 'react-redux';
import styled from 'styled-components';

import { NETWORK_ID } from '../../config';
import { selectAccountSlice } from '../../redux/slices/account';
import WalletClass, { wallet } from '../../utils/wallet';
import AlertTriangleIcon from '../svg/AlertTriangleIcon';
import LockIcon from '../svg/LockIcon';
import Disable2FAModal from '../wallet-migration/modals/Disable2faModal/Disable2FA';
import { getAccountDetails } from '../wallet-migration/utils';
import FormButton from './FormButton';


const Container = styled.div`
    border: 2px solid #DC1F26;
    border-radius: 16px;
    background-color: #FFFCFC;
    display: flex;
    align-items: flex-start;
    flex-direction: row;
    padding: 25px;
    margin: 25px auto;
    line-height: 1.5;

    @media (min-width: 768px) {
        width: 720px;
    }

    @media (min-width: 992px) {
        width: 920px;
    }

    @media (min-width: 1200px) {
        width: 1000px;
    }


    .alert-container {
        background-color: #FFEFEF;
        border-radius: 50%;
        padding: 9px;
        margin-right: 16px;
        display: flex;
        justify-content: center;
        @media (max-width: 768px) {
            margin: 0 auto 15px;
        }
        .alert-triangle-icon {
            width: 25px;
            height: 25px;
        }
     
    }
    
    .content {
        margin-right: 20px;
    }

    .title {
        font-weight: 700;
        color: #DC1F25;
    }

    .desc {
        margin-top: 10px;
        color: #DC1F25;
    }

    && {
        button {
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 !important;
            height: 40px;
            padding: 8px 16px;
            white-space: nowrap;
            border-radius: 50px;
            font-weight: 600;
            .lock-icon {
                margin: 0;
                margin-right: 10px;
            }
            :hover {
                > svg {
                    path {
                        stroke: #E5484D;
                    }
                }
            }
        }

        @media (max-width: 767px) {
            button {
                width: 100%;
                margin-top: 25px !important;
            }
        }
    }

    @media (max-width: 767px) {
        flex-direction: column;
    }
`;

export default function TwoFactorDisableBanner() {
    const [accounts, setAccounts] = useState([]);
    const [showDisable2FAModal, setShowDisable2FAModal] = useState(false);

    const account = useSelector(selectAccountSlice);
    const loadedAccounts = useMemo(() => Object.keys(account.accounts ?? {}), [account.accounts]);

    const showModal = () => setShowDisable2FAModal(true);
    const hideModal = () => setShowDisable2FAModal(false);

    useEffect(() => {
        const update2faAccounts = async () => {
            const accounts = await wallet.keyStore.getAccounts(NETWORK_ID);
            const accountsKeyTypes = await Promise.all(
                accounts.map((accountId) => getAccountDetails({ accountId, wallet }))
            );

            setAccounts(accountsKeyTypes.reduce(
                (acc, account) => account.keyType === WalletClass.KEY_TYPES.MULTISIG ? [...acc, account] : acc,
                []
            ));
        };
        if (loadedAccounts.length > 0 && accounts.map(({ accountId }) => accountId).sort() !== loadedAccounts.sort()) {
            update2faAccounts();
        }
    }, [showDisable2FAModal, loadedAccounts.length]);

    const accountsCount = accounts.length;
    if (accounts.length === 0) {
        return null;
    }

    return (
        <Container className='banner-container'>
            <div className='alert-container'>
                <AlertTriangleIcon color={'#DC1F25'} />
            </div>
            <div className='content'>
                <h4 className='title'>
                    {accountsCount}
                    {' '}
                    {
                        accountsCount > 1
                            ? <Translate id='twoFactorDisbleBanner.titlePlural' />
                            : <Translate id='twoFactorDisbleBanner.titleSingular' />
                    }
                </h4>
                <div className='desc'>
                    <Translate id='twoFactorDisbleBanner.desc' />
                </div>
            </div>
            <FormButton
                onClick={showModal}
                color='red'
            >
                <LockIcon color='#FEF2F2' />
                <Translate id='twoFactorDisbleBanner.button' />
            </FormButton>
            {
                showDisable2FAModal && (
                    <Disable2FAModal
                        onClose={hideModal}
                        handleSetActiveView={hideModal}
                        accountWithDetails={accounts}
                        setAccountWithDetails={setAccounts}
                    />
                )
            }
        </Container>
    );
};
