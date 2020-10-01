import React from 'react'
import FormButton from '../../common/FormButton'
import { Translate } from 'react-localize-redux'
import BalanceBox from './BalanceBox'
import StakingFee from './StakingFee'
import ListWrapper from './ListWrapper'

export default function Validator({ match, validators, onUnstake, onWithdraw }) {
    const validator = validators.filter(validator => validator.accountId === match.params.validator)[0]
    return (
        <>
            <h1><Translate id='staking.validator.title' data={{ validator: match.params.validator }}/></h1>
            <FormButton linkTo={`/staking/${match.params.validator}/stake`}><Translate id='staking.validator.button' /></FormButton>
            {validator &&
                <>
                    <StakingFee fee={validator.fee.percentage}/>
                    <ListWrapper>
                        <BalanceBox
                            title='staking.balanceBox.staked.title'
                            info='staking.balanceBox.staked.info'
                            amount={validator.staked || '0'}
                            version='no-border'
                            onClick={onUnstake}
                            button='staking.balanceBox.staked.button'
                            buttonColor='gray-red'
                        />
                        <BalanceBox
                            title='staking.balanceBox.unclaimed.title'
                            info='staking.balanceBox.unclaimed.info'
                            amount={validator.unclaimed || '0'}
                            version='no-border'
                        />
                        <BalanceBox
                            title='staking.balanceBox.available.title'
                            info='staking.balanceBox.available.info'
                            amount={ validator.available || '0' }
                            version='no-border'
                            onClick={onWithdraw}
                            button='staking.balanceBox.available.button'
                        />
                        <BalanceBox
                            title='staking.balanceBox.pending.title'
                            info='staking.balanceBox.pending.info'
                            amount={ validator.pending || '0' }
                            version='no-border'
                        />
                    </ListWrapper>
                    <div className='withdrawal-disclaimer'>
                        <Translate id='staking.validator.withdrawalDisclaimer' />
                    </div>
                </>
            }
        </>
    )
}