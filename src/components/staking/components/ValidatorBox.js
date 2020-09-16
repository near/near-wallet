import React from 'react'
import styled from 'styled-components'
import UserIcon from '../../svg/UserIcon'
import ChevronIcon from '../../svg/ChevronIcon'
import FormButton from '../../common/FormButton'
import { Translate } from 'react-localize-redux'

const Container = styled.div`
    display: flex;
    border: 2px solid #F2F2F2;
    border-radius: 8px;
    padding: 10px;
    cursor: ${props => props.clickable === 'true' ? 'pointer' : ''};

    svg {
        height: 100%;

        &.user-icon {
            margin: 0 10px 0 0;
        }

        &.chevron-icon {
            margin: auto 5px auto 15px;
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
    clickable = true
}) {

    const cta = amount ? <ChevronIcon/> : <FormButton className='gray-blue'><Translate id='staking.validatorBox.cta' /></FormButton>

    return (
        <Container className='validator-box' clickable={clickable ? 'true' : ''}>
            <UserIcon/>
            <div className='left'>
                <div>{validator}</div>
                {fee && <div>{fee} <Translate id='staking.validatorBox.fee' /></div>}
            </div>
            {amount &&
                <div className='right'>
                    {staking && <div><Translate id='staking.validatorBox.staking' /></div>}
                    <div>{amount} <span><Translate id='staking.validatorBox.near' /></span></div>
                </div>
            }
            {clickable ? cta : null}
        </Container>
    )
}