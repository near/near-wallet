import React, { useState } from 'react';
import { Translate } from 'react-localize-redux';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';

import { switchAccount } from '../../../redux/actions/account';
import { selectAccountId } from '../../../redux/slices/account';
import { wallet } from '../../../utils/wallet';
import FormButton from '../../common/FormButton';
import Container from '../../common/styled/Container.css';
import RemoveAccountModal from './RemoveAccountModal';

const StyledContainer = styled(Container)`
    > button {
        width: 100%;
    }
`;

export default () => {
    const dispatch = useDispatch();
    const [showRemoveAccountModal, setShowRemoveAccountModal] = useState(false);
    const accountId = useSelector(selectAccountId);
    return (
        <StyledContainer>
            <FormButton 
                color='red'
                onClick={() => setShowRemoveAccountModal(true)}
            >
                <Translate id='removeAccount.button' />
            </FormButton>
            {showRemoveAccountModal &&
                <RemoveAccountModal
                    onClose={() => setShowRemoveAccountModal(false)}
                    onRemoveAccount={() => {
                        const walletAccounts = wallet.removeWalletAccount(accountId);
                        if (Object.keys(walletAccounts).length === 0) {
                            location.reload();
                        } else {
                            dispatch(switchAccount({ accountId: Object.keys(walletAccounts)[0] }));
                        }
                        setShowRemoveAccountModal(false);
                    }}
                    isOpen={showRemoveAccountModal}
                    accountId={accountId}
                />
            }
        </StyledContainer>
    );
};
