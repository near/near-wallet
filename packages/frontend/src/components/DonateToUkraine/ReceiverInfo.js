import React from 'react'
import { Translate } from 'react-localize-redux'
import Breakdown from '../send/components/css/Breakdown.css'
import StyledContainer from '../send/components/entry_types/css/Style.css'

function ReceiverInfo() {
  return (
    <div style={{marginTop: 5}}>
      <Breakdown className='available-to-send-breakdown'>
        <StyledContainer>
            <Translate id='receiverInfo' />
            <div className='amount'>
                ukraine
            </div>
        </StyledContainer>
    </Breakdown>
    </div>
    
  )
}

export default ReceiverInfo