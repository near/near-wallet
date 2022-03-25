import BN from 'bn.js';
import React, { useState, useEffect, useMemo } from 'react';
import { Translate } from 'react-localize-redux';
import { useDispatch, useSelector } from 'react-redux';

import { FARMING_VALIDATOR_APY_DISPLAY } from '../../../../../../features';
import { Mixpanel } from '../../../mixpanel';
import { redirectTo } from '../../../redux/actions/account';
import { claimFarmRewards, getValidatorFarmData } from '../../../redux/actions/staking';
import { showCustomAlert } from '../../../redux/actions/status';
import selectNEARAsTokenWithMetadata from '../../../redux/crossStateSelectors/selectNEARAsTokenWithMetadata';
import { selectValidatorsFarmData, selectFarmValidatorAPY, selectStakingCurrentAccountAccountId } from '../../../redux/slices/staking';
import { selectActionsPending } from '../../../redux/slices/status';
import { selectTokensFiatValueUSD, selectTokenWhiteList } from '../../../redux/slices/tokenFiatValues';
import { selectAllContractMetadata } from '../../../redux/slices/tokens';
import StakingFarmContracts from '../../../services/StakingFarmContracts';
import { FARMING_VALIDATOR_VERSION } from '../../../utils/constants';
import FormButton from '../../common/FormButton';
import SafeTranslate from '../../SafeTranslate';
import AlertBanner from './AlertBanner';
import BalanceBox from './BalanceBox';
import ClaimTokenFarmRewardsModal from './ClaimTokenFarmRewardsModal';
import { FarmingAPY } from './FarmingAPY';
import StakeConfirmModal from './StakeConfirmModal';
import StakingFee from './StakingFee';

const renderFarmUi = ({ farmList, contractMetadataByContractId, openModal, tokenPriceMetadata }) => {
    if (!farmList.length) {
        // eslint-disable-next-line jsx-a11y/heading-has-content
        return <h1 className="animated-dots" />;
    }

    return farmList.map((farm, i) => {
        const { token_id, balance, farm_id, active } = farm;
        const currentTokenContractMetadata = contractMetadataByContractId[token_id];

        if (!currentTokenContractMetadata || (!active && new BN(balance).isZero())) {
            return;
        }
        const fiatValueMetadata = tokenPriceMetadata.tokenFiatValues[token_id];
        const isWhiteListed = tokenPriceMetadata.tokenWhitelist.includes(token_id);

        return (
            <BalanceBox
                key={farm_id}
                token={{
                    onChainFTMetadata: currentTokenContractMetadata,
                    fiatValueMetadata,
                    balance,
                    contractName: token_id,
                }}
                onClick={() => {
                    openModal({
                        onChainFTMetadata: currentTokenContractMetadata,
                        fiatValueMetadata,
                        balance,
                        contractName: token_id,
                        isWhiteListed,
                    });

                }}
                button="staking.balanceBox.farm.button"
                hideBorder={farmList.length > 1 && i < (farmList.length - 1)}
            />
        );
    });
};

export default function Validator({
    match,
    validator,
    onWithdraw,
    loading,
    selectedValidator,
    currentValidators,
}) {
    const [confirm, setConfirm] = useState(null);
    
    const NEARAsTokenWithMetadata = useSelector(selectNEARAsTokenWithMetadata);

    const contractMetadataByContractId = useSelector(selectAllContractMetadata);
    const tokenFiatValues = useSelector(selectTokensFiatValueUSD);
    const tokenWhitelist = useSelector(selectTokenWhiteList);
    const currentAccountId = useSelector(selectStakingCurrentAccountAccountId);

    const dispatch = useDispatch();
    const stakeNotAllowed = !!selectedValidator && selectedValidator !== match.params.validator && !!currentValidators.length;
    const showConfirmModal = confirm === 'withdraw';
    const pendingUpdateStaking = useSelector((state) => selectActionsPending(state, { types: ['UPDATE_STAKING'] }));

    const [showClaimTokenFarmRewardsModal, setShowClaimTokenFarmRewardsModal] = useState(false);
    const [selectedFarm, setSelectedFarm] = useState(null);

    const [claimingProceed, setClaimingProceed] = useState(false);

    const openModal = (farm) => {
        setSelectedFarm(farm);
        setShowClaimTokenFarmRewardsModal(true);
    };

    const isFarmingValidator = validator?.version === FARMING_VALIDATOR_VERSION;

    const handleStakeAction = async () => {
        if (showConfirmModal && !loading) {
            if (isFarmingValidator) {
                await StakingFarmContracts.getFarmListWithUnclaimedRewards({
                    contractName: validator.contract.contractId,
                    account_id: currentAccountId,
                    from_index: 0,
                    limit: 300,
                }).then((res) => 
                    Promise.all([
                        (res || [])
                        .filter(({balance}) => !new BN(balance).isZero())
                        .map(({token_id}) => dispatch(claimFarmRewards(validator.accountId, token_id)))
                    ])
                );
            }
            await onWithdraw('withdraw', selectedValidator || validator.accountId);
            setConfirm('done');
        }
    };

    const handleClaimAction = async (token_id) => {
        if (!validator || !isFarmingValidator || !token_id) return null;

        try {
            setClaimingProceed(true);
            await dispatch(claimFarmRewards(validator.accountId, token_id));
            setClaimingProceed(false);
            return dispatch(redirectTo(`/staking/${match.params.validator}/claim`));
        } catch (e) {
            setClaimingProceed(false);
            dispatch(showCustomAlert({
                success: false,
                messageCodeHeader: 'error',
                messageCode: 'staking.validator.errorClaimRewards',
            }));
        }
        
    };

    const validatorsFarmData = useSelector(selectValidatorsFarmData);
    const validatorFarmData = validatorsFarmData[validator?.accountId] || {};

    useEffect(() => {
        dispatch(getValidatorFarmData(validator, currentAccountId));
    }, [validator, currentAccountId]);

    const farmList = validatorFarmData?.farmRewards || [];
    const tokenPriceMetadata = { tokenFiatValues, tokenWhitelist };
    const hasUnwhitelistedTokens = useMemo(
        () =>
            farmList.some(({ token_id }) => !tokenWhitelist.includes(token_id)),
        [farmList, tokenWhitelist]
    );

    const farmAPY = useSelector((state) => selectFarmValidatorAPY(state, {validatorId: validator?.accountId}));

    return (
        <>
            {stakeNotAllowed
                ? <AlertBanner
                    data-test-id="cantStakeWithValidatorContainer"
                    data-test-id-button="viewCurrentValidatorButton"
                    title='staking.alertBanner.title'
                    button='staking.alertBanner.button'
                    linkTo={`/staking/${selectedValidator}`}
                />
                : null
            }
            {hasUnwhitelistedTokens ? <AlertBanner
                title='staking.validator.notWhitelistedValidatorWarning'
            /> : null}
            <h1 data-test-id="validatorNamePageTitle">
                <SafeTranslate
                    id="staking.validator.title"
                    data={{ validator: match.params.validator }}
                />
            </h1>
            <FormButton
                linkTo={`/staking/${match.params.validator}/stake`}
                disabled={(stakeNotAllowed || !validator)}
                trackingId="STAKE Click stake with validator button"
                data-test-id="validatorPageStakeButton"
            >
                <Translate id='staking.validator.button' />
            </FormButton>
            {validator && <StakingFee fee={validator.fee.percentage} />}
            {FARMING_VALIDATOR_APY_DISPLAY
                ? isFarmingValidator && <FarmingAPY apy={farmAPY} />
                : null}
            {validator && !stakeNotAllowed && !pendingUpdateStaking &&
                <>
                    <BalanceBox
                        title='staking.balanceBox.staked.title'
                        info='staking.balanceBox.staked.info'
                        token={{...NEARAsTokenWithMetadata, balance: validator.staked || '0'}}
                        onClick={() => {
                            dispatch(redirectTo(`/staking/${match.params.validator}/unstake`));
                            Mixpanel.track('UNSTAKE Click unstake button');
                        }}
                        button='staking.balanceBox.staked.button'
                        buttonColor='gray-red'
                        loading={loading}
                        buttonTestId="validatorPageUnstakeButton"
                    />
                    <BalanceBox
                        title='staking.balanceBox.unclaimed.title'
                        info='staking.balanceBox.unclaimed.info'
                        token={{...NEARAsTokenWithMetadata, balance: validator.unclaimed || '0'}}
                        hideBorder={isFarmingValidator && farmList.length > 0}
                    />
                    {isFarmingValidator && renderFarmUi({ farmList, contractMetadataByContractId, openModal, tokenPriceMetadata })}
                    <BalanceBox
                        title='staking.balanceBox.pending.title'
                        info='staking.balanceBox.pending.info'
                        token={{...NEARAsTokenWithMetadata, balance: validator.pending || '0'}}
                        disclaimer='staking.validator.withdrawalDisclaimer'
                    />
                    <BalanceBox
                        title='staking.balanceBox.available.title'
                        info='staking.balanceBox.available.info'
                        token={{...NEARAsTokenWithMetadata, balance: validator.available || '0'}}
                        onClick={() => {
                            setConfirm('withdraw');
                            Mixpanel.track('WITHDRAW Click withdraw button');
                        }}
                        button='staking.balanceBox.available.button'
                        loading={loading}
                    />
                    {showConfirmModal &&
                        <StakeConfirmModal
                            title={`staking.validator.${confirm}`}
                            label='staking.stake.from'
                            validator={validator}
                            amount={validator.available}
                            open={showConfirmModal}
                            onConfirm={handleStakeAction}
                            onClose={() => setConfirm(null)}
                            loading={loading}
                            sendingString='withdrawing'
                        />
                    }
                    {isFarmingValidator && selectedFarm && showClaimTokenFarmRewardsModal &&
                        <ClaimTokenFarmRewardsModal
                            title={'staking.validator.claimFarmRewards'}
                            label="staking.stake.from"
                            validator={validator}
                            open={showClaimTokenFarmRewardsModal}
                            onConfirm={handleClaimAction}
                            onClose={() => setShowClaimTokenFarmRewardsModal(false)}
                            loading={claimingProceed}
                            farm={selectedFarm}
                        />}
                </>
            }
        </>
    );
}
