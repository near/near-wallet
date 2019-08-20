import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { Grid, Form } from 'semantic-ui-react'

import FormButton from '../common/FormButton'
import SelectAccountDropdown from './SelectAccountDropdown'

import styled from 'styled-components'

const CustomGrid = styled(Grid)`
   &&& button {
      width: 190px;
      margin-top: 0px;
      float: right;

      :first-of-type {
         float: left;
      }
   }
   @media screen and (max-width: 767px) {
      &&& {
         button,
         .deny {
            width: 140px;
            border-radius: 35px;
         }

         .buttons,
         .dropdown {
            .column {
               padding: 0px;
            }
         }
      }
   }
`

const LoginForm = ({
   dropdown,
   account,
   handleOnClick,
   handleDeny,
   handleAllow,
   handleSelectAccount,
   redirectCreateAccount,
   buttonLoader
}) => (
   <CustomGrid>
      <Grid.Row centered>
         <Grid.Column largeScreen={6} computer={8} tablet={10} mobile={16}>
            <SelectAccountDropdown
               handleOnClick={handleOnClick}
               account={account}
               dropdown={dropdown}
               handleSelectAccount={handleSelectAccount}
               redirectCreateAccount={redirectCreateAccount}
            />
         </Grid.Column>
      </Grid.Row>
      <Grid.Row className={`buttons ${dropdown ? 'hide' : ''}`}>
         <Grid.Column largeScreen={5} computer={4} tablet={3} mobile={16} />
         <Grid.Column largeScreen={6} computer={8} tablet={10} mobile={16}>
            <Form onSubmit={handleAllow}>
               <input
                  type='hidden'
                  name='accountId'
                  value={account.accountId}
               />

               <FormButton
                  color='gray-white'
                  onClick={handleDeny}
               >
                  DENY
               </FormButton>

               <FormButton
                  type='submit'
                  color='blue'
                  sending={buttonLoader}
               >
                  ALLOW
               </FormButton>
            </Form>
         </Grid.Column>
         <Grid.Column largeScreen={5} computer={4} tablet={3} mobile={16} />
      </Grid.Row>
   </CustomGrid>
)

LoginForm.propTypes = {
   dropdown: PropTypes.bool.isRequired,
   handleOnClick: PropTypes.func.isRequired,
   handleDeny: PropTypes.func.isRequired,
   handleSelectAccount: PropTypes.func.isRequired,
   redirectCreateAccount: PropTypes.func.isRequired
}

const mapStateToProps = ({ account }) => ({
   account
})

export default connect(mapStateToProps)(LoginForm)
