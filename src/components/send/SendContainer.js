import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import styled from 'styled-components'
import Container from '../common/styled/Container.css'
import { Translate } from 'react-localize-redux'
import FormButton from '../common/FormButton'
import ArrowCircleIcon from '../svg/ArrowCircleIcon'
import AccountFormAccountId from '../accounts/AccountFormAccountId'
import { checkAccountAvailable, setFormLoader, clear, sendMoney, refreshAccount } from '../../actions/account'
import BalanceBreakdown from '../staking/components/BalanceBreakdown'
import BN from 'bn.js'
import { utils } from 'near-api-js'
import { WALLET_APP_MIN_AMOUNT } from '../../utils/wallet'
import isDecimalString from '../../utils/isDecimalString'
import SendConfirmModal from './SendConfirmModal'

const {
    parseNearAmount, formatNearAmount
} = utils.format

const StyledContainer = styled(Container)`

`

export function SendContainer({ match }) {
    const dispatch = useDispatch()
    const { requestStatus, formLoader, accountId, balance } = useSelector(({ account }) => account);
    const [useMax, setUseMax] = useState(null)
    const [amount, setAmount] = useState('')
    const [confirm, setConfirm] = useState(null)
    const [id, setId] = useState('')
    const amountAvailableToSend = new BN(balance.available).sub(new BN(parseNearAmount(WALLET_APP_MIN_AMOUNT)))
    const sendAllowed = requestStatus && requestStatus.success !== false && !new BN(parseNearAmount(amount)).isZero() && (new BN(parseNearAmount(amount)).lte(amountAvailableToSend) || useMax) && isDecimalString(amount)
    const displayAmount = useMax ? formatNearAmount(amount, 5) : amount

    const handleSetUseMax = () => {
        setUseMax(true)
        setAmount(amountAvailableToSend.toString())
    }

    const handleChangeAmount = (e) => {
        if (!/^\d*[.]?\d*$/.test(e.target.value)) {
            return
        }
        setUseMax(false)
        setAmount(e.target.value)
    }
4
    const handleConfirm = () => {
        setConfirm(true)
    }

    const handleSend = async () => {
        await dispatch(sendMoney(id, parseNearAmount(amount)))
        await dispatch(refreshAccount())
        setConfirm(false)
    }

    return (
        <StyledContainer className='small-centered send-theme'>
            <h1><Translate id='sendMoney.title.default' /></h1>
            <div className='sub-title'><Translate id='sendMoney.subtitle.default' /></div>
            <div className='header-button'>
                <h4><Translate id='staking.stake.amount' /></h4>
                <FormButton className='light-blue small' onClick={handleSetUseMax}><Translate id='staking.stake.useMax' /></FormButton>
            </div>
            <input
                disabled={false}
                type='number'
                autoFocus 
                placeholder='0'
                value={displayAmount}
                onChange={handleChangeAmount}
                className='amount-input'
                tabIndex='1'
            />
            <BalanceBreakdown
                total={balance.available}
                onClickAvailable={handleSetUseMax}
                availableType='sendMoney.amount.available'
            />
            <ArrowCircleIcon color={sendAllowed ? '#6AD1E3' : ''}/>
            <h4><Translate id='sendMoney.account.title' /></h4>
            <AccountFormAccountId
                formLoader={formLoader || false}
                handleChange={(e, { value }) => setId(value)}
                defaultAccountId={match.params.id || id}
                checkAvailability={() => dispatch(checkAccountAvailable(id))}
                requestStatus={requestStatus}
                autoFocus={false}
                setFormLoader={() => dispatch(setFormLoader())}
                clearRequestStatus={() => dispatch(clear())}
                stateAccountId={accountId}
            />
            <FormButton onClick={handleConfirm} disabled={!sendAllowed}>
                <Translate id='sendMoney.button.send' />
            </FormButton>
            {confirm &&
                <SendConfirmModal
                    onClose={() => setConfirm(false)}
                    onConfirm={handleSend}
                    loading={formLoader}
                />
            }
        </StyledContainer>
    )
}