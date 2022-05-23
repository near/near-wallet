import React, { useState } from 'react';
import { Translate } from 'react-localize-redux';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';

import RemoveAccountImage from '../../../images/icon-trash.js';
import { switchAccount } from '../../../redux/actions/account';
import { selectAccountId } from '../../../redux/slices/account';
import { wallet } from '../../../utils/wallet';
import FormButton from '../../common/FormButton';
import Container from '../../common/styled/Container.css';
import RemoveAccountModal from './RemoveAccountModal';

const StyledContainer = styled(Container)`
    margin-top: 16px;
    padding-top: 0;
    padding-bottom: 0;
    > button {
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;

        > svg {
            width: 22px !important;
            height: 22px !important;
            margin-right: 10px !important;
        }

        :hover {
            > svg {
                path {
                    stroke: #E5484D;
                }
            }
        }
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
                style={{marginTop: 0}}
            >
                <RemoveAccountImage className='remove-account-icon' />
                <Translate id='removeAccount.button' />
            </FormButton>
            {showRemoveAccountModal &&
                <RemoveAccountModal
                    onClose={() => setShowRemoveAccountModal(false)}
                    onRemoveAccount={async () => {
                        const walletAccounts = await wallet.removeWalletAccount(accountId);
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
