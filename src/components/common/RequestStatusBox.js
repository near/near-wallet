import React from 'react'
import { Grid } from 'semantic-ui-react'
import styled from 'styled-components'
import { Translate } from 'react-localize-redux'

const RequestStatusBoxGrid = styled(Grid)`
    &&& .alert-info {
        font-weight: 600;
        padding-left: 15px;

        &.problem {
            color: #ff585d;
        }
        &.success {
            color: #6ad1e3;
        }
    }

    @media screen and (max-width: 991px) {
        && {
            padding-left: 0px;
        }
        &&& .alert-info {
            padding-left: 0px;
        }
    }

    @media screen and (max-width: 767px) {
        &&& .alert-info {
            font-size: 12px;
            padding: 0px !important;
            margin: 10px 0 5px 15px;
        }

        && {
            margin-top: -12px;
        }
  }
`
/**
 * Renders request status.
 *
 * @param requestStatus {object} request status, can be null in case not completed yet / no outgoing request
 * @param requestStatus.success {boolean} true if request was succesful
 * @param requestStatus.messageCode {string} localization code of status message to display
 */
const RequestStatusBox = ({ requestStatus, accountId }) => (
    requestStatus ?
        <RequestStatusBoxGrid className='status-wrapper'>
            <Grid.Column className={`alert-info ${requestStatus.success ? 'success' : 'problem'}`}>
                <Translate id={requestStatus.messageCode} data={{ accountId: accountId }}/>
            </Grid.Column>
        </RequestStatusBoxGrid>
        : null
)

export default RequestStatusBox
