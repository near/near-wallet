import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import FormButton from '../common/FormButton'
import MobileContainer from './MobileContainer'
import SignAnimatedArrow from './SignAnimatedArrow'
import SelectAccountDropdown from '../login/SelectAccountDropdown'

import { refreshAccount, switchAccount } from '../../actions/account'

import { Grid, Form } from 'semantic-ui-react'

class SignTransferReady extends Component {
   state = {
      dropdown: false
   }

   handleOnClick = () => {
      this.setState({
         dropdown: !this.state.dropdown
      })
   }

   handleSelectAccount = accountId => {
      this.props.switchAccount(accountId)
      this.props.refreshAccount(false)
   }

   redirectCreateAccount = () => {
      this.props.history.push('/create')
   }

   render() {
      const { appTitle = 'CryptoCorgis', transferTransferring, handleAllow, handleDeny, account } = this.props
      const { dropdown } = this.state

      return (
         <MobileContainer>
            <Grid padded>
               <Grid.Row centered>
                  <Grid.Column
                     textAlign='center'
                     className='authorize'
                     
                  >
                     <SignAnimatedArrow animate={transferTransferring}  />
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
                     <span className='font-bold'>{appTitle} </span> 
                     wants to 
                     <span className='font-bold'> withdraw 1.345 Ⓝ </span>
                  </Grid.Column>
               </Grid.Row>
               <Grid.Row centered>
                  <Grid.Column
                     largeScreen={12}
                     computer={14}
                     tablet={16}
                     className='cont'
                     textAlign='center'
                  >
                     <div className="fees">
                        Estimated Fees: .00043 Ⓝ
                     </div>
                     <div className="gas">
                        Gas Limit: 21000
                     </div>
                     <div className="gas">
                        Gas Price: .0000000021 Ⓝ
                     </div>
                  </Grid.Column>
               </Grid.Row>
            </Grid>
            <Grid padded>
               <Grid.Row centered>
                  <Grid.Column largeScreen={6} computer={8} tablet={10} mobile={16}>
                     <SelectAccountDropdown
                        handleOnClick={this.handleOnClick}
                        account={account}
                        dropdown={dropdown}
                        handleSelectAccount={this.handleSelectAccount}
                        redirectCreateAccount={this.redirectCreateAccount}
                     />
                  </Grid.Column>
               </Grid.Row>
               <Grid.Row centered className='but-sec'>
                  <Grid.Column largeScreen={6} computer={8} tablet={10} mobile={16}>
                     <Form onSubmit={handleAllow}>
                        <input
                           type='hidden'
                           name='accountId'
                           // value={account.accountId}
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
                        >
                           ALLOW
                        </FormButton>
                     </Form>
                  </Grid.Column>
               </Grid.Row>
               <Grid.Row centered className='contract'>
                  <Grid.Column
                     largeScreen={12}
                     computer={14}
                     tablet={16}
                     textAlign='center'
                  >
                     Contract: @contractname.near
                  </Grid.Column>
               </Grid.Row>
            </Grid>
         </MobileContainer>
      )
   }
}

const mapDispatchToProps = {
   refreshAccount,
   switchAccount,
}

const mapStateToProps = ({ account }) => ({
   account
})

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(SignTransferReady))
