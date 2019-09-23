import React from 'react'
import { connect } from 'react-redux'

import { Image, Container, Message } from 'semantic-ui-react'

import IconsProblemImage from '../../images/icon-problems.svg'
import IconCheckImage from '../../images/icon-check.svg'
import CloseImage from '../../images/icon-close.svg'

import { clearAlert } from '../../actions/account'

import styled from 'styled-components'

const CustomMessage = styled(Message)`
   &&& {
      border: 2px solid #e6e6e6;
      background-color: #fff;
      border-radius: 8px;
      position: relative;
      box-shadow: none;

      .close {
         width: 20px;
         position: absolute;
         top: 16px;
         right: 16px;
         padding: 0px;
         cursor: pointer;

         &.white {
            filter: brightness(0) invert(1);
         }
      }

      .left {
         height: 38px;
         margin-top: -4px;
         margin-right: 0;
         display: none;
         filter: brightness(0) invert(1);
      }
      .content {
         color: #999;
         line-height: 20px;
         word-break: break-all;

         .header {
            font-size: 18px;
            line-height: 26px;
            font-weight: 600;
         }
      }

      &.success {
         border: 4px solid #5ace84;
         background-color: #5ace84;

         .left {
            margin-right: 12px;
            display: inline;
         }
         .content {
            color: #fff;

            .header {
               color: #fff;
            }
         }
      }
      &.error {
         border: 4px solid #ff585d;
         background-color: #ff585d;

         .left {
            margin-right: 12px;
            display: inline;
         }
         .content {
            color: #fff;

            .header {
               color: #fff;
            }
         }
      }

      @media screen and (max-width: 767px) {
         padding-left: 8px;
         padding-right: 8px;

         .content {
            font-size: 12px;
            line-height: 14px;

            .header {
               font-size: 16px;
               line-height: 20px;
            }
         }

         .close {
            width: 20px;
            position: absolute;
            top: 8px;
            right: 8px;
            padding: 0px;
            cursor: pointer;

            &.white {
               filter: brightness(0) invert(1);
            }
         }
      }
   }
`

const GlobalAlert = ({ globalAlert, clearAlert }) => (
   globalAlert ?
      <Container>
         <CustomMessage icon className={globalAlert.success ? 'success' : 'error'}>
            <Image
               onClick={clearAlert}
               src={CloseImage}
               className='close white'
            />
            {globalAlert && 
               <Image className='left' src={globalAlert.success ? IconCheckImage : IconsProblemImage} />}
            <Message.Content>
               <Message.Header>
                  {globalAlert.messageCodeHeader}
               </Message.Header>
               {globalAlert.success
                  ? globalAlert.messageCodeDescription
                  : globalAlert.messageCodeDescription || globalAlert.errorMessage}
            </Message.Content>
         </CustomMessage>
      </Container>
   : null
)

const mapDispatchToProps = {
   clearAlert
}

const mapStateToProps = ({ account }) => ({
   ...account
})

export default connect(
   mapStateToProps,
   mapDispatchToProps
)(GlobalAlert)
