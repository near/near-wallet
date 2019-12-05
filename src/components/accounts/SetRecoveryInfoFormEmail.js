import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Header, Input } from 'semantic-ui-react'
import FormButton from '../common/FormButton'
import AccountSkipThisStep from '../common/AccountSkipThisStep'

const FormWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;

   &.sent-email {
		margin-top: -30px;

		.button {
			margin: 0 0 20px 0;
		}

		h3 {
			font-size: 24px !important;
			line-height: 40px !important;
			margin-bottom: 20px;

			@media (max-width: 767px) {
				font-size: 14px !important;
			}

			&.email {
				span {
					background-color: #f8f8f8;
					padding: 3px 10px;
				}

				@media (max-width: 767px) {
					margin-top: 10px;
				}
			}
		}
   }
`;

const EmailReEnter = styled.div`
	border-top: 4px solid #f8f8f8 !important;
	padding-top: 20px;
`;

const SetRecoveryInfoFormEmail = ({
   loader,
   email,
	validEmail,
	sentEmail,
   onChange,
	skipRecoverySetup,
	toggleBackupMethod,
	reEnterEmail,
	onConfirmEmailReceived
}) => (
	<Fragment>
		{!sentEmail && (
			<FormWrapper>
				<Header as='h4'>Email Address</Header>
				<Input
					name='email'
					onChange={onChange}
					value={email}
					placeholder='example@email.com'
					required
					tabIndex='2'
					className='email-address'
					type='text'
				/>
				<div className='link toggle-backup' onClick={toggleBackupMethod}>
					Use phone instead
				</div>
				<FormButton
					type='submit'
					color='blue'
					disabled={(!validEmail || email.length === 0)}
					sending={loader}
				>
					PROTECT ACCOUNT
				</FormButton>
				<AccountSkipThisStep skipRecoverySetup={skipRecoverySetup} />
			</FormWrapper>
		)}
		{sentEmail && (
			<FormWrapper className='sent-email'>
				<h3 className='email'>Please confirm receipt of this email at: <span>{email}</span></h3>
				<FormButton
					onClick={onConfirmEmailReceived}
					color='blue'
				>
					CONFIRM
				</FormButton>
				<EmailReEnter>
					If you did not yet receive this email, or the above email address is incorrect, <span className='link' onClick={reEnterEmail}>click here</span> to Re-enter your email and resend.
				</EmailReEnter>
			</FormWrapper>
		)}
	</Fragment>
)

SetRecoveryInfoFormEmail.propTypes = {
   loader: PropTypes.bool.isRequired,
   email: PropTypes.string,
   sentEmail: PropTypes.bool,
   onChange: PropTypes.func.isRequired,
   skipRecoverySetup: PropTypes.func,
}

export default SetRecoveryInfoFormEmail;
