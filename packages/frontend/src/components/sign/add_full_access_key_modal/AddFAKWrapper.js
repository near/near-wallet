import React, { useState } from 'react';
import { Translate } from 'react-localize-redux';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';

import RemoveAccountImage from '../../../images/icon-trash.js';
import { wallet } from '../../../utils/wallet';
import FormButton from '../../common/FormButton';
import Container from '../../common/styled/Container.css';
import AddFAKModal from './AddFAKModal';

const StyledContainer = styled(Container)`
    margin-top: 16px;
    padding-top: 0;
    padding-bottom: 0;


    &&& {
        > button {
            width: 100%;
            display: flex;
            justify-content: center;
            align-items: center;

            svg {
                width: 22px;
                height: 22px;
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
    }   
`;

export default () => {
    const dispatch = useDispatch();
    const [showAddFullAccessKeyModal, setShowAddFullAccessKeyModal] = useState(false);
    const accountId = useSelector(selectAccountId);
    return (
        <StyledContainer>
            <FormButton
                color='red'
                onClick={() => setShowAddFullAccessKeyModal(true)}
                style={{ marginTop: 0 }}
            >
                <RemoveAccountImage className='remove-account-icon' />
                <Translate id='sign.addFullAccessKey.button' />
            </FormButton>
            {showAddFullAccessKeyModal && (
                <AddFAKModal
                    //TODO route user to main wallet page or back to callback from url
                    onClose={() =>  }
                    onAuthorize={() => setShowAddFullAccessKeyModal(false)}
                    isOpen={showAddFullAccessKeyModal}
                    accountId={accountId}
                />
            )}
        </StyledContainer>
    );
};
