import React from 'react';
import { Translate } from 'react-localize-redux';
import styled from 'styled-components';

import CheckCircleIcon from '../svg/CheckCircleIcon';
import LedgerSmall from '../svg/LedgerSmall';

const ConnectLedgerButton = styled.div`
    background: #F0F0F1;
    border-radius: 4px;
    color: #72727A;
    font-weight: 600;
    padding: 14px;
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 12px 16px;
    cursor: pointer;

    svg {
        width: 16px;
        height: 16px;
        margin-right: 8px;
    }
`;

export default ({
    connectLedger,
    ledgerConnectionAvailable,
    hasLedger
}) => {
    return (
        <>
            {hasLedger &&
                <>
                    <div className='divider'/>
                    <ConnectLedgerButton onClick={connectLedger}>
                        {ledgerConnectionAvailable
                            ? <>
                                <CheckCircleIcon color='#00C08B' />
                                <Translate id='connectLedger.ledgerConnected'/>
                            </> : <>
                                <LedgerSmall />
                                <Translate id='connectLedger.connectLedger'/>
                            </>
                        }
                    </ConnectLedgerButton>
                </>
            }
        </>
    );
};
