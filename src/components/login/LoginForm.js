import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { Grid, Form, List } from 'semantic-ui-react'

import MobileContainer from '../sign/MobileContainer'
import FormButton from '../common/FormButton'
import SelectAccountDropdown from './SelectAccountDropdown'

import AuthorizeImage from '../../images/icon-authorize.svg'

const LoginForm = ({
   dropdown,
   account,
   appTitle,
   contractId,
   handleOnClick,
   handleDeny,
   handleAllow,
   handleSelectAccount,
   redirectCreateAccount,
   buttonLoader
}) => (
   <MobileContainer>
      <Grid padded>
         <Grid.Row centered>
            <Grid.Column
               textAlign='center'
               className='authorize'
            >
               <AuthorizeImage />
            </Grid.Column>
         </Grid.Row>
         <Grid.Row className='title'>
            <Grid.Column
               as='h2'
               textAlign='center'
               computer={16}
               tablet={16}
               mobile={16}
            >
               <span className='font-bold'>{appTitle} </span> is requesting
               to use your NEAR account.
            </Grid.Column>
         </Grid.Row>
         <Grid.Row centered>
            <Grid.Column
               largeScreen={contractId ? 6 : 8}
               computer={contractId ? 7 : 8}
               tablet={contractId ? 8 : 10}
               mobile={contractId ? 8 : 16}
               className='cont'
            >
               {contractId &&
                  <List className='border-right-light'>
                     <List.Item as='h3'>This allows the app to:</List.Item>
                     <List.Item className='list-item'>
                        <List.Content className='color-black'>
                           View your account name
                        </List.Content>
                     </List.Item>
                     <List.Item className='list-item'>
                        <List.Content className='color-black'>
                           Interact with this app's smart contract on your behalf (e.g. calling functions)
                        </List.Content>
                     </List.Item>
                     <List.Item className='list-item'>
                        <List.Content className='color-black'>
                           {'Use your NEAR balance for fees (limited to < 0.01 NEAR)'}
                        </List.Content>
                     </List.Item>
                  </List>
               }
               {!contractId &&
                  <List>
                     <List.Item as='h3'>This allows the app to:</List.Item>
                     <List.Item className='list-item'>
                        <List.Content className='color-black'>
                           Create new accounts
                        </List.Content>
                     </List.Item>
                     <List.Item className='list-item'>
                        <List.Content className='color-black'>
                           Transfer tokens from your account to other accounts
                        </List.Content>
                     </List.Item>
                     <List.Item className='list-item'>
                        <List.Content className='color-black'>
                           Deploy smart contracts
                        </List.Content>
                     </List.Item>
                     <List.Item className='list-item'>
                        <List.Content className='color-black'>
                           Call functions on any smart contract
                        </List.Content>
                     </List.Item>
                     <List.Item className='list-item'>
                        <List.Content className='color-black'>
                           Stake and unstake NEAR tokens
                        </List.Content>
                     </List.Item>
                     <List.Item className='list-item'>
                        <List.Content className='color-black'>
                           Create and delete access keys
                        </List.Content>
                     </List.Item>
                  </List>
               }
            </Grid.Column>
            {contractId &&
               <Grid.Column
                  largeScreen={6}
                  computer={7}
                  tablet={8}
                  className='cont'
               >
                  <List>
                     <List.Item as='h3'>Does not allow:</List.Item>
                     <List.Item className='list-item-deny'>
                        <List.Content className='color-black'>
                           Transfer NEAR tokens
                        </List.Content>
                     </List.Item>
                  </List>
               </Grid.Column>
            }
         </Grid.Row>
      </Grid>
      <Grid padded>
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
         <Grid.Row centered className='but-sec'>
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
         </Grid.Row>
         {contractId && (
            <Grid.Row centered className='contract'>
               <Grid.Column
                  largeScreen={12}
                  computer={14}
                  tablet={16}
                  textAlign='center'
               >
                  Contract: {contractId}
               </Grid.Column>
            </Grid.Row>
         )}
      </Grid>
   </MobileContainer>
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
