import React from 'react';
import { Translate } from 'react-localize-redux';
import styled from 'styled-components';

import FormButton from '../../../common/FormButton';
import SafeTranslate from '../../../SafeTranslate';
import AvatarSuccessIcon from '../../../svg/AvatarSuccessIcon';
import UkraineDonateSuccessIcon from '../../../svg/UkraineDonateSuccessIcon';

const StyledContainer = styled.div`
    > svg {
        margin: 30px auto;
        display: block;
    }

    .header {
        text-align: center;
        line-height: 140%;
    }
`;

const Success = ({
    amount,
    receiverId,
    onClickContinue,
    onClickGoToExplorer,
    donateToUkraine = false
}) => {

    return (
        <StyledContainer className='buttons-bottom'>
            {donateToUkraine 
                ? <UkraineDonateSuccessIcon/>
                : <AvatarSuccessIcon/>
            }
            <div
                className="header"
                data-test-id="sendTransactionSuccessMessage"
            >
                <SafeTranslate id={`sendV2.success.${!donateToUkraine ? 'title' : 'titleDonate'}`}
                    data={{ 
                        amount: amount,
                        receiverId: receiverId
                    }}
                />
            </div>
            <div className='buttons-bottom-buttons'>
                <FormButton
                    onClick={onClickContinue}
                >
                    <Translate id='button.continue'/>
                </FormButton>
                <FormButton
                    color='gray-gray'
                    onClick={onClickGoToExplorer}
                >
                    <Translate id='button.viewOnExplorer'/>
                </FormButton>
            </div>
        </StyledContainer>
    );
};

export default Success;
