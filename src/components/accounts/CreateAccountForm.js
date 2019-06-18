import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { Grid, List, Form, Button } from 'semantic-ui-react'

import ReCAPTCHA from 'react-google-recaptcha'

import RequestStatusBox from '../common/RequestStatusBox'
import CreateAccoungFormInput from './CreateAccoungFormInput'

import styled from 'styled-components'

const AccountForm = styled(Form)`
   margin-left: -1rem;

   && button {
      width: 288px;
      height: 60px;
      border-radius: 30px;
      border: 4px solid #0072ce;
      font-weight: 600;

      background: #0072ce;
      margin: 10px 0 0 0;

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


   &&& {
      h3.column {
         padding-bottom: 0;
      }
      .username-row {
         padding-bottom: 0px;
         margin-left: -1rem;
      }
      .note-box {
         padding-left: 30px;
         .border-left-bold {
            padding-bottom: 20px;
         }
      }
      .note-info {
         .title {
            letter-spacing: 2px;
            font-weight: 600;
            line-height: 20px;
            color: #4a4f54;
         }
      }
      .form-row {
         margin-left: -1rem;
      }
   }
   @media screen and (max-width: 991px) {
      &&& {
         .note-box {
            padding-left: 0px;
         }
      }
   }
   @media screen and (max-width: 767px) {
      &&& {
         margin-left: 0;
         .username-row {
            margin-left: 0;
         }
         .note-box {
            padding-left: 1rem;
            margin-top: 10px;
         }
         .note-box {
            .border-left-bold {
               padding-bottom: 0px;
            }
         }
         .form-row {
            padding-top: 6px;
            margin-left: 0;
         }
         &&& .note-info {
            font-size: 12px;
         }
      }
   }
`

const CreateAccountForm = ({
   formLoader,
   accountId,
   handleSubmit,
   handleChangeAccountId,
   handleRecaptcha,
   requestStatus
}) => (
   <AccountForm autoComplete='off' onSubmit={handleSubmit}>

<Grid>
         <Grid.Column as='h3' computer={16} tablet={16} mobile={16}>
            Choose a Username
         </Grid.Column>
         <Grid.Column computer={9} tablet={8} mobile={16}>
            <CreateAccoungFormInput
               formLoader={formLoader}
               accountId={accountId}
               handleChangeAccountId={handleChangeAccountId}
               requestStatus={requestStatus}
            />
         </Grid.Column>
         <Grid.Column computer={7} tablet={8} mobile={16}>
            <RequestStatusBox requestStatus={requestStatus} />
         </Grid.Column>
         <Grid.Column computer={9} tablet={8} mobile={16}>
            {false ? (
               <ReCAPTCHA
                  sitekey='6LfNjp8UAAAAAByZu30I-2-an14USj3yVbbUI3eN'
                  onChange={handleRecaptcha}
               />
            ) : null}
            <Button
               type='submit'
               disabled={!(requestStatus && requestStatus.success)}
            >
               CREATE ACCOUNT
            </Button>
            <div className='recover'>
               <div>Already have an account?</div>
               <Link to='/recover-account'>Recover it here</Link>
            </div>
         </Grid.Column>
         <Grid.Column computer={7} tablet={8} mobile={16}>
            <Grid className='note-box'>
               <Grid.Row>
                  <Grid.Column className='border-left-bold'>
                     <List className='note-info'>
                        <List.Item className='title'>NOTE</List.Item>
                        <List.Item>
                           Your username can be 5-32 characters
                        </List.Item>
                        <List.Item>
                           long and contain any of the following:
                        </List.Item>
                        <List.Item>• Lowercase characters (a-z)</List.Item>
                        <List.Item>• Digits (0-9)</List.Item>
                        <List.Item>• Special characters (@._-)</List.Item>
                     </List>
                  </Grid.Column>
               </Grid.Row>
            </Grid>
         </Grid.Column>
      </Grid>
   </AccountForm>
)

CreateAccountForm.propTypes = {
   formLoader: PropTypes.bool.isRequired,
   accountId: PropTypes.string,
   handleSubmit: PropTypes.func.isRequired,
   handleChangeAccountId: PropTypes.func.isRequired,
   handleRecaptcha: PropTypes.func.isRequired,
   requestStatus: PropTypes.object
}

export default CreateAccountForm
