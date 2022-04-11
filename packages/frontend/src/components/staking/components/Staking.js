import BN from 'bn.js';
import React from 'react';
import { Translate } from 'react-localize-redux';
import { useSelector } from 'react-redux';

import selectCollectedAvailableForClaimData from '../../../redux/crossStateSelectors/selectCollectedAvailableForClaimData';
import selectNEARAsTokenWithMetadata from '../../../redux/crossStateSelectors/selectNEARAsTokenWithMetadata';
import FormButton from '../../common/FormButton';
import SkeletonLoading from '../../common/SkeletonLoading';
import Tooltip from '../../common/Tooltip';
import BalanceBox from './BalanceBox';
import ListWrapper from './ListWrapper';
import NoValidators from './NoValidators';
import SelectAccount from './SelectAccount';
import ValidatorBox from './ValidatorBox';

export default function Staking({
    currentValidators,
    totalStaked,
    totalUnclaimed,
    totalAvailable,
    totalPending,
    onSwitchAccount,
    accounts,
    activeAccount,
    loading,
    hasLockup,
    loadingDetails,
    stakeFromAccount,
    selectedValidator,
    multipleAccounts
}) {
    const NEARAsTokenWithMetadata = useSelector(selectNEARAsTokenWithMetadata);
    const collectedFarmData = useSelector(selectCollectedAvailableForClaimData);
    return (
        <>
            <h1><Translate id='staking.staking.title' /></h1>
            <h2><Translate id='staking.staking.desc' /></h2>
            {multipleAccounts &&
                <div className='select-account-title'>
                    <Translate id='staking.staking.selectAccount' />
                    <Tooltip translate='staking.stake.accounts' position='bottom' />
                </div>
            }
            {!loading && !loadingDetails &&
                <SelectAccount
                    accounts={accounts}
                    onChange={(e) => onSwitchAccount(e.target.value)}
                    selectedAccount={activeAccount.accountId}
                />
            }
            <SkeletonLoading
                height='102px'
                number={hasLockup ? 2 : 1}
                show={loading || loadingDetails}
                className='account-loader'
            />
            <FormButton
                disabled={loadingDetails}
                linkTo='/staking/validators'
                trackingId="STAKE Click stake my tokens button"
                data-test-id="stakeMyTokensButton"
            >
                <Translate id='staking.staking.button' />
            </FormButton>
            <SkeletonLoading
                height='80px'
                number={2}
                show={loadingDetails}
                className='account-loader'
            />
            {!loadingDetails &&
                <>
                    <BalanceBox
                        title='staking.balanceBox.staked.title'
                        info='staking.balanceBox.staked.info'
                        token={{...NEARAsTokenWithMetadata, balance: totalStaked}}
                        button={new BN(totalStaked).isZero() ? null : 'staking.balanceBox.staked.button'}
                        linkTo={stakeFromAccount ? '/staking/unstake' : `/staking/${selectedValidator}/unstake`}
                        buttonColor='gray-blue'
                        buttonTestId="stakingPageUnstakingButton"
                        balanceTestId="stakingPageTotalStakedAmount"
                    />
                    <BalanceBox
                        title='staking.balanceBox.unclaimed.title'
                        info='staking.balanceBox.unclaimed.info'
                        token={{...NEARAsTokenWithMetadata, balance: totalUnclaimed}}
                    />
                </>
            }
            {!loading && currentValidators.length ?
                <>
                    <BalanceBox
                        title='staking.balanceBox.pending.title'
                        info='staking.balanceBox.pending.info'
                        token={{...NEARAsTokenWithMetadata, balance: totalPending}}
                        balanceTestId="stakingPagePendingReleaseAmount"
                    />
                    <BalanceBox
                        title='staking.balanceBox.available.title'
                        info='staking.balanceBox.available.info'
                        token={{...NEARAsTokenWithMetadata, balance: totalAvailable}}
                        button={new BN(totalAvailable).isZero() ? null : 'staking.balanceBox.available.button'}
                        linkTo={stakeFromAccount ? '/staking/withdraw' : `/staking/${selectedValidator}`}
                        buttonColor='gray-blue'
                    />
                </>
                : null}
            {!loading && collectedFarmData
                .filter((tokenData) => +tokenData.balance > 0)
                .map((tokenData, i) => {
                return (
                    <BalanceBox
                        title={!i && 'staking.balanceBox.farmed.title'}
                        info={!i && 'staking.balanceBox.farmed.info'}
                        key={tokenData.contractName}
                        token={{
                            onChainFTMetadata: tokenData.onChainFTMetadata,
                            fiatValueMetadata: tokenData.fiatValueMetadata,
                            balance: tokenData.balance,
                            contractName: tokenData.contractName,
                            isWhiteListed: tokenData.isWhiteListed
                        }}
                        button="staking.balanceBox.farm.button"
                        hideBorder={collectedFarmData.length > 1 && i < (collectedFarmData.length - 1)}
                />
                );
            })}
            <h3><Translate id='staking.staking.currentValidators' /></h3>
            {!loadingDetails
                ? currentValidators.length
                    ? <ListWrapper>
                        {currentValidators.map((validator, i) =>
                            <ValidatorBox
                                key={i}
                                validator={validator}
                                amount={validator.staked}
                                showBalanceInUSD={false}
                            />
                        )}
                    </ListWrapper>
                    : <NoValidators />
                : <SkeletonLoading
                    height='200px'
                    show={true}
                    className='account-loader'
                />
            }
        </>
    );
}
