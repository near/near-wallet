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
    padding: 12px;
    position: relative;
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
            text-align: left;
            
            &:first-of-type {
                color: #24272a;
                max-width: 165px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;

                @media (max-width: 350px) {
                    max-width: 113px;
                }

                @media (min-width: 500px) {
                    max-width: 175px;
                }
            }
        }
    }

    .right {
        margin-left: auto;
        text-align: right;

        div {
            &:first-of-type {
                color: #00C08B;
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
            width: auto !important;
            margin: 0 !important;
            margin-left: auto !important;
            padding: 0px 10px !important;
            height: 34px !important;
        }
    }

    .with {
        position: absolute;
        top: -14px;
        padding: 5px 10px 2px 10px;
        background-color: white;
        border-radius: 40px;
        text-align: center;
        border: 2px solid #F2F2F2;
        left: 50%;
        transform: translateX(-50%);
    }
`

export default function ValidatorBox({
    validator,
    fee,
    amount,
    staking = true,
    clickable = true,
    style,
    label = false
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
            {label && <div className='with'><Translate id='staking.validatorBox.with' /></div>}
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
                        <Balance amount={amount} symbol='near'/>
                    </div>
                </div>
            }
            {clickable ? cta : null}
        </Container>
    )
}