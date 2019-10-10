import React, { Component } from 'react'
import { connect } from 'react-redux'

import { withRouter, Link } from 'react-router-dom'

import PropTypes from 'prop-types'

import GlobalAlert from './GlobalAlert'

import {
   Image,
   Menu,
   Responsive,
   Segment,
   List,
   Button
} from 'semantic-ui-react'

import PopupMenuTrigger from './PopupMenuTrigger'

import SendImage from '../../images/icon-send.svg'
import ContactsGreyImage from '../../images/icon-contacts.svg'
import AuthorizedGreyImage from '../../images/icon-authorized.svg'
import LogoutImage from '../../images/icon-logout.svg'
import LogoImage from '../../images/wallet.png'
import AccountGreyImage from '../../images/icon-account.svg'
import RecentImage from '../../images/icon-recent.svg'
import ActivityImage from '../../images/icon-activity.svg'

import { refreshAccount, switchAccount } from '../../actions/account'

import styled from 'styled-components'

const CustomResponsive = styled(Responsive)`
   &&& {
      .navbar {
         padding: 0px;
         padding-bottom: 1rem;
         
         &-main {
            background-color: #24272a;
            height: 72px;
            border-radius: 0;
            margin-bottom: 0;
            .mainlogo {
               float: left;
               padding: 4px 10px 0px 0px;
               div {
                  width: 50px;
                  overflow: hidden;
                  > img.image {
                     width: 160px;
                     max-width: none;
                  }
               }
            }
            .trigger {
               width: 100%;
               overflow: hidden;
            }
         }
         &-sub {
            margin: 0px;
            padding: 0px;
            background-color: #24272a;
            &.hide {
               display: none;
            }
            .main {
               font-family: 'benton-sans', sans-serif;
               font-weight: 400;
               font-size: 14px;
               padding: 18px 6px;
               margin: 0 1rem;
               border-top: 1px solid #4a4f54;
               color: #fff;
               letter-spacing: 2px;
               
               &.border {
                  border-bottom: 1px solid #4a4f54;
               }
               img {
                  margin-top: -4px;
                  width: 24px;
                  margin-right: 20px;
                  display: inline-block !important;
               }
            }
            .sub {
               padding: 10px 1rem 0 1rem;
               .item {
                  font-family: 'benton-sans', sans-serif;
                  font-weight: 400;
                  font-size: 14px;
                  padding: 8px 9px;
                  color: #8fd6bd;
                  letter-spacing: 2px;
                  
                  img {
                     margin-top: -2px;
                     width: 18px;
                     margin-right: 22px;
                     display: inline-block !important;
                  }
               }
            }
            .switch-account {
               background: #000;
               padding: 0 1rem;
               padding: 20px;
               .item {
                  padding: 0 10px;
               }
               h6.item {
                  padding-bottom: 10px;
                  border: 0px;
               }
               .account-title {
                  height: 40px;
                  line-height: 40px;
                  color: #fff;
                  font-weight: 500;
                  border-bottom: 1px solid #323434;
                  letter-spacing: normal;
                  text-overflow: ellipsis;
                  overflow: hidden;
               }
               button {
                  width: 100%;
                  border-radius: 30px;
                  background: #24272a;
                  color: #6ad1e3;
                  :hover {
                     background: #fff;
                     color: #6ad1e3;
                  }
               }
            }
         }
      }
   }
`

const getWidth = () => {
   const isSSR = typeof window === 'undefined'
   return isSSR ? Responsive.onlyTablet.minWidth : window.innerWidth
}

class MobileView extends Component {
   static propTypes = {
      children: PropTypes.node
   }

   static defaultProps = {
      children: ''
   }

   state = {
      dropdown: true
   }

   handleDropdown = () =>
      this.setState(state => ({
         dropdown: !state.dropdown
      }))

   handleSelectAccount = accountId => {
      this.props.switchAccount(accountId)
      this.props.refreshAccount(true)
      this.handleDropdown()
      this.props.history.push(`/`)
   }

   redirectCreateAccount = () => {
      this.handleDropdown()
      this.props.history.push('/create')
   }

   render() {
      const { dropdown } = this.state
      const { account } = this.props

      return (
         <CustomResponsive
            getWidth={getWidth}
            maxWidth={Responsive.onlyTablet.maxWidth}
         >
            
            <Segment basic className='navbar'>
               <Menu className='navbar-main' borderless>
                  <div className='mainlogo'>
                     <Link to='/'>
                        <div>
                           <Image src={LogoImage} />
                        </div>
                     </Link>
                  </div>

                  {account.accountId && (
                     <div className='trigger'>
                        <PopupMenuTrigger
                           account={account}
                           handleClick={this.handleDropdown}
                           type='mobile'
                           dropdown={dropdown}
                        />
                     </div>
                  )}
               </Menu>
               <Segment
                  basic
                  className={`navbar-sub ${dropdown ? `hide` : ``}`}
               >
                  <Menu.Menu>
                     <Link to='/' onClick={this.handleDropdown}>
                        <Menu.Item className='main'>
                           <Image src={RecentImage} />
                           SUMMARY
                        </Menu.Item>
                     </Link>
                     {false ? (
                        <Link to='/activity' onClick={this.handleDropdown}>
                           <Menu.Item className='main'>
                              <Image src={ActivityImage} />
                              ACTIVITY
                           </Menu.Item>
                        </Link>
                     ) : null}
                     <Link to='/send-money' onClick={this.handleDropdown}>
                        <Menu.Item className='main border'>
                           <Image src={SendImage} />
                           SEND MONEY
                        </Menu.Item>
                     </Link>

                     <Menu.Menu className='sub'>
                        <Link to='/profile' onClick={this.handleDropdown}>
                           <Menu.Item>
                              <Image src={AccountGreyImage} />
                              Profile
                           </Menu.Item>
                        </Link>
                        {false ? (
                           <Link to='/contacts' onClick={this.handleDropdown}>
                              <Menu.Item>
                                 <Image src={ContactsGreyImage} />
                                 Contacts
                              </Menu.Item>
                           </Link>
                        ) : null}
                        <Link to='/authorized-apps' onClick={this.handleDropdown}>
                           <Menu.Item>
                              <Image src={AuthorizedGreyImage} />
                              Authorized Apps
                           </Menu.Item>
                        </Link>
                        {false ? (
                           <Link to='/' onClick={this.handleDropdown}>
                              <Menu.Item>
                                 <Image src={LogoutImage} />
                                 Logout
                              </Menu.Item>
                           </Link>
                        ) : null}
                     </Menu.Menu>
                     <Segment basic className='switch-account'>
                        <List>
                           <List.Item as='h6'>SWITCH ACCOUNT</List.Item>

                           {account.accounts &&
                              Object.keys(account.accounts)
                                 .filter(a => a !== account.accountId)
                                 .map((account, i) => (
                                    <List.Item
                                       as='a'
                                       key={`mf-${i}`}
                                       onClick={() =>
                                          this.handleSelectAccount(account)
                                       }
                                       className='account-title'
                                    >
                                       @{account}
                                    </List.Item>
                                 ))}
                        </List>
                        <Button onClick={this.redirectCreateAccount}>
                           CREATE NEW ACCOUNT
                        </Button>
                     </Segment>
                  </Menu.Menu>
               </Segment>
            </Segment>
            <GlobalAlert />
         </CustomResponsive>
      )
   }
}

const mapDispatchToProps = {
   refreshAccount,
   switchAccount
}

const mapStateToProps = ({ account }) => ({
   account
})

export default connect(
   mapStateToProps,
   mapDispatchToProps
)(withRouter(MobileView))
