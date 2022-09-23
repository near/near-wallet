import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';

import { selectAccountId } from '../../../redux/slices/account';
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

export default ({ handleSignTransactions }) => {
    const [showAddFullAccessKeyModal, setShowAddFullAccessKeyModal] = useState(true);
    const accountId = useSelector(selectAccountId);
    const dispatch = useDispatch();

    const onAuthorize = async () => {
        setShowAddFullAccessKeyModal(false);
        await dispatch(handleSignTransactions());
    };
    return (
        <StyledContainer>
            {showAddFullAccessKeyModal && (
                <AddFAKModal
                    //TODO route user to main wallet page or back to callback from url
                    onClose={() => console.log('sending back to callback URL')}
                    onAuthorize={() => onAuthorize()}
                    isOpen={showAddFullAccessKeyModal}
                    accountId={accountId}
                />
            )}
        </StyledContainer>
    );
};
