import React from 'react';
import { Translate } from 'react-localize-redux';
import styled from 'styled-components';

import { LEDGER_MODAL_STATUS } from '../../../../redux/slices/ledger';
import FormButton from '../../../common/FormButton';
import LedgerImageCircle from '../../../svg/LedgerImageCircle';
import LedgerSuccessIcon from '../../../svg/LedgerSuccessIcon';
import AccountListImport from '../../AccountListImport';

const CustomContainer = styled.div`
    width: 100%;
    margin-top: 40px;

    .buttons-bottom-buttons {
        margin-top: 40px;
    }

    .title {
        text-align: left;
        font-size: 12px;
    }
`;

const ImportAccounts = ({
    accountsApproved,
    totalAccounts,
    ledgerAccounts,
    accountsError,
    accountsRejected,
    signInWithLedgerStatus,
    handleContinue
}) => {
    const animationScope = Math.min(Math.max((accountsApproved + accountsError + accountsRejected) - 1, 0), totalAccounts - 3);
    const success = signInWithLedgerStatus === LEDGER_MODAL_STATUS.SUCCESS;

    return (
        <>
            {success
                ? <>
                    <LedgerSuccessIcon />
                    <h1>{accountsApproved}/{totalAccounts} <Translate id='confirmLedgerModal.header.success' data={{ totalAccounts }} /></h1>
                </>
                : <>
                    <LedgerImageCircle color='#D6EDFF' />
                    <h1><Translate id='confirmLedgerModal.header.weFound' data={{ totalAccounts }} /></h1>
                    <Translate id='confirmLedgerModal.two' />
                </>
            }
            
            <CustomContainer>
                <div className='title'>
                    {accountsApproved}/{totalAccounts} <Translate id='signInLedger.modal.accountsApproved'/>
                </div>
                <AccountListImport accounts={ledgerAccounts} animationScope={animationScope}/>
                {success &&
                    <div className='buttons-bottom-buttons'>
                        <FormButton
                            onClick={handleContinue}
                        >
                            <Translate id='button.continue' />
                        </FormButton>
                    </div>
                }
            </CustomContainer>
        </>
    );
};

export default ImportAccounts;
