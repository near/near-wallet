import React from 'react';
import { Translate } from 'react-localize-redux';
import styled from 'styled-components';

import AccountListImport from '../../../accounts/AccountListImport';
import { ButtonsContainer, StyledButton } from '../../CommonComponents';

const AccountKeyCleanupContainer = styled.div`
    text-align: left;

    .cleanup-info {
        border-radius: 8px;
        margin-bottom: 8px;
        margin-top: 0;
        padding: 0 6px 8px 12px;
    }

    .cleanup-info-header {
        font-weight: bold;
        margin-bottom: 2px;
        margin-top: 2px;
    }

    .keep {
        background: #f4fbf5;
        color: #397751;
    }

    .next-steps {
        font-style: italic;
    }

    .remove {
        background: #fef8f8;
        color: #de2e32;
    }
`;

const AccountKeyCleanup = ({
    accounts,
    batchStarted,
    offerRetry,
    onClose,
    onNext,
    onRetry,
}) => {
    return (
        <AccountKeyCleanupContainer>
            <h3 className='title'>
                <Translate id='walletMigration.cleanKeys.title' />
            </h3>
            <p><Translate id='walletMigration.cleanKeys.desc'/></p>
            <div className='cleanup-info keep'>
                <p className='cleanup-info-header'>
                    <Translate id='walletMigration.cleanKeys.keep' />
                </p>
                <Translate id='walletMigration.cleanKeys.keepDesc' />
            </div>
            <div className='cleanup-info remove'>
                <p className='cleanup-info-header'>
                    <Translate id='walletMigration.cleanKeys.remove' />
                </p>
                <Translate id='walletMigration.cleanKeys.removeDesc' />
            </div>
            <p className='next-steps'>
                <Translate id='walletMigration.cleanKeys.nextSteps' />
            </p>
            <div className="accountsTitle">
                <Translate id='importAccountWithLink.accountsFound' data={{ count: accounts.length }} />
            </div>
            <AccountListImport accounts={accounts} />
            <ButtonsContainer vertical>
                {offerRetry && (
                    <StyledButton
                        onClick={onRetry}
                        data-test-id="cleanKeys.cancel"
                    >
                        <Translate id={'button.retry'} />
                    </StyledButton>
                )}
                <StyledButton
                    onClick={onNext}
                    fullWidth
                    disabled={batchStarted && !offerRetry}
                    data-test-id="rotateKeys.continue"
                >
                    <Translate id='button.continue' />
                </StyledButton>
                <StyledButton className='gray-blue' onClick={onClose} fullWidth>
                    <Translate id='button.cancel' />
                </StyledButton>
            </ButtonsContainer>
        </AccountKeyCleanupContainer>
    );
};

export default AccountKeyCleanup;
