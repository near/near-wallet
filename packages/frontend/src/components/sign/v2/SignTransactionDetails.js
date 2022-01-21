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
    transactions,
    signGasFee
}) => {
    return (
        <StyledContainer className='small-centered border'>
            <div className='header'>
                <BackArrowButton onClick={onClickGoBack} color='#0072CE' />
                <Translate id='sign.transactionDetails' />
            </div>
            <div className='network-fees'>
                <div className='title'><Translate id='sign.networkFees' /></div>
                <div className='entry'>
                    <Translate id='sign.estimatedFees' />
                    <Balance
                        amount={signGasFee}
                        showBalanceInUSD={false}
                    />
                </div>
                <div className='entry'>
                    <Translate id='sign.feeLimit' />
                    <div>{signGasFee} Tgas</div>
                </div>
            </div>

            <div className='contract-details'>
                <div className='title'><Translate id='sign.contractDetails' /></div>
                {transactions.map((transaction, i) => (
                    <div key={transaction.receiverId}>
                        <div className='entry'>
                            <Translate id='sign.details.forContract' />
                            <a href={`${EXPLORER_URL}/accounts/${transaction.receiverId}`} rel='noopener noreferrer' target='_blank'>{transaction.receiverId} <ArrowUpRight /></a>
                        </div>
                        {transaction.actions.sort((a, b) => Object.keys(b)[0] === 'functionCall' ? 1 : -1).map((action, i) => {
                            const methodName = action.functionCall?.methodName || '';
                            const uniqueMethodId = `${methodName}-${transaction.receiverId}`;
                            return (
                                <div key={methodName}>
                                    <div className='entry function'>
                                        <Translate id='sign.function' />
                                        <DropdownButton id={uniqueMethodId} className='font-monospace'>
                                            {methodName}
                                        </DropdownButton>
                                    </div>
                                    <Accordion
                                        trigger={uniqueMethodId}
                                        className='arguments-wrapper font-monospace'
                                    >
                                        <ActionArguments
                                            actionKind={Object.keys(action)[0]}
                                            action={action[Object.keys(action)[0]]}
                                        />
                                    </Accordion>
                                </div>
                            );
                        })}
                    </div>
                ))}
            </div>
        </StyledContainer>
    );
};

const ActionArguments = ({ actionKind, action }) => {
    if (actionKind === 'functionCall' && Array.isArray(action.args)) {
        try {
            return (
                <pre>
                    <Translate id='arguments' />:&nbsp;
                    {JSON.stringify(JSON.parse(Buffer.from(action.args).toString()), null, 2)}
                </pre>
            );
        } catch {
            return (
                <Translate id='sign.ActionWarrning.binaryData' />
            );
        }
    } else {
        return (
            <Translate id={`sign.ActionKind.${getActionKindTranslateId(actionKind)}`} />
        );
    }
};

const getActionKindTranslateId = (actionKind) => {
    switch (actionKind) {
        case 'functionCall':
            return 'functionCall';
        case 'deployContract':
            return 'deployContract';
        case 'stake':
            return 'stake';
        case 'deleteAccount':
            return 'deleteAccount';
        default:
            return 'unknown';
    }
};