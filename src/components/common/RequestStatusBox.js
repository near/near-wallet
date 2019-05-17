import React from 'react'
import { Grid, Responsive } from 'semantic-ui-react'
import styled from 'styled-components'

const RequestStatusBoxGrid = styled(Grid)`
   &&& .alert-info {
      font-size: 18px;
      font-weight: 600;
      line-height: 64px;
      margin: 0 0 0 0;
      padding-left: 0px;

      &.problem {
         color: #ff585d;
      }
      &.success {
         color: #6ad1e3;
      }
   }

   && {
      padding-left: 30px;
   }

   @media screen and (max-width: 991px) {
      .note-box {
         padding-left: 0px;
      }
   }

   @media screen and (max-width: 767px) {
      &&& .alert-info {
         padding: 0 0 0 24px;
         line-height: 34px;
         font-size: 14px;
      }

      && {
         padding-left: 1rem;
         margin-top: 10px;
      }
  }
`

const RequestStatusBox = ({ requestStatus }) => (
   requestStatus ?
      <RequestStatusBoxGrid>
         <Responsive
            as={Grid.Row}
            minWidth={Responsive.onlyTablet.minWidth}
         >
            <Grid.Column className={`alert-info ${requestStatus.success ? 'success' : 'problem'}`}>
               {requestStatus.messageCode}
            </Grid.Column>
         </Responsive>
      </RequestStatusBoxGrid>
      : null
)

export default RequestStatusBox