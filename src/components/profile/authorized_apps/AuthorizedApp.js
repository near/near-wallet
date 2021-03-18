import React from 'react'
import styled from 'styled-components'
import Balance from '../../common/Balance'
import { Translate } from 'react-localize-redux'

const Container = styled.div`
    border: 2px solid #F0F0F0;
    border-radius: 8px;
    padding: 20px;

    .title {
        color: #3F4045;
        font-weight: 600;
        margin-bottom: 25px;
    }

    .key {
        color: #3F4045;
        background-color: #FAFAFA;
        border: 1px solid #F0F0F1;
        border-radius: 4px;
        padding: 8px;
        font-size: 12px;
        line-break: anywhere;
    }

    hr {
        border-style: dashed !important;
        margin: 15px 0 !important;
    }

    .fee {
        display: flex;
        align-items: center;
        justify-content: space-between;
        span {
            :first-of-type {
                color: #72727A;
            }
            :last-of-type {
                color: #272729;
                font-weight: 600;
            }
        }
    }
`

const AuthorizedApp = ({ app }) => {
    return (
        <Container className='authorized-app-box'>
            <div className='title'>{app.access_key.permission.FunctionCall.receiver_id}</div>
            <div className='key font-monospace'>{app.public_key}</div>
            <hr/>
            <div className='fee'>
                <span><Translate id='authorizedApps.feeAllowance' /></span>
                <span><Balance amount={app.access_key.permission.FunctionCall.allowance} symbol='near'/></span>
            </div>
        </Container>
    )
}

export default AuthorizedApp