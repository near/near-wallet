import React, { Component } from 'react'
import { connect } from 'react-redux'
import { isValidPhoneNumber } from 'react-phone-number-input'
import { validateEmail } from '../../utils/account';
import AccountFormSection from './AccountFormSection'
import AccountFormContainer from './AccountFormContainer'
import SetRecoveryInfoFormPhone from './SetRecoveryInfoFormPhone'
import SetRecoveryInfoFormEmail from './SetRecoveryInfoFormEmail'
import { requestCode, setupAccountRecovery, redirectToApp, clear, clearCode } from '../../actions/account';

class SetRecoveryInfo extends Component {
   state = {
      loader: false,
      phoneNumber: '',
      email: '',
      validEmail: false,
      sentEmail: false,
      isLegit: false,
      BackupWithEmail: true
   }

   componentDidMount = () => {}

   componentWillUnmount = () => {
      this.props.clear()
      this.props.clearCode()
   }

   handlePhoneChange = (e, { name, value }) => {
      this.setState(() => ({
         [name]: value,
         isLegit: this.isLegitField(name, value)
      }))
   }

   toggleBackupMethod = () => {
      this.setState(prevState => ({
         BackupWithEmail: !prevState.BackupWithEmail
       }));
   }

   isLegitField(name, value) {
      // TODO: Use some validation framework?
      let validators = {
         phoneNumber: isValidPhoneNumber,
         securityCode: value => !!value.trim().match(/^\d{6}$/),
         email: value.length > 1
      }
      return validators[name](value);
   }

   handlePhoneSubmit = e => {
      e.preventDefault()

      if (!this.state.isLegit) {
         return false
      }

      this.setState(() => ({
         loader: true
      }))

      if (!this.props.sentSms) {
         this.props.requestCode(this.state.phoneNumber, this.props.accountId)
            .finally(() => {
               this.setState(() => ({
                  loader: false,
                  isLegit: false
               }))
               this.props.clear()
            })
      } else {
         this.props.setupAccountRecovery(this.state.phoneNumber, this.props.accountId, this.state.securityCode)
            .then(({error}) => {
               if (error) return
               this.props.redirectToApp()
            })
            .finally(() => {
               this.setState(() => ({
                  loader: false,
                  isLegit: false
               }))
            })
      }
   }

   handleEmailSubmit = () => {
      // Save email to account and send magic email
      this.setState({ sentEmail: true });
   }

   handleConfirmEmailReceived = () => {
      console.log('confirmed clicked');
      this.props.redirectToApp();
   }

   handleEmailChange = (e) => {
      let value = e.target.value;
      this.setState({ 
         email: value,
         validEmail: validateEmail(value)
      });
   }

   handleReEnterEmail = () => {
      this.setState({
         sentEmail: false,
         email: '',
      })
   }

   skipRecoverySetup = e => {
      e.preventDefault()

      const { accountId } = this.props
      let nextUrl = `/setup-seed-phrase/${accountId}`
      this.props.history.push(nextUrl)
   }

   render() {
      const combinedState = {
         ...this.props,
         ...this.state,
         isLegit: this.state.isLegit && !this.props.formLoader
      }
      const { sentSms } = this.props;
      const { sentEmail } = this.state;

      if (this.state.BackupWithEmail) {
         return (
            <AccountFormContainer 
               title={sentEmail ? 'Confirm Recovery Setup' : 'Protect your Account'}
               text={sentEmail ? 'You should have received an email with a magic link. If you ever lose access to your account, simply click the link, and your account will be restored!' : 'Enter your email address to make your account easy for you to recover in the future.'}
            >
               <AccountFormSection handleSubmit={this.handleEmailSubmit} requestStatus={this.props.requestStatus}>
                  <SetRecoveryInfoFormEmail
                     {...combinedState}
                     onChange={this.handleEmailChange}
                     skipRecoverySetup={this.skipRecoverySetup}
                     toggleBackupMethod={this.toggleBackupMethod}
                     reEnterEmail={this.handleReEnterEmail}
                     onConfirmEmailReceived={this.handleConfirmEmailReceived}
                  />
               </AccountFormSection>
            </AccountFormContainer>
      )} else {
         return (
            <AccountFormContainer 
               title={sentSms ? `Enter your Code` : `Protect your Account`}
               text={sentSms ? `We sent you a 6-digit code via SMS text. Please enter it below to find your account.` : `Enter your phone number to make your account easy for you to recover in the future.`}
            >
               <AccountFormSection handleSubmit={this.handlePhoneSubmit} requestStatus={this.props.requestStatus}>
                  <SetRecoveryInfoFormPhone
                     {...combinedState}
                     handleChange={this.handlePhoneChange}
                     skipRecoverySetup={this.skipRecoverySetup}
                     toggleBackupMethod={this.toggleBackupMethod}
                  />
               </AccountFormSection>
            </AccountFormContainer>
      )}
   }
}

const mapDispatchToProps = {
   requestCode,
   setupAccountRecovery,
   redirectToApp,
   clear,
   clearCode
}

const mapStateToProps = ({ account }, { match }) => ({
   ...account,
   accountId: match.params.accountId
})

export const SetRecoveryInfoWithRouter = connect(mapStateToProps, mapDispatchToProps)(SetRecoveryInfo)
