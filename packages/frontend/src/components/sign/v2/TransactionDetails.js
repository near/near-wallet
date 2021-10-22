import React from 'react';
import { Translate } from 'react-localize-redux';
import styled from 'styled-components';

import BackArrowButton from '../../common/BackArrowButton';
import Balance from '../../common/balance/Balance';
import Container from '../../common/styled/Container.css';

const StyledContainer = styled(Container)`
    &&& {
        padding: 0;

        > div {
            padding: 25px;
        }

        .header {
            color: #272729;
            font-weight: 600;
            font-size: 16px;
            position: relative;
            text-align: center;
            background-color: #FAFAFA;
            border-radius: 16px;
            border-bottom-left-radius: 0;
            border-bottom-right-radius: 0;

            .back-arrow-button { 
                position: absolute;
                left: 20px;
                top: 50%;
                transform: translateY(-50%);
            }
        }

        .network-fees {
            color: #72727A;
        }

        .title {
            color: #272729;
            font-weight: 600;
            margin-bottom: 20px;
        }

        .entry {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin: 10px 0;
        }
    }
`;

export default ({
    onClickGoBack
}) => {
    return (
        <StyledContainer className='small-centered border'>
            <div className='header'>
                <BackArrowButton onClick={onClickGoBack} color='#0072CE' />
                Transaction Details
            </div>
            <div className='network-fees'>
                <div className='title'>Network Fees</div>
                <div className='entry'>
                    Estimated Fees
                    <Balance
                        amount='123420000000000000'
                        showBalanceInUSD={false}
                    />
                </div>
                <div className='entry'>
                    Fee Limit
                    <div>20000000 Tgas</div>
                </div>
            </div>
        </StyledContainer>
    );
};