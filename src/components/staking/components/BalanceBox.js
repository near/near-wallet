import React from 'react'
import styled from 'styled-components'
import Balance from '../../common/Balance'
import InfoIcon from '../../svg/InfoIcon.js'
import { Modal } from 'semantic-ui-react'
import { Translate } from 'react-localize-redux'
import FormButton from '../../common/FormButton'
import classNames from '../../../utils/classNames'
import BN from 'bn.js'
import StakingRewardsBanner from './StakingRewardsBanner'

const Container = styled.div`
    border-bottom: 2px solid #F2F2F2;
    padding: 15px 0;
    display: flex;

    @media (max-width: 767px) {
        padding: 15px 14px;
    }

    .list {
        display: block;
        margin-top: 8px !important;
        color: #24272a;
        font-size: 24px;
        font-weight: 900;
    }

    .title {
        color: #6E7073;
    }

    .trigger {

        margin-left: 10px;

        svg {
            width: 16px;
            height: 16px;
            margin-bottom: -3px;
        }
    }

    button {
        &.small {
            width: auto !important;
            padding: 0px 15px !important;
            margin: auto 0 auto auto !important;
            letter-spacing: 2px !important;
        }
    }

    .left {
        width: 100%;
    }

    @media (max-width: 767px) {
        border: 0;
        border-bottom: 2px solid #F2F2F2;
        margin: 0px -14px 0 -14px;
        border-radius: 0;
    }
`

export default function BalanceBox({
    title,
    amount,
    info,
    onClick,
    button,
    buttonColor,
    loading,
    disclaimer,
    stakingRewardsBanner
}) {
    return (
        <Translate>
            {({ translate }) => (
                <Container className='balance-box'>
                    <div className='left'>
                        <div className='title'>{translate(title)}
                            <Modal
                                size='mini'
                                trigger={<span className='trigger'><InfoIcon color='#999999'/></span>}
                                closeIcon
                            >
                                {translate(info)}
                            </Modal>
                        </div>
                        {stakingRewardsBanner ? (
                            <StakingRewardsBanner/>
                        ) : (
                            <Balance amount={amount} />
                        )}
                        {disclaimer &&
                            <div className='withdrawal-disclaimer'>
                                <Translate id={disclaimer} />
                            </div>
                        }
                    </div>
                    {button && onClick &&
                        <FormButton disabled={new BN(amount).isZero() || loading} onClick={onClick} className={classNames(['small', buttonColor])}><Translate id={button} /></FormButton>
                    }
                </Container>
            )}
        </Translate>
    )
}