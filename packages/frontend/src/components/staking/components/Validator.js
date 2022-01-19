import React, { useState, useEffect } from 'react';
import { Translate } from 'react-localize-redux';
import { useDispatch, useSelector } from 'react-redux';

import { useNEARAsTokenWithMetadata } from '../../../hooks/fungibleTokensIncludingNEAR';
import { Mixpanel } from '../../../mixpanel';
import { redirectTo } from '../../../redux/actions/account';
import { selectAccountId } from '../../../redux/slices/account';
import { actions as tokensActions, selectAllContractMetadata } from '../../../redux/slices/tokens';
import { actionsPending } from '../../../utils/alerts';
import { PROJECT_VALIDATOR_VERSION, ValidatorVersion } from '../../../utils/constants';
import FormButton from '../../common/FormButton';
import SafeTranslate from '../../SafeTranslate';
import AlertBanner from './AlertBanner';
import BalanceBox from './BalanceBox';
import StakeConfirmModal from './StakeConfirmModal';
import StakingFee from './StakingFee';

const { fetchToken } = tokensActions;

export default function Validator({
    match,
    validator,
    onWithdraw,
    loading,
    selectedValidator,
    currentValidators,
}) {
    const [confirm, setConfirm] = useState(null);
    const [farmList, setFarmList] = useState([]);
    const nearAsFT = useNEARAsTokenWithMetadata();
    const accountId = useSelector(selectAccountId);
    const contractMetadata = useSelector(selectAllContractMetadata);

    const dispatch = useDispatch();
    const stakeNotAllowed = !!selectedValidator && selectedValidator !== match.params.validator && !!currentValidators.length;
    const showConfirmModal = confirm === 'withdraw';

    useEffect(() => {
        const getFarms = async () => {
            const farms = await validator.contract.get_farms({from_index: 0, limit: 300});
            setFarmList(await Promise.all(farms.map(({ token_id }, i) => {
                dispatch(fetchToken({contractName: token_id}));
                return validator.contract
                    .get_unclaimed_reward({ account_id: accountId, farm_id: i })
                    .catch(() => "0")
                    .then((balance) => ({ token_id, balance, farm_id: i }));
            })));
        };
        if(validator && validator.version === ValidatorVersion[PROJECT_VALIDATOR_VERSION]) {
            getFarms();
        }
    },[validator]);

    const handleStakeAction = async () => {
        if (showConfirmModal && !loading) {
            await onWithdraw('withdraw', selectedValidator || validator.accountId);
            setConfirm('done');
        }
    };

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
            {validator && !stakeNotAllowed && !actionsPending('UPDATE_STAKING') &&
                <>
                    <BalanceBox
                        title='staking.balanceBox.staked.title'
                        info='staking.balanceBox.staked.info'
                        token={{...nearAsFT, balance: validator.staked || '0'}}
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
                        token={{...nearAsFT, balance: validator.unclaimed || '0'}}
                    />
                    {farmList.map(({ token_id, balance, farm_id }) => (
                            <BalanceBox
                                key={token_id}
                                title="staking.balanceBox.farm.title"
                                info="staking.balanceBox.farm.info"
                                token={{
                                    onChainFTMetadata: contractMetadata[token_id],
                                    coingeckoMetadata: {},
                                    balance,
                                    contractName: token_id,
                                }}
                                // onClick={() => {
                                //     // TODO claim accrued rewards and redirect home where tokens will be fetched
                                //     return validator.contract.claim({account_id: accountId, token_id, farm_id}).then(() => dispatch(redirectTo('/')));
                                // }}
                                button="staking.balanceBox.farm.button"
                                buttonColor='gray-red'
                            />
                    ))}
                    <BalanceBox
                        title='staking.balanceBox.pending.title'
                        info='staking.balanceBox.pending.info'
                        token={{...nearAsFT, balance: validator.pending || '0'}}
                        disclaimer='staking.validator.withdrawalDisclaimer'
                    />
                    <BalanceBox
                        title='staking.balanceBox.available.title'
                        info='staking.balanceBox.available.info'
                        token={{...nearAsFT, balance: validator.available || '0'}}
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
                </>
            }
        </>
    );
}