import React from 'react'
import { Grid } from 'semantic-ui-react'
import styled from 'styled-components'
import { Translate } from 'react-localize-redux'

const RequestStatusBoxGrid = styled(Grid)`
    &&& .alert-info {
        font-size: 18px;
        font-weight: 600;
        line-height: 64px;
        margin: 16px 0 0 0;
        padding-left: 30px;

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
            line-height: 20px;
            font-size: 12px;
            padding: 0px !important;
            text-align: left;
            margin: 24px 0 0 16px;
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
const RequestStatusBox = ({ requestStatus }) => (
    requestStatus ?
        <RequestStatusBoxGrid>
            <Grid.Column className={`alert-info ${requestStatus.success ? 'success' : 'problem'}`}>
                <Translate id={requestStatus.messageCode} />
            </Grid.Column>
        </RequestStatusBoxGrid>
        : null
)

export default RequestStatusBox
