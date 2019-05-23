import React from 'react'
import PropTypes from 'prop-types'
import { Form } from 'semantic-ui-react'

import ProblemsImage from '../../images/icon-problems.svg'
import CheckBlueImage from '../../images/icon-check-blue.svg'

import styled from 'styled-components'

const CustomFormInput = styled(Form.Input)`
   &&&& input {
      width: 100%;
      height: 64px;
      border: 4px solid #f8f8f8;
      padding: 0 0 0 20px;

      font-size: 18px;
      color: #4a4f54;
      font-weight: 400;
      background: 0;

      position: relative;

      :focus {
         border-color: #6ad1e3;
      }
   }

   &&&&& .spinner {
      margin-right: 20px;

      :before,
      :after {
         top: 28px;
         width: 24px;
         height: 24px;
      }
   }

   &.problem > .input > input,
   &.problem > .input > input:focus {
      background: url(${ProblemsImage}) right 22px center no-repeat;
      background-size: 24px 24px;
   }

   &.success > .input > input,
   &.success > .input > input:focus {
      background: url(${CheckBlueImage}) right 22px center no-repeat;
      background-size: 24px 24px;
   }
`

const CreateAccoungFormInput = ({
   formLoader,
   accountId,
   handleChangeAccountId,
   successMessage,
   errorMessage
}) => (
   <CustomFormInput
      loading={formLoader}
      className={`create ${successMessage ? 'success' : ''}${
         errorMessage ? 'problem' : ''
      }`}
      name='accountId'
      value={accountId}
      onChange={handleChangeAccountId}
      placeholder='example: satoshi.near'
   />
)

CreateAccoungFormInput.propTypes = {
   formLoader: PropTypes.bool.isRequired,
   accountId: PropTypes.string,
   handleChangeAccountId: PropTypes.func.isRequired,
   successMessage: PropTypes.bool.isRequired,
   errorMessage: PropTypes.bool.isRequired
}

export default CreateAccoungFormInput
