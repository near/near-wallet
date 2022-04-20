import React from 'react';
import { Translate } from 'react-localize-redux';
import styled from 'styled-components';

import { formatTokenAmount } from '../../utils/amounts';
import { formatNearAmount } from '../common/balance/helpers';
import FormButton from '../common/FormButton';

const StyledAvailableContainer = styled.div`
    display: flex;
    padding-left: 4px;
    justify-content: space-between;
    align-items: center;
    text-align: right;
    width: 100%;
    margin-top: 5px;
    color: #252729;
    font-style: normal;
    font-weight: 500;
    font-size: 14px;
    line-height: 17px;
    margin-bottom: 15px;

    span {
        color: green;
        cursor: pointer;
    }
`;

function AvailableToSwap({ balance, symbol, decimals, onClick }) {
    const amountoShow = balance && formatNearAmount(balance);

    return (
        <StyledAvailableContainer>
            <div>
                <Translate id="swap.AvailableToSwap"/>{' '}
                <span>
                    {balance && (
                        <>
                            {' '}
                            {symbol === 'NEAR' ? amountoShow : formatTokenAmount(balance, decimals, 5)}
                        </>
                    )}
                    {!balance && <span className="dots"/>}
                    {' '}
                    <>{symbol}</>
                </span>
            </div>
            <div>
                <FormButton
                    swapButton={true}
                    onClick={() => onClick(symbol === 'NEAR' ? amountoShow : formatTokenAmount(balance, decimals, 5))}
                    type='button'
                    color='light-blue'
                    className='small rounded'
                >
                    <Translate id='button.useMax'/>
                </FormButton>
            </div>

        </StyledAvailableContainer>
    );
}

export default AvailableToSwap;
