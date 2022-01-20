import BN from 'bn.js';
import { utils } from 'near-api-js';
import React, { useState } from 'react';
import { Translate } from 'react-localize-redux';

import { onKeyDown } from '../../../hooks/eventListeners';
import { Mixpanel } from '../../../mixpanel/index';
import { toNear } from '../../../utils/amounts';
import isDecimalString from '../../../utils/isDecimalString';
import { STAKING_AMOUNT_DEVIATION } from '../../../utils/staking';
import { getNearAndFiatValue } from '../../common/balance/helpers';
import FormButton from '../../common/FormButton';
import SafeTranslate from '../../SafeTranslate';
import ArrowCircleIcon from '../../svg/ArrowCircleIcon';
import TransferMoneyIcon from '../../svg/TransferMoneyIcon';
import AlertBanner from './AlertBanner';
import AmountInput from './AmountInput';
import StakeConfirmModal from './StakeConfirmModal';
import ValidatorBox from './ValidatorBox';

const {
    parseNearAmount, formatNearAmount
} = utils.format;

export default function StakingAction({
    match,
    validator,
    loading,
    availableBalance,
    hasLedger,
    has2fa,
    action,
    handleStakingAction,
    stakeFromAccount,
    selectedValidator,
    currentValidators,
    nearTokenFiatValueUSD
}) {
    const [confirm, setConfirm] = useState();
    const [amount, setAmount] = useState('');
    const [success, setSuccess] = useState();
    const [useMax, setUseMax] = useState(null);
    const [loadingStaking, setLoadingStaking] = useState(false);
    const hasStakeActionAmount = !loading && amount.length && amount !== '0';
    let staked = (validator && validator.staked) || '0';
    const stake = action === 'stake' ? true : false;
    const displayAmount = useMax ? formatNearAmount(amount, 5).replace(/,/g, '') : amount;
    const availableToStake = availableBalance;
    const invalidStakeActionAmount = new BN(useMax ? amount : parseNearAmount(amount)).sub(new BN(stake ? availableToStake : staked)).gt(new BN(STAKING_AMOUNT_DEVIATION)) || !isDecimalString(amount);
    const stakeActionAllowed = hasStakeActionAmount && !invalidStakeActionAmount && !success;
    const stakeNotAllowed = !!selectedValidator && selectedValidator !== match.params.validator && !!currentValidators.length;

    onKeyDown(e => {
        if (e.keyCode === 13 && stakeActionAllowed) {
            if (!confirm) {
                setConfirm(true);
            } else {
                onStakingAction();
            }
        }
    });

    const onStakingAction = async () => {
        setLoadingStaking(true);
        let stakeActionAmount = amount;
        const userInputAmountIsMax = new BN(parseNearAmount(amount)).sub(new BN(stake ? availableBalance : staked)).abs().lte(new BN(STAKING_AMOUNT_DEVIATION));

        if (!stake) {
            if (!useMax && userInputAmountIsMax) {
                stakeActionAmount = staked;
            } else if (useMax || userInputAmountIsMax) {
                stakeActionAmount = null;
            }
        }

        try {
            await handleStakingAction(action, validator.accountId, stakeActionAmount);
            setSuccess(true);
            setConfirm(false);
        } finally {
            setLoadingStaking(false);
        }
    };

    const handleSetMax = () => {
        let amount = stake ? availableBalance : staked;

        if (stake && stakeFromAccount) {
            amount = availableToStake;
        }

        const isPositiveValue = new BN(amount).gt(new BN('0'));

        if (isPositiveValue) {
            setAmount(amount);
            setUseMax(true);
        }
        Mixpanel.track("STAKE/UNSTAKE Use max token");
    };

    const handleOnChange = (amount) => {
        setAmount(amount);
        setUseMax(false);
    };

    const getStakeActionDisclaimer = () => {
        let disclaimer = '';
        if (stake) {
            if ((hasLedger || has2fa) && !stakeFromAccount && new BN(staked).isZero()) {
                disclaimer = 'staking.stake.ledgerDisclaimer';
            }
        } else {
            disclaimer = 'staking.unstake.beforeUnstakeDisclaimer';
        }
        return disclaimer;
    };

    if (stakeNotAllowed) {
        return (
            <AlertBanner
                title='staking.alertBanner.title'
                button='staking.alertBanner.button'
                linkTo={`/staking/${selectedValidator}`}
            />
        );
    }
    
    if (!success) {
        return (
            <div className='send-theme'>
                <h1><Translate id={`staking.${action}.title`} /></h1>
                <h2><Translate id={`staking.${action}.desc`} /></h2>
                <div className='amount-header-wrapper'>
                    <h4><Translate id='staking.stake.amount' /></h4>
                    <FormButton
                        className='small' 
                        color='light-blue'
                        onClick={handleSetMax}
                        data-test-id="stakingPageUseMaxButton"
                    >
                        <Translate id="staking.stake.useMax" />
                    </FormButton>
                </div>
                <AmountInput
                    action={action}
                    value={displayAmount} 
                    onChange={handleOnChange}
                    valid={stakeActionAllowed}
                    availableBalance={stake ? availableBalance : staked}
                    availableClick={handleSetMax}
                    insufficientBalance={invalidStakeActionAmount} 
                    disabled={loading || confirm}
                    stakeFromAccount={stakeFromAccount}
                    inputTestId="stakingAmountInput"
                />
                <ArrowCircleIcon color={stakeActionAllowed ? '#6AD1E3' : ''}/>
                <div className='header-button'>
                    <h4><Translate id={`staking.${action}.stakeWith`} /></h4>
                    <FormButton 
                        className='small' 
                        color='light-blue'
                        linkTo='/staking/validators'
                        trackingId="STAKE Go to validators list page"
                    >
                        <Translate id='button.edit' />
                    </FormButton>
                </div>
                {validator && 
                    <ValidatorBox
                        validator={validator}
                        clickable={false}
                        amount={validator.staked}
                    />
                }
                <FormButton
                    disabled={!stakeActionAllowed} 
                    onClick={() => setConfirm(true)}
                    trackingId="STAKE/UNSTAKE Click submit stake button"
                    data-test-id="submitStakeButton"
                >
                    <Translate id={`staking.${action}.button`} />
                </FormButton>
                {confirm &&
                    <StakeConfirmModal
                        title={`staking.${action}.confirm`}
                        label={`staking.stake.${stake ? 'with' : 'from'}`}
                        validator={validator}
                        amount={useMax ? amount : toNear(amount)}
                        open={confirm} 
                        onConfirm={onStakingAction} 
                        onClose={() => {
                            setConfirm(false);
                            Mixpanel.track("STAKE/UNSTAKE Close the modal");
                        }}
                        loading={loadingStaking}
                        disclaimer={getStakeActionDisclaimer()}
                        sendingString={stake ? 'staking' : 'unstaking'}
                    />
                }
            </div>
        );
    } else {
        return (
            <>
                <TransferMoneyIcon/>
                <h1><Translate id={`staking.${action}Success.title`} /></h1>
                <div className='desc' data-test-id="stakingSuccessMessage">
                    <SafeTranslate
                        id={`staking.${action}Success.desc`}
                        data={{ amount: getNearAndFiatValue(parseNearAmount(displayAmount), nearTokenFiatValueUSD) }}
                    />
                </div>
                {validator && 
                    <ValidatorBox
                        validator={validator}
                        amount={validator.staked}
                        clickable={false}
                        style={{margin: '40px 0'}}
                    />
                }
                <div className='desc'><Translate id={`staking.${action}Success.descTwo`}/></div>
                <FormButton 
                    linkTo='/staking' 
                    className='gray-blue'
                    trackingId="STAKE/UNSTAKE Return to dashboard"
                    data-test-id="returnToDashboardButton"
                >
                    <Translate id={`staking.${action}Success.button`} />
                </FormButton>
            </>
        );
    }
}