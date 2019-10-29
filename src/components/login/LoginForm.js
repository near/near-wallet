import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Link, withRouter } from 'react-router-dom'

import { Grid } from 'semantic-ui-react'

import MobileContainer from '../sign/MobileContainer'
import FormButton from '../common/FormButton'
import SelectAccountDropdown from './SelectAccountDropdown'

import IconProblems from '../../images/IconProblems'
import IconAuthorize from '../../images/IconAuthorize'

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
   buttonLoader,
   match
}) => (
   <MobileContainer>
      <Grid padded>
         <Grid.Row centered>
            <Grid.Column
               textAlign='center'
               className='authorize'
            >
               {contractId && (
                  <IconAuthorize color='#999' />
               )}
               {!contractId && (
                  <IconProblems color='#fca347' />
               )}
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
               {contractId && (
                  <Fragment>
                     <div className='font-bold'>{appTitle}</div>
                     <div className='h2'>is requesting to </div>
                     <div className='h2'>access your account.</div>
                  </Fragment>
               )}
               {!contractId && (
                  <Fragment>
                     <div className='font-bold'>{appTitle}</div>
                     <div className='h2 font-benton'>is requesting <span className='font-bold'>full access</span></div>
                     <div className='h2 font-benton'>to your account.</div>
                  </Fragment>
               )}
            </Grid.Column>
         </Grid.Row>
         <Grid.Row>
            <Grid.Column
               textAlign='center'
               computer={16}
               tablet={16}
               mobile={16}
               className='color-black'
            >
               {contractId && (
                  <div>This does not allow the app to transfer any tokens.</div>
               )}
               {!contractId && (
                  <div>This provides access to <span className='font-bold'>all of your tokens</span>.<br />Proceed with caution!.</div>
               )}
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
               <Link to={`${match.url}${match.url.substr(-1) === '/' ? '' : '/'}details`}>
                  <div className='more-information'>
                     More information
                  </div>
               </Link>
            </Grid.Column>
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
               <FormButton
                  color='gray-white'
                  onClick={handleDeny}
               >
                  DENY
               </FormButton>

               {contractId && (
                  <FormButton
                     color='blue'
                     sending={buttonLoader}
                     onClick={handleAllow}
                  >
                     ALLOW
                  </FormButton>
               )}
               {!contractId && (
                  <Link to={`${match.url}${match.url.substr(-1) === '/' ? '' : '/'}confirm`}>
                     <FormButton
                        color='blue'
                        sending={buttonLoader}
                     >
                        ALLOW
                     </FormButton>
                  </Link>
               )}
            </Grid.Column>
         </Grid.Row>
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

export default connect(mapStateToProps)(withRouter(LoginForm))
