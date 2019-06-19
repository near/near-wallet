import React from 'react'
import PropTypes from 'prop-types'
import { Form, Grid } from 'semantic-ui-react'

import RequestStatusBox from '../common/RequestStatusBox'
import AccountNote from '../common/AccountNote'

import styled from 'styled-components'

const CustomForm = styled(Form)`
   &&& {
      margin-left: -1rem;

      button[type='submit'] {
         width: 288px;
         height: 60px;
         border-radius: 30px;
         border: 4px solid #0072ce;
         font-weight: 500;

         background: #0072ce;
         margin: 24px 0 0 0;

         font-size: 18px;
         color: #fff;
         letter-spacing: 2px;

         :hover {
            background: #fff;
            color: #0072ce;
         }
         :disabled {
            border: 4px solid #e6e6e6;
            background: #e6e6e6;
            opacity: 1 !important;
         }
         :active,
         :focus {
            background: #fff;
            color: #0072ce;
         }
      }

      h3.column {
         padding-bottom: 0;
      }
      .username-row {
         padding-bottom: 0px;
         margin-left: -1rem;
      }
      .form-row {
         margin-left: -1rem;
      }
      .recover {
         margin-top: 36px;
         color: #24272a;
         line-height: 24px;
         font-weight: 600;

         a {
            text-decoration: underline;

            :hover {
               text-decoration: none;
            }
         }
      }
      input {
         width: 100%;
         height: 64px;
         border: 4px solid #f8f8f8;
         padding: 0 0 0 20px;
         font-size: 18px;
         color: #4a4f54;
         font-weight: 400;
         background-color: #f8f8f8;
         position: relative;
         :focus {
            border-color: #f8f8f8;
            background-color: #fff;
         }
         :valid {
            background-color: #fff;
         }
      }
      .create {
         position: relative;
         margin-bottom: 0px;
         .react-phone-number-input__country {
            position: absolute;
            top: 24px;
            right: 22px;
            z-index: 1;

            &-select-arrow {
               display: none;
            }
         }
      }

      @media screen and (max-width: 991px) {
         
      }
      @media screen and (max-width: 767px) {
         margin-left: 0;
         .username-row {
            margin-left: 0;
         }
         .form-row {
            padding-top: 6px;
            margin-left: 0;
         }
      }
   }
`

const AccountFormSection = ({ handleSubmit, requestStatus, location, children }) => (
   <CustomForm autoComplete='off' onSubmit={handleSubmit}>
      <Grid>
         <Grid.Column computer={9} tablet={8} mobile={16}>
            {children}
         </Grid.Column>
         <Grid.Column computer={7} tablet={8} mobile={16}>
            <RequestStatusBox requestStatus={requestStatus} />

            {location && <AccountNote />}
         </Grid.Column>
      </Grid>
   </CustomForm>
)

AccountFormSection.propTypes = {
   handleSubmit: PropTypes.func.isRequired,
   requestStatus: PropTypes.object,
   location: PropTypes.object,
   children: PropTypes.element,
}

export default AccountFormSection
