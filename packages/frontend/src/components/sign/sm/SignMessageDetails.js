import React from 'react';
import { Translate } from 'react-localize-redux';
import styled from 'styled-components';

import { EXPLORER_URL } from '../../../config';
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

            @media (max-width: 499px) {
                border-radius: 0;
                margin-top: -35px;
            }

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
            white-space: nowrap;

            &.function {
                padding-left: 25px;
            }

            a {
                display: flex;
                align-items: center;
                word-break: break-word;
                white-space: normal;
                margin-left: 30px;

                svg {
                    margin-left: 5px;
                    min-width: 16px;
                }
            }
        }
        .arguments-wrapper {
            background-color: #272729;
            color: #D5D4D8;
            border-radius: 4px;
            margin-left: 25px;

            > div {
                padding: 20px;
            }

            pre {
                margin: 0;
                overflow: auto;
            }
        }
    }
`;

export default ({
    onClickGoBack,
    message,
}) => {
    return (
        <StyledContainer className='small-centered border'>
            <div className='header'>
                <BackArrowButton onClick={onClickGoBack} color='#0072CE' />
                <Translate id='sign.signMessageDetails' />
            </div>

            <div className='contract-details'>
            {/* <Translate id='sign.message' /> */}
            <span>{message}</span>
            </div>
        </StyledContainer>
    );
};
