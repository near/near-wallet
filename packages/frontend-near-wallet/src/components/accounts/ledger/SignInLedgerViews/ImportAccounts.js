import React from 'react';
import { Translate } from 'react-localize-redux';
import styled from 'styled-components';

import IconCheck from '../../../../images/IconCheck';
import UserIconGrey from '../../../../images/UserIconGrey';
import { LEDGER_MODAL_STATUS } from '../../../../redux/slices/ledger';
import FormButton from '../../../common/FormButton';
import LedgerImageCircle from '../../../svg/LedgerImageCircle';
import LedgerSuccessIcon from '../../../svg/LedgerSuccessIcon';

const UserIcon = styled.div`
    background-size: 21px;
    flex: 0 0 40px;
    height: 40px;
    border-radius: 50%;
    background-color: #f8f8f8;
    text-align: center;
    margin: 0 12px 0 0;
    
    svg {
        width: 26px;
        height: 26px;
        margin: 7px;
    }

    @media (min-width: 940px) {
        display: inline-block;
    }
`;

const CustomContainer = styled.div`
    width: 100%;
    margin-top: 40px;

    .buttons-bottom-buttons {
        margin-top: 40px;
    }

    .title {
        text-align: left;
        font-size: 12px;
    }
`;

const AnimateList = styled.div`
    margin-top: 10px;
    height: 180px;
    overflow: hidden;

    & > div:first-of-type {
        margin-top: ${(props) => `-${props.animate * 60}px`};
        transition: 1s;
    }

    .accountId {
        overflow: hidden;
        font-size: 14px;
        text-overflow: ellipsis;
    }

    .row {
        border-top: 2px solid #f5f5f5;
        display: flex;
        height: 60px;
        align-items: center;

        &.success .status {
            text-align: right;
        }
        &.error .status {
            background: #ffb1b2;
            color: #450002;
        }
        &.rejected .status {
            background: #f4f4f4;
            color: #de2e32;
        }
        &.confirm .status {
            background: #f4c898;
            color: #ae6816;
            text-align: left;
            padding: 0 0 0 10px;
            flex: 0 0 140px;

            :after {
                content: '.';
                animation: dots 1s steps(5, end) infinite;
            
                @keyframes dots {
                    0%, 20% {
                        color: rgba(0,0,0,0);
                        text-shadow:
                            .3em 0 0 rgba(0,0,0,0),
                            .6em 0 0 rgba(0,0,0,0);
                    }
                    40% {
                        color: #ae6816;
                        text-shadow:
                            .3em 0 0 rgba(0,0,0,0),
                            .6em 0 0 rgba(0,0,0,0);
                    }
                    60% {
                        text-shadow:
                            .3em 0 0 #ae6816,
                            .6em 0 0 rgba(0,0,0,0);
                    }
                    80%, 100% {
                        text-shadow:
                            .3em 0 0 #ae6816,
                            .6em 0 0 #ae6816;
                    }
                }
            }
        }
        &.pending .status {
            background: #f4c898;
            color: #ae6816;
            text-align: left;
            padding: 0 0 0 10px;
            flex: 0 0 82px;

            :after {
                content: '.';
                animation: dots 1s steps(5, end) infinite;
            
                @keyframes dots {
                    0%, 20% {
                        color: rgba(0,0,0,0);
                        text-shadow:
                            .3em 0 0 rgba(0,0,0,0),
                            .6em 0 0 rgba(0,0,0,0);
                    }
                    40% {
                        color: #ae6816;
                        text-shadow:
                            .3em 0 0 rgba(0,0,0,0),
                            .6em 0 0 rgba(0,0,0,0);
                    }
                    60% {
                        text-shadow:
                            .3em 0 0 #ae6816,
                            .6em 0 0 rgba(0,0,0,0);
                    }
                    80%, 100% {
                        text-shadow:
                            .3em 0 0 #ae6816,
                            .6em 0 0 #ae6816;
                    }
                }
            }
        }
        &.waiting {
            .status {
                background: #f8f8f8;
                color: #aaaaaa;
            }
            > div:first-of-type {
                opacity: 0.4;
            }
            h3 {
                color: #aaaaaa !important;
            }
        }

        .status {
            flex: 0 0 72px;
            margin-left: auto;
            height: 24px;
            border-radius: 12px;
            text-align: center;
            font-size: 12px;
            line-height: 24px;
        }
    }
`;

const ImportAccounts = ({
    accountsApproved,
    totalAccounts,
    ledgerAccounts,
    accountsError,
    accountsRejected,
    signInWithLedgerStatus,
    handleContinue
}) => {
    const animationScope = Math.min(Math.max((accountsApproved + accountsError + accountsRejected) - 1, 0), totalAccounts - 3);
    const success = signInWithLedgerStatus === LEDGER_MODAL_STATUS.SUCCESS;

    return (
        <>
            {success
                ? <>
                    <LedgerSuccessIcon />
                    <h1>{accountsApproved}/{totalAccounts} <Translate id='confirmLedgerModal.header.success' data={{ totalAccounts }} /></h1>
                </>
                : <>
                    <LedgerImageCircle color='#D6EDFF' />
                    <h1><Translate id='confirmLedgerModal.header.weFound' data={{ totalAccounts }} /></h1>
                    <Translate id='confirmLedgerModal.two' />
                </>
            }
            
            <CustomContainer>
                <div className='title'>
                    {accountsApproved}/{totalAccounts} <Translate id='signInLedger.modal.accountsApproved'/>
                </div>
                <AnimateList animate={animationScope}>
                    {ledgerAccounts.map((account) => (
                        <div key={account.accountId} className={`row ${account.status}`}>
                            <UserIcon>
                                <UserIconGrey color='#9a9a9a' />
                            </UserIcon>
                            <div className='accountId'>
                                {account.accountId}
                            </div>
                            <div className='status'>
                                {account.status !== 'success' 
                                    ? <Translate id={`signInLedger.modal.status.${account.status}`}/>
                                    : <IconCheck color='#5ace84' stroke='3px' />
                                }
                            </div>
                        </div>
                    ))}
                </AnimateList>
                {success &&
                    <div className='buttons-bottom-buttons'>
                        <FormButton
                            onClick={handleContinue}
                        >
                            <Translate id='button.continue' />
                        </FormButton>
                    </div>
                }
            </CustomContainer>
        </>
    );
};

export default ImportAccounts;
