import React from 'react'
import Modal from '../common/modal/Modal'
import { Translate } from 'react-localize-redux'
import styled from 'styled-components'
import BinanceLogo from '../../images/binance-logo.svg'
import HuobiLogo from '../../images/huobi-logo.svg'
import OkexLogo from '../../images/okex-logo.svg'

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 40px 0 30px 0;

    .sub-title {
        color: #72727A;
        font-size: 16px;
        line-height: 150%;
        text-align: center;
        margin: 20px 0 30px 0;
    }

    a {
        border: 2px solid #F5F5F3;
        border-radius: 8px;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 110px;
        margin: 10px 0;
        transition: 100ms;

        :hover {
            border-color: #8FCDFF;
            background-color: #F0F9FF;
        }
    }
`

const WhereToBuyNearModal = ({ open, onClose }) => {
    return (
        <Modal
            id='where-to-buy-modal'
            isOpen={open}
            onClose={onClose}
            closeButton='true'
            modalSize='md'
        >
            <Container>
                <h2><Translate id='account.createImplicit.pre.whereToBuy.title'/></h2>
                <div className='sub-title'><Translate id='account.createImplicit.pre.whereToBuy.desc'/></div>
                <a href='https://www.binance.com/' target='_blank' rel='noreferrer'>
                    <img src={BinanceLogo} alt='BINANCE'/>
                </a>
                <a href='https://www.huobi.com/' target='_blank' rel='noreferrer'>
                    <img src={HuobiLogo} alt='HUOBI'/>
                </a>
                <a href='https://www.okex.com/' target='_blank' rel='noreferrer'>
                    <img src={OkexLogo} alt='OKEX'/>
                </a>
            </Container>
        </Modal>
    );
}

export default WhereToBuyNearModal