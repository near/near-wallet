import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'

import { Grid, Input } from 'semantic-ui-react'

import MobileContainer from '../sign/MobileContainer'
import FormButton from '../common/FormButton'

import IconHelp from '../../images/IconHelp'

class LoginForm extends Component {
   state = {
      accountId: '',
      confirmStatus: ''
   }

   handleChange = (e, { name, value }) => {
      this.setState(() => ({
         [name]: value,
         confirmStatus: ''
      }))
   }

   handleConfirmSubmit = () => {
      if (this.state.accountId === this.props.account.accountId) {
         this.setState(() => ({
            confirmStatus: 'success'
         }))
         this.props.handleAllow()
      }
      else {
         this.setState(() => ({
            confirmStatus: 'problem'
         }))
      }
   }

   render() {
      const { appTitle, buttonLoader } = this.props
      const { accountId, confirmStatus } = this.state

      return (
         <MobileContainer>
            <Grid padded>
               <Grid.Row centered>
                  <Grid.Column
                     textAlign='center'
                     className='authorize'
                  >
                     <IconHelp color='#ff595a' />
                  </Grid.Column>
               </Grid.Row>
               <Grid.Row className='title'>
                  <Grid.Column
                     as='h1'
                     className='font-benton'
                     textAlign='center'
                     computer={16}
                     tablet={16}
                     mobile={16}
                  >
                     <div className='font-bold'>Are you sure?</div>
                     <div className='h2 font-benton'>You are granting <span className='font-bold'>full access</span> to {appTitle}!</div>
                     <div className='h2 font-benton'><br /><span className='font-bold'>To confirm</span>, please enter your username below.</div>
                  </Grid.Column>
               </Grid.Row>
            </Grid>
            <Grid padded>
               <Grid.Row centered>
                  <Grid.Column largeScreen={6} computer={8} tablet={10} mobile={16}>
                     <Input 
                        name='accountId'
                        value={accountId}
                        onChange={this.handleChange}
                        className={confirmStatus ? (confirmStatus === 'success' ? 'success' : 'problem') : ''}
                        placeholder='Username'
                        maxLength='32'
                        required
                        autoComplete='off'
                        autoCorrect='off'
                        autoCapitalize='off'
                        spellCheck='false'
                        tabIndex='1'
                     />
                     <div className='alert-info'>
                        {confirmStatus === 'problem' && `Account name doesn't match`}
                     </div>
                  </Grid.Column>
               </Grid.Row>
               <Grid.Row centered className='but-sec'>
                  <Grid.Column largeScreen={6} computer={8} tablet={10} mobile={16}>
                     <Link to='/login'>
                        <FormButton
                           color='gray-white'
                        >
                           CANCEL
                        </FormButton>
                     </Link>

                     <FormButton
                        color='blue'
                        disabled={confirmStatus !== 'problem' && accountId ? false : true}
                        sending={buttonLoader}
                        onClick={this.handleConfirmSubmit}
                     >
                        CONFIRM
                     </FormButton>
                  </Grid.Column>
               </Grid.Row>
            </Grid>
         </MobileContainer>
)}}

LoginForm.propTypes = {
   buttonLoader: PropTypes.bool.isRequired,
   appTitle: PropTypes.string,
   handleAllow: PropTypes.func.isRequired
}

const mapStateToProps = ({ account }) => ({
   account
})

export default connect(mapStateToProps)(LoginForm)
