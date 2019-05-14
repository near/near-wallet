import React, { Component } from 'react'
import { connect } from 'react-redux'

import { withRouter, Link } from 'react-router-dom'

import PropTypes from 'prop-types'

import { Wallet } from '../../utils/wallet'

import {
   Image,
   Menu,
   Responsive,
   Segment,
   List,
   Button,
   Loader
} from 'semantic-ui-react'

import SendImage from '../../images/icon-send.svg'
import ContactsGreyImage from '../../images/icon-contacts-grey.svg'
import AuthorizedGreyImage from '../../images/icon-authorized-grey.svg'
import LogoutImage from '../../images/icon-logout.svg'
import LogoImage from '../../images/wallet.png'
import AccountGreyImage from '../../images/icon-account-grey.svg'
import ArrowDownImage from '../../images/icon-arrow-down.svg'
import RecentImage from '../../images/icon-recent.svg'
import ActivityImage from '../../images/icon-activity.svg'

import { handleRefreshAccount } from '../../actions/account'

import styled from 'styled-components'

const CustomResponsive = styled(Responsive)`
   &&& {
      padding-bottom: 240px;

      .navbar {
         padding: 0px;

         &-main {
            background-color: #24272a;
            height: 72px;
            border-radius: 0;
            margin-bottom: 0;

            .mainlogo {
               padding-left: 0px;

               > div {
                  width: 50px;
                  overflow: hidden;

                  > img.image {
                     width: 160px;
                     max-width: none;
                  }
               }
            }

            .account-name {
               padding-right: 0px;

               > div {
                  font-size: 16px;
                  letter-spacing: normal;
                  padding-left: 0px;
                  padding-right: 0px;
                  text-overflow: ellipsis;
                  overflow: hidden;
                  width: 116px;
                  color: #fff;

                  :hover {
                     color: #fff;
                  }
               }
            }

            .account-tokens {
               line-height: 24px;
               font-size: 16px;

               color: #fff;

               margin: 23px 0 0 10px;
               height: 24px;
               background: #111314;
               border-radius: 12px;
               padding: 0 10px;

               letter-spacing: normal;

               :hover {
                  color: #fff;
               }

               .near {
                  font-size: 18px;
                  padding-left: 4px;
               }
            }

            .account-arrow {
               padding-right: 14px;

               img {
                  width: 12px;
               }
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
               border-top: 2px solid #363b3e;

               &.border {
                  border-bottom: 2px solid #363b3e;
               }

               a {
                  color: #fff;
                  letter-spacing: 2px;
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

                  a {
                     color: #6ad1e3;
                     letter-spacing: 2px;
                  }

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
      this.wallet = new Wallet()
      this.wallet.selectAccount(accountId)
      this.props.handleRefreshAccount(this.wallet, this.props.history)
      this.handleDropdown()
   }

   redirectCreateAccount = () => {
      this.wallet = new Wallet()
      this.handleDropdown()
      this.wallet.redirectToCreateAccount({}, this.props.history)
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
               <Menu
                  className='navbar-main'
                  // fixed={fixed ? 'top' : null}
                  // fixed='top'
                  // pointing={!fixed}
                  borderless
               >
                  <Menu.Item as={Link} to='/' className='mainlogo'>
                     <div>
                        <Image src={LogoImage} />
                     </div>
                  </Menu.Item>
                  <Menu.Menu position='right' onClick={this.handleDropdown}>
                     <Menu.Menu position='right' className=''>
                        <Menu.Item className='account-name'>
                           {account.loader || !account.accountId ? (
                              <Loader active inline size='mini' />
                           ) : (
                              <div>@{account.accountId}</div>
                           )}
                        </Menu.Item>
                        <Menu.Item className='account-tokens'>
                           {account.loader || !account.accountId ? (
                              <Loader active inline size='mini' />
                           ) : (
                              account.amount
                           )}
                           <span className='near'>Ⓝ</span>
                        </Menu.Item>
                        <Menu.Item className='account-arrow'>
                           <Image src={ArrowDownImage} />
                        </Menu.Item>
                     </Menu.Menu>
                  </Menu.Menu>
               </Menu>
               <Segment
                  basic
                  className={`navbar-sub ${dropdown ? `hide` : ``}`}
               >
                  <Menu.Menu>
                     <Menu.Item className='main'>
                        <Link to='/' onClick={this.handleDropdown}>
                           <Image src={RecentImage} />
                           SUMMARY
                        </Link>
                     </Menu.Item>
                     <Menu.Item className='main'>
                        <Link to='/activity' onClick={this.handleDropdown}>
                           <Image src={ActivityImage} />
                           ACTIVITY
                        </Link>
                     </Menu.Item>
                     <Menu.Item className='main border'>
                        <Link to='/send-money' onClick={this.handleDropdown}>
                           <Image src={SendImage} />
                           SEND MONEY
                        </Link>
                     </Menu.Item>

                     <Menu.Menu className='sub'>
                        <Menu.Item>
                           <Link to='/profile' onClick={this.handleDropdown}>
                              <Image src={AccountGreyImage} />
                              Profile
                           </Link>
                        </Menu.Item>
                        <Menu.Item>
                           <Link to='/contacts' onClick={this.handleDropdown}>
                              <Image src={ContactsGreyImage} />
                              Contacts
                           </Link>
                        </Menu.Item>
                        <Menu.Item>
                           <Link
                              to='/authorized-apps'
                              onClick={this.handleDropdown}
                           >
                              <Image src={AuthorizedGreyImage} />
                              Authorized Apps
                           </Link>
                        </Menu.Item>
                        <Menu.Item>
                           <Link to='/' onClick={this.handleDropdown}>
                              <Image src={LogoutImage} />
                              Logout
                           </Link>
                        </Menu.Item>
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

            {this.props.children}
         </CustomResponsive>
      )
   }
}

const mapDispatchToProps = {
   handleRefreshAccount
}

const mapStateToProps = ({ account }) => ({
   account
})

export default connect(
   mapStateToProps,
   mapDispatchToProps
)(withRouter(MobileView))
