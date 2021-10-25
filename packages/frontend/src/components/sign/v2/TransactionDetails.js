import React from 'react';
import { Translate } from 'react-localize-redux';
import styled from 'styled-components';

import Accordion from '../../common/Accordion';
import BackArrowButton from '../../common/BackArrowButton';
import Balance from '../../common/balance/Balance';
import DropdownButton from '../../common/buttons/DropdownButton';
import Container from '../../common/styled/Container.css';
import ArrowUpRight from '../../svg/ArrowUpRight';

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
            border-bottom: 1px solid #F0F0F1;
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
            margin: 15px 0;

            &.function {
                padding-left: 25px;
            }

            a {
                display: flex;
                align-items: center;

                svg {
                    margin-left: 5px;
                }
            }
        }
        .arguments-wrapper {
            background-color: #272729;
            color: #D5D4D8;
            border-radius: 4px;

            > div {
                padding: 20px;
            }
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

            <div className='contract-details'>
                <div className='title'>Contract Details</div>
                <div className='entry'>
                    Contract Address
                    <a href='/' rel='noopener noreferrer' target='_blank'>v2.ref-finance.near <ArrowUpRight/></a>
                </div>
                <div className='entry function'>
                    Function
                    <DropdownButton id='balance-1'>
                        storage_deposit
                    </DropdownButton>
                </div>
                <Accordion trigger='balance-1' className='arguments-wrapper font-monospace'>
                    helloooo
                </Accordion>
            </div>
        </StyledContainer>
    );
};