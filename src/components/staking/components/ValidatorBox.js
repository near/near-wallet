import React from 'react'
import styled from 'styled-components'
import UserIcon from '../../svg/UserIcon'
import ChevronIcon from '../../svg/ChevronIcon'
import FormButton from '../../common/FormButton'
import { Translate } from 'react-localize-redux'
import Balance from '../../common/Balance'
import { redirectTo } from '../../../actions/account'
import { useDispatch } from 'react-redux'

const Container = styled.div`
    display: flex;
    align-items: center;
    border: 2px solid #F2F2F2;
    border-radius: 8px;
    padding: 10px 10px 8px 10px;
    line-height: 130%;
    cursor: ${props => props.clickable === 'true' ? 'pointer' : ''};

    svg {
        height: 100%;

        &.user-icon {
            margin: -2px 10px 0 0;
            min-width: 36px;
        }

        &.chevron-icon {
            margin: auto 5px auto 15px;
            min-width: 8px;
        }
    }

    .left, .right {
        display: flex;
        flex-direction: column;
        justify-content: center;
    }

    .left {
        div {
            &:first-of-type {
                color: #24272a;
                max-width: 165px;
                overflow: hidden;
                text-overflow: ellipsis;

                @media (max-width: 350px) {
                    max-width: 113px;
                }

                @media (min-width: 500px) {
                    max-width: 230px;
                }
            }
        }
    }

    .right {
        margin-left: auto;
        text-align: right;

        div {
            &:first-of-type {
                color: #37B565;
            }
            
            &:last-of-type {
                color: #24272a;
                white-space: nowrap;

                span {
                    color: #999;
                }
            }
        }
    }

    .chevron-icon {
        display: none;
    }

    button {
        &.gray-blue {
            width: 72px !important;
            margin: 0 !important;
            margin-left: auto !important;
            padding: 0px !important;
            height: 34px !important;
        }
    }
`

export default function ValidatorBox({
    validator,
    fee,
    amount,
    staking = true,
    clickable = true,
    style
}) {
    const dispatch = useDispatch()
    const cta = amount ? <ChevronIcon/> : <FormButton className='gray-blue' linkTo={`/staking/${validator}`}><Translate id='staking.validatorBox.cta' /></FormButton>
    return (
        <Container 
            className='validator-box' 
            clickable={clickable && amount ? 'true' : ''} 
            style={style} 
            onClick={() => { clickable && amount && dispatch(redirectTo(`/staking/${validator}`))}}
        >
            <UserIcon/>
            <div className='left'>
                <div>{validator}</div>
                {fee && 
                    <div>{fee}% <Translate id='staking.validatorBox.fee' /></div>
                }
            </div>
            {amount &&
                <div className='right'>
                    {staking && <div><Translate id='staking.validatorBox.staking' /></div>}
                    <div>
                        <Balance amount={amount} noSymbol={true}/> <span><Translate id='staking.validatorBox.near' /></span>
                    </div>
                </div>
            }
            {clickable ? cta : null}
        </Container>
    )
}