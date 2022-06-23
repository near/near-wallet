import { getLocation } from 'connected-react-router';
import React from 'react';
import { Translate } from 'react-localize-redux';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';

import { actions as ledgerActions, selectLedgerConnectionAvailable, selectLedgerHasLedger } from '../../redux/slices/ledger';
import CheckCircleIcon from '../svg/CheckCircleIcon';
import LedgerSmall from '../svg/LedgerSmall';

const { handleShowConnectModal } = ledgerActions;

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
    white-space: nowrap;
    
    svg {
        width: 16px;
        height: 16px;
        margin-right: 8px;
    }
`;

export default () => {
    const dispatch = useDispatch();

    const { pathname } = useSelector(getLocation);
    const ledgerConnectionAvailable = useSelector(selectLedgerConnectionAvailable);
    const hasLedger = useSelector(selectLedgerHasLedger);

    const connectLedger =  () => dispatch(handleShowConnectModal());
    
    const showConnectLedgerButton = hasLedger || ['sign-in-ledger', 'setup-ledger'].includes(pathname.split('/')[1]);
    
    if (!showConnectLedgerButton) {
        return null;
    }

    return <>
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
    </>;
};
