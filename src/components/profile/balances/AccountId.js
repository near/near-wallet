import React from 'react'
import styled from 'styled-components'
import CopyIcon from '../../svg/CopyIcon'

const Container = styled.div`
    display: flex;
    align-items: center;
    background-color: #F0F0F0;
    padding: 4px 4px 4px 15px;
    border-radius: 40px;
    font-weight: 500;
    max-width: 210px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    span {
        max-width: 200px;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    > div {
        background-color: white;
        min-height: 32px;
        min-width: 32px;
        height: 32px;
        width: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        margin-left: 15px;
    }
`

const AccountId = ({ id }) => {
    return (
        <Container> 
            <span>{id}</span>
            <div>
                <CopyIcon/>
            </div>
        </Container>
    )
}

export default AccountId