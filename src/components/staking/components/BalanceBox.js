import React from 'react'
import styled from 'styled-components'
import Balance from '../../common/Balance'
import InfoIcon from '../../svg/InfoIcon.js'
import { Modal } from 'semantic-ui-react'
import { Translate } from 'react-localize-redux'

const Container = styled.div`
    border: 2px solid #F2F2F2;
    border-radius: 4px;
    padding: 10px;
    margin-top: 10px;

    .list {
        display: block;
        margin-top: 15px;
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

`

export default function BalanceBox({
    title,
    number,
    info,
    version
}) {
    return (
        <Translate>
            {({ translate }) => (
                <Container className={version}>
                    <div className='title'>{translate(title)}
                        <Modal
                            size='mini'
                            trigger={<span className='trigger'><InfoIcon color='#999999'/></span>}
                            closeIcon
                        >
                            {translate(info)}
                        </Modal>
                    </div>
                    <Balance amount={number} />
                </Container>
            )}
        </Translate>
    )
}