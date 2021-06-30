import React from 'react'
import { Translate } from 'react-localize-redux'
import StyledContainer from './Style.css'

const Receiver = ({ receiverId, translate }) => {
    /* TODO: Handle long Account ID & Add icon */
    return (
        <StyledContainer>
            <Translate id={translate} />
            <div className='receiver'>{receiverId}</div>
        </StyledContainer>
    )
}

export default Receiver