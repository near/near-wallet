import React, { useEffect, useState } from 'react';
import { Translate } from 'react-localize-redux';
import { useDispatch } from 'react-redux';

import { Mixpanel } from '../../../mixpanel';
import { redirectTo } from '../../../redux/actions/account';
import { actionsPending } from '../../../utils/alerts';
import { PROJECT_VALIDATOR_VERSION } from '../../../utils/constants';
import { fetchTokenPrices, fetchTokenWhiteList } from '../../../utils/ref-finance';
import FormButton from '../../common/FormButton';
import SafeTranslate from '../../SafeTranslate';
import AlertBanner from './AlertBanner';
import BalanceBox from './BalanceBox';
import StakeConfirmModal from './StakeConfirmModal';
import StakingFee, { StakingAPY } from './StakingFee';

export default function Validator({
    match,
    validator,
    onWithdraw,
    loading,
    selectedValidator,
    currentValidators,
    accountId,
}) {
    const [confirm, setConfirm] = useState(null);
    const dispatch = useDispatch();
    const stakeNotAllowed = !!selectedValidator && selectedValidator !== match.params.validator && !!currentValidators.length;
    const showConfirmModal = confirm === 'withdraw' || confirm === 'claimFarmRewards';

    const handleStakeAction = async () => {
        if (showConfirmModal && !loading) {
            await onWithdraw('withdraw', selectedValidator || validator.accountId);
            setConfirm('done');
        }
    };

    const [unclaimedRewards, setUnclaimReward] = useState([]);

    useEffect(() => {
        if (validator?.version !== PROJECT_VALIDATOR_VERSION ) return;
        const getRewards = async () => {
            try {
                const tokenWhiteList = await fetchTokenWhiteList(accountId) || [];
                const tokenPrices = await fetchTokenPrices();
                const rewards = await Promise.all(
                    validator.poolSummary.farms.map(async (farm) => {
                        const rewards =
                            await validator.contract.get_unclaimed_reward({
                                account_id: accountId,
                                farm_id: farm.farm_id,
                            });

                        const tokenData = tokenPrices[farm.token_id] || { price: 0, symbol: ''};
                        return {
                            amount: rewards,
                            tokenPrice: (+tokenData.price).toFixed(2) || 0,
                            tokenId: farm.token_id,
                            tokenName: tokenData.symbol,
                            isWhiteListed: !tokenWhiteList.includes(farm.token_id),
                            farmTitle: farm.name,
                            farmId: farm.farm_id
                        };
                    })
                );

                setUnclaimReward(rewards);
            } catch (error) {
                console.log(error);
            }
        };

        getRewards();
    }, [validator]);

    const isProjectValidator = validator?.version === PROJECT_VALIDATOR_VERSION;
    const calculatedAPY = validator?.calculatedAPY;

    return (
        <>
            {stakeNotAllowed
                ? <AlertBanner
                    title='staking.alertBanner.title'
                    button='staking.alertBanner.button'
                    linkTo={`/staking/${selectedValidator}`}
                />
                : null
            }
            <h1 data-test-id="validatorNamePageTitle">
                <SafeTranslate
                    id="staking.validator.title"
                    data={{ validator: match.params.validator }}
                />
            </h1>
            <FormButton
                linkTo={`/staking/${match.params.validator}/stake`}
                disabled={(stakeNotAllowed || !validator) ? true : false}
                trackingId="STAKE Click stake with validator button"
                data-test-id="validatorPageStakeButton"
            >
                <Translate id='staking.validator.button' />
            </FormButton>
            {validator && <StakingFee fee={validator.fee.percentage} />}
            {validator?.version === PROJECT_VALIDATOR_VERSION && <StakingAPY apy={calculatedAPY} />}
            {validator && !stakeNotAllowed && !actionsPending('UPDATE_STAKING') &&
                <>
                    <BalanceBox
                        title='staking.balanceBox.staked.title'
                        info='staking.balanceBox.staked.info'
                        amount={validator.staked || '0'}
                        onClick={() => {
                            dispatch(redirectTo(`/staking/${match.params.validator}/unstake`));
                            Mixpanel.track("UNSTAKE Click unstake button");
                        }}
                        button='staking.balanceBox.staked.button'
                        buttonColor='gray-red'
                        loading={loading}
                    />
                    <BalanceBox
                        title='staking.balanceBox.unclaimed.title'
                        info='staking.balanceBox.unclaimed.info'
                        amount={validator.unclaimed || '0'}
                    />
                    <BalanceBox
                        title='staking.balanceBox.pending.title'
                        info='staking.balanceBox.pending.info'
                        amount={validator.pending || '0'}
                        disclaimer='staking.validator.withdrawalDisclaimer'
                    />
                    <BalanceBox
                        title='staking.balanceBox.available.title'
                        info='staking.balanceBox.available.info'
                        amount={validator.available || '0'}
                        onClick={() => {
                            setConfirm('withdraw');
                            Mixpanel.track("WITHDRAW Click withdraw button");
                        }}
                        button='staking.balanceBox.available.button'
                        loading={loading}
                    />
                    {isProjectValidator && (
                            <>
                            <h3>
                                <Translate
                                    id="staking.validator.availableForClaim"
                                />
                            </h3>
                            {unclaimedRewards.length ? unclaimedRewards?.map(farmRewards => (
                                <BalanceBox
                                    key={farmRewards.farmId}
                                    info="staking.balanceBox.farmAvailable.info"
                                    amount={farmRewards.amount || '0'}
                                    tokenMeta={{
                                        tokenPrice: farmRewards.tokenPrice,
                                        tokenId: farmRewards.tokenId,
                                        tokenName: farmRewards.tokenName,
                                        isWhiteListed: farmRewards.isWhiteListed,
                                        farmTitle: farmRewards.farmTitle
                                    }}
                                    isNear={false}
                                    onClick={() => {
                                        // setConfirm("claimFarmRewards");
                                        // // Mixpanel.track(
                                        // //     "CLAIM Click claim button"
                                        // // );
                                    }}
                                    button="staking.balanceBox.farm.button"
                                    loading={loading}
                                />
                            )) : <h4><Translate id={'staking.validator.nothingToClaim'}/></h4>}
                            </>
                        )}
                        {showConfirmModal && (
                            <StakeConfirmModal
                                title={`staking.validator.${confirm}`}
                                label="staking.stake.from"
                                validator={validator}
                                amount={validator.available}
                                open={showConfirmModal}
                                onConfirm={handleStakeAction}
                                onClose={() => setConfirm(null)}
                                loading={loading}
                                sendingString="withdrawing"
                            />
                        )}
                </>
            }
        </>
    );
}