import React, { useState } from 'react';
import { Translate } from 'react-localize-redux';
import styled from 'styled-components';

import FormButton from '../../../common/FormButton';
import Container from '../../../common/styled/Container.css';
import WhereToBuyNearModal from '../../../common/WhereToBuyNearModal';
import AccountNeedsFunding from '../status/AccountNeedsFunding';

const StyledContainer = styled(Container)`
    &&& {
        h2 {
            margin-bottom: 25px;
        }

        > button {
            &.link {
                margin-bottom: 50px;
            }
        }
    }
`;

export default ({
    fundingAddress,
    minDeposit
}) => {
    const [showWhereToBuyModal, setShowWhereToBuyModal] = useState(false);
    return (
        <>
            <StyledContainer className='small-centered border'>
                <h1><Translate id='initialDeposit.manualDeposit.title' /></h1>
                <h2><Translate id='initialDeposit.manualDeposit.desc' /></h2>
                <FormButton
                    onClick={() => setShowWhereToBuyModal(true)}
                    color='blue'
                    className='link underline'
                >
                    <Translate id='account.createImplicit.pre.whereToBuy.button' />
                </FormButton>
                <AccountNeedsFunding
                    fundingAddress={fundingAddress}
                    minDeposit={minDeposit}
                />
            </StyledContainer>
            {showWhereToBuyModal &&
                <WhereToBuyNearModal
                    onClose={() => setShowWhereToBuyModal(false)}
                    open={showWhereToBuyModal}
                />
            }
        </>
    );
};