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
    setSlippage
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
                {isUSNSwap && 
                    <SlippagePicker
                        translateIdTitle={'swap.priceImpact'}
                        translateIdInfoTooltip="swap.translateIdInfoTooltip.priceImpact"
                        setSlippage={setSlippage}
                    />
                }
                
                {!isUSNSwap && 
                    <Amount
                        className="green details-info"
                        translateIdTitle={'swap.priceImpact'}
                        amount={estimatedFeesInNear}
                        symbol={'%'}
                        decimals={selectedTokenFrom.onChainFTMetadata?.decimals}
                        translateIdInfoTooltip="swap.translateIdInfoTooltip.priceImpact"
                    />
                }

                {isUSNSwap ? 
                (
                    <Amount
                        className="details-info"
                        translateIdTitle={'swap.fee'}
                        amount={commissionFee.toString()}
                        symbol={selectedTokenTo.onChainFTMetadata?.symbol}
                        decimals={0}
                        translateIdInfoTooltip="swap.translateIdInfoTooltip.fee"
                    /> 
                ) : 
                (
                    <Amount
                        className="details-info"
                        translateIdTitle={'swap.fee'}
                        amount={estimatedFeesInNear}
                        symbol="NEAR"
                        translateIdInfoTooltip="swap.translateIdInfoTooltip.fee"
                    />
                )}

                {isUSNSwap ? 
                (
                    <Amount
                        className="details-info"
                        translateIdTitle={'swap.minReceived'}
                        amount={minimumReceived.toString()}
                        symbol={selectedTokenTo.onChainFTMetadata?.symbol}
                        decimals={0}
                        translateIdInfoTooltip="swap.translateIdInfoTooltip.minimumReceived"
                    />
                ) : 
                (
                    <Amount
                    className="details-info"
                    translateIdTitle={'swap.minReceived'}
                    amount={estimatedMinReceived}
                    symbol={selectedTokenTo.onChainFTMetadata?.symbol}
                    decimals={selectedTokenTo.onChainFTMetadata?.decimals}
                    translateIdInfoTooltip="swap.translateIdInfoTooltip.minimumReceived"
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
