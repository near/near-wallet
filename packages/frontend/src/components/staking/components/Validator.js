import React, { useState, useEffect } from 'react';
import { Translate } from 'react-localize-redux';
import { useDispatch, useSelector } from 'react-redux';

import { Mixpanel } from '../../../mixpanel';
import { redirectTo } from '../../../redux/actions/account';
import { claimFarmRewards, getValidatorFarmData } from '../../../redux/actions/staking';
import { selectAccountId } from '../../../redux/slices/account';
import { selectValidatorsFarmData, selectFarmValidatorAPY } from '../../../redux/slices/staking';
import { selectActionsPending } from '../../../redux/slices/status';
import { selectTokensFiatValueUSD, selectTokenWhiteList } from '../../../redux/slices/tokenFiatValues';
import { selectAllContractMetadata, selectNEARAsTokenWithMetadata } from '../../../redux/slices/tokens';
import { FARMING_VALIDATOR_VERSION } from '../../../utils/constants';
import FormButton from '../../common/FormButton';
import SafeTranslate from '../../SafeTranslate';
import AlertBanner from './AlertBanner';
import BalanceBox from './BalanceBox';
import ClaimConfirmModal from './ClaimConfirmModal';
import { FarmingAPY } from './FarmingAPY';
import StakeConfirmModal from './StakeConfirmModal';
import StakingFee from './StakingFee';

const renderFarmUi = ({ farmList, contractMetadataByContractId, openModal, tokenPriceMetadata }) => {
    if (!farmList.length) {
        // eslint-disable-next-line jsx-a11y/heading-has-content
        return <h1 className="animated-dots" />;
    }

    return farmList.map((farm, i) => {
        const { token_id, balance } = farm;
        const currentTokenContractMetadata = contractMetadataByContractId[token_id];

        if (!currentTokenContractMetadata) {
            return;
        }
        const fiatValueMetadata = tokenPriceMetadata.tokenFiatValues[token_id];
        const isWhiteListed = tokenPriceMetadata.tokenWhitelist.includes(token_id);

        return (
            <BalanceBox
                key={token_id}
                token={{
                    onChainFTMetadata: currentTokenContractMetadata,
                    fiatValueMetadata,
                    balance,
                    contractName: token_id,
                    isWhiteListed,
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
                hideBorder={farmList.length > 1 && i < farmList.length}
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
    
    const nearAsFT = useSelector(selectNEARAsTokenWithMetadata);
    const accountId = useSelector(selectAccountId);

    const contractMetadataByContractId = useSelector(selectAllContractMetadata);
    const tokenFiatValues = useSelector(selectTokensFiatValueUSD);
    const tokenWhitelist = useSelector(selectTokenWhiteList);

    const dispatch = useDispatch();
    const stakeNotAllowed = !!selectedValidator && selectedValidator !== match.params.validator && !!currentValidators.length;
    const showConfirmModal = confirm === 'withdraw';
    const pendingUpdateStaking = useSelector((state) => selectActionsPending(state, { types: ['UPDATE_STAKING'] }));

    const [showClaimConfirmModal, setShowClaimConfirmModal] = useState(false);
    const [selectedFarm, setSelectedFarm] = useState(null);

    const openModal = (farm) => {
        setSelectedFarm(farm);
        setShowClaimConfirmModal(true);
    };

    const handleStakeAction = async () => {
        if (showConfirmModal && !loading) {
            await onWithdraw('withdraw', selectedValidator || validator.accountId);
            setConfirm('done');
        }
    };
    const isFarmingValidator = validator?.version === FARMING_VALIDATOR_VERSION;

    const handleClaimAction = async (token_id) => {
        if (!validator || !isFarmingValidator || !token_id) return null;

        await dispatch(claimFarmRewards(validator.accountId, accountId, token_id));
        // TODO: handle modal close, success and fail cases;
        return dispatch(redirectTo('/'));
    };

    const validatorsFarmData = useSelector(selectValidatorsFarmData);
    const validatorFarmData = validatorsFarmData[validator?.accountId] || {};

    useEffect(() => {
        if (!isFarmingValidator || !validator?.accountId) return;

        dispatch(getValidatorFarmData(validator.accountId, accountId));
    }, [validator?.accountId, isFarmingValidator]);

    const farmList = validatorFarmData?.farmRewards || [];
    const tokenPriceMetadata = { tokenFiatValues, tokenWhitelist };

    const farmAPY = useSelector(state => selectFarmValidatorAPY(state, {validatorId: validator?.accountId}));

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
            {isFarmingValidator && <FarmingAPY apy={farmAPY} />}
            {validator && !stakeNotAllowed && !pendingUpdateStaking &&
                <>
                    <BalanceBox
                        title='staking.balanceBox.staked.title'
                        info='staking.balanceBox.staked.info'
                        token={{ ...nearAsFT, balance: validator.staked || '0' }}
                        onClick={() => {
                            dispatch(redirectTo(`/staking/${match.params.validator}/unstake`));
                            Mixpanel.track("UNSTAKE Click unstake button");
                        }}
                        button='staking.balanceBox.staked.button'
                        buttonColor='gray-red'
                        loading={loading}
                        buttonTestId="validatorPageUnstakeButton"
                    />
                    <BalanceBox
                        title='staking.balanceBox.unclaimed.title'
                        info='staking.balanceBox.unclaimed.info'
                        token={{ ...nearAsFT, balance: validator.unclaimed || '0' }}
                        hideBorder={isFarmingValidator && farmList.length > 0}
                    />
                    {renderFarmUi({ farmList, contractMetadataByContractId, openModal, tokenPriceMetadata })}
                    <BalanceBox
                        title='staking.balanceBox.pending.title'
                        info='staking.balanceBox.pending.info'
                        token={{ ...nearAsFT, balance: validator.pending || '0' }}
                        disclaimer='staking.validator.withdrawalDisclaimer'
                    />
                    <BalanceBox
                        title='staking.balanceBox.available.title'
                        info='staking.balanceBox.available.info'
                        token={{ ...nearAsFT, balance: validator.available || '0' }}
                        onClick={() => {
                            setConfirm('withdraw');
                            Mixpanel.track("WITHDRAW Click withdraw button");
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
                    {isFarmingValidator && selectedFarm && showClaimConfirmModal &&
                        <ClaimConfirmModal
                            title={`staking.validator.claimFarmRewards`}
                            label="staking.stake.from"
                            validator={validator}
                            open={showClaimConfirmModal}
                            onConfirm={handleClaimAction}
                            onClose={() => setShowClaimConfirmModal(false)}
                            loading={loading}
                            farm={selectedFarm}
                        />}
                </>
            }
        </>
    );
}
