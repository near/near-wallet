import React from 'react'
import styled from 'styled-components'
import Balance from '../../common/Balance'
import InfoIcon from '../../svg/InfoIcon.js'
import { Modal } from 'semantic-ui-react'
import { Translate } from 'react-localize-redux'
import FormButton from '../../common/FormButton'
import classNames from '../../../utils/classNames'
import BN from 'bn.js'

const Container = styled.div`
    border: 2px solid #F2F2F2;
    border-radius: 4px;
    padding: 10px 10px 8px 10px;
    margin-top: 10px;
    display: flex;

    .list {
        display: block;
        margin-top: 10px;
        font-family: BwSeidoRound;
        color: #24272a;
        font-size: 22px;
        font-weight: 500;
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
    
    &.no-border {
        border: 0;
        padding: 0;
    }

    button {
        &.small {
            width: auto !important;
            padding: 0px 15px !important;
            margin: auto 0 auto auto !important;
            letter-spacing: 2px !important;
        }
    }
`

export default function BalanceBox({
    title,
    amount,
    info,
    version,
    onClick,
    button,
    buttonColor,
    loading,
    disclaimer
}) {
    return (
        <Translate>
            {({ translate }) => (
                <Container className={version}>
                    <div>
                        <div className='title'>{translate(title)}
                            <Modal
                                size='mini'
                                trigger={<span className='trigger'><InfoIcon color='#999999'/></span>}
                                closeIcon
                            >
                                {translate(info)}
                            </Modal>
                        </div>
                        <Balance amount={amount} />
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