import React from 'react'
import { Translate } from 'react-localize-redux'
import styled from 'styled-components';
import Tooltip from '../common/Tooltip'

const TooltipDonateInfoWrapper = styled.div`
    font-size: 14px;
    margin-bottom: 10px;
    color: #a2a2a8;
    margin-top: 0;
    display: flex;
    align-items: center;
    justify-content: center;
`

function TooltipDonateInfo() {
  return (
    <TooltipDonateInfoWrapper>
        <Translate id='wallet.donationInfoText' />{' '}
        <Tooltip translate='donationInfo' />
    </TooltipDonateInfoWrapper>
  )
}

export default TooltipDonateInfo