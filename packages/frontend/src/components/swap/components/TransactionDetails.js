import React, { useState } from 'react';

import classNames from '../../../utils/classNames';
import Accordion from '../../common/Accordion';
import AccordionTrigger from '../../send/components/AccordionTrigger';
import Breakdown from '../../send/components/css/Breakdown.css';
import Amount from '../../send/components/entry_types/Amount';
import { exchangeRateTranslation } from './helpers';
import SlippagePicker from './SlippagePicker';

const TransactionDetails = ({
    selectedTokenFrom,
    selectedTokenTo,
    estimatedFeesInNear,
    estimatedMinReceived,
    amount,
    exchangeRate,
    tradingFee,
    setSlippageValue
}) => {
    const [open, setOpen] = useState(false);

    const commissionFee = tradingFee?.toFixed(5);
    const isUSNSwap = selectedTokenFrom.onChainFTMetadata.name === 'USN' ||
        selectedTokenTo.onChainFTMetadata.name === 'USN';

    const minimumReceived = exchangeRateTranslation({
        inputtedAmountOfToken: selectedTokenFrom,
        calculateAmountOfToken: selectedTokenTo,
        balance: amount,
        exchangeRate
    }) - tradingFee;

    return (
        <Breakdown
            className={classNames([
                'transaction-details-breakdown',
                open ? 'open' : '',
            ])}
        >
            <Accordion
                trigger="transaction-details-breakdown"
                className="breakdown"
            >
                {isUSNSwap && <SlippagePicker
                    translateIdTitle={'swapNear.priceImpact'} // to do: translations
                    translateIdInfoTooltip="swapNear.translateIdInfoTooltip.priceImpact"
                    setSlippageValue={setSlippageValue}
                />}
                {!isUSNSwap && 
                    <Amount
                        className="green details-info"
                        translateIdTitle={'swapNear.priceImpact'}
                        amount={estimatedFeesInNear}
                        symbol={'%'}
                        decimals={selectedTokenFrom.onChainFTMetadata?.decimals}
                        translateIdInfoTooltip="swapNear.translateIdInfoTooltip.priceImpact"
                    />
                }

                {isUSNSwap ? 
                (
                    <Amount
                        className="details-info"
                        translateIdTitle={'swapNear.fee'}
                        amount={commissionFee.toString()}
                        symbol={selectedTokenTo.onChainFTMetadata?.symbol}
                        decimals={0}
                        translateIdInfoTooltip="swapNear.translateIdInfoTooltip.liquidityProviderFee"
                    /> 
                ) : 
                (
                    <Amount
                        className="details-info"
                        translateIdTitle={'swapNear.fee'}
                        amount={estimatedFeesInNear}
                        symbol="NEAR"
                        translateIdInfoTooltip="swapNear.translateIdInfoTooltip.liquidityProviderFee"
                    />
                )}

                {isUSNSwap ? 
                (
                    <Amount
                        className="details-info"
                        translateIdTitle={'swapNear.minReceived'}
                        amount={minimumReceived.toString()}
                        symbol={selectedTokenTo.onChainFTMetadata?.symbol}
                        decimals={0}
                        translateIdInfoTooltip="swapNear.translateIdInfoTooltip.minimumReceived"
                    />
                ) : 
                (
                    <Amount
                    className="details-info"
                    translateIdTitle={'swapNear.minReceived'}
                    amount={estimatedMinReceived}
                    symbol={selectedTokenTo.onChainFTMetadata?.symbol}
                    decimals={selectedTokenTo.onChainFTMetadata?.decimals}
                    translateIdInfoTooltip="swapNear.translateIdInfoTooltip.minimumReceived"
                />
                )} 
            </Accordion>
            <AccordionTrigger
                id="transaction-details-breakdown"
                translateIdTitle="sendV2.accordionTriggerTitle.transactionDetails"
                open={open}
                onClick={() => setOpen(!open)}
            />
        </Breakdown>
    );
};

export default TransactionDetails;
