import React, { Component } from 'react'
import { connect } from 'react-redux'

import { withRouter } from 'react-router-dom'

import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import DesktopPopup from './DesktopPopup'

import { Wallet } from '../../utils/wallet'

import { Image, Menu, Responsive, Segment, Visibility } from 'semantic-ui-react'

import LogoImage from '../../images/wallet.png'
import HelpImage from '../../images/icon-help.svg'
import ActivityImage from '../../images/icon-activity.svg'
import RecentImage from '../../images/icon-recent.svg'
import SendImage from '../../images/icon-send.svg'

import { handleRefreshAccount } from '../../actions/account'

import styled from 'styled-components'

const CustomResponsive = styled(Responsive)`
   padding-bottom: 180px;

   .spacer {
      height: 72px;
   }

   &&& .navbar {
      background-color: #24272a;
      height: 72px;
      border-radius: 0;

      &-icon {
         height: 24px;
         margin-right: 14px;
         display: inline-block;
      }
      .item {
         color: white;
         font-family: 'benton-sans', sans-serif;
         font-weight: 600;
         font-size: 14px;
         padding-left: 0px;
         padding-right: 30px;
         letter-spacing: 2px;

         .mainlogo {
            width: 220px;
         }
      }

      a.item:hover {
         color: #6ad1e3;
      }
      .hover.item {
         color: #6ad1e3;
      }
      .account-img {
         width: 36px;
         height: 36px;
         background: #4a4f54;
         padding-right: 0px;
         padding-left: 6px;
         border-radius: 18px;
         margin-top: 16px;

         > img {
            width: 24px;
            height: 24px;
         }
      }
      .item.account-name {
         font-size: 14px;
         letter-spacing: normal;
         padding-left: 10px;
         padding-right: 10px;

         :hover {
            color: #fff;
         }
      }
      .account-tokens {
         line-height: 24px;
         font-size: 14px;

         color: #fff;

         margin: 23px 20px 0 10px;
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
         padding-right: 26px;

         img {
            width: 12px;
         }
      }

      .popup-container {
         .popup-trigger {
            cursor: pointer;
         }
         .devider {
            width: 2px;
            height: 40px;
            background: #5d5f60;
            padding: 0px;
            margin: 16px 28px 0 0;
         }

         .help {
            padding-right: 12px;
         }
      }
   }
`

const getWidth = () => {
   const isSSR = typeof window === 'undefined'
   return isSSR ? Responsive.onlyTablet.minWidth : window.innerWidth
}

class DesktopView extends Component {
   static propTypes = {
      children: PropTypes.node
   }

   static defaultProps = {
      children: ''
   }

   state = {
      fixed: false,
      activeItem: 'home',
      popupOpen: false
   }

   hideFixedMenu = () => this.setState({ fixed: false })

   showFixedMenu = () => this.setState({ fixed: true })

   handleItemClick = (e, { name }) => this.setState({ activeItem: name })

   handleSelectAccount = accountId => {
      this.wallet = new Wallet()
      this.wallet.selectAccount(accountId)
      this.props.handleRefreshAccount(this.wallet, this.props.history)
   }

   redirectCreateAccount = () => {
      this.wallet = new Wallet()
      this.wallet.redirectToCreateAccount({}, this.props.history)
   }

   render() {
      const { fixed, popupOpen } = this.state
      const { account } = this.props

      return (
         <CustomResponsive
            getWidth={getWidth}
            minWidth={Responsive.onlyComputer.minWidth}
         >
            <Visibility
               once={false}
               onBottomPassed={this.showFixedMenu}
               onBottomPassedReverse={this.hideFixedMenu}
            >
               <Segment className='spacer' basic />
               <Menu
                  className='navbar'
                  // fixed={fixed ? 'top' : null}
                  fixed='top'
                  pointing={!fixed}
                  borderless
                  size='large'
               >
                  <Menu.Item as={Link} to='/'>
                     <Image className='mainlogo' src={LogoImage} />
                  </Menu.Item>
                  <Menu.Item as={Link} to='/'>
                     <Image className='navbar-icon' src={RecentImage} />
                     SUMMARY
                  </Menu.Item>
                  {false ? (
                     <Menu.Item as={Link} to='/activity'>
                        <Image className='navbar-icon' src={ActivityImage} />
                        ACTIVITY
                     </Menu.Item>
                  ) : null}
                  <Menu.Item as={Link} to='/send-money'>
                     <Image className='navbar-icon' src={SendImage} />
                     SEND MONEY
                  </Menu.Item>
                  {account.accountId && (
                     <Menu.Menu position='right' className='popup-container'>
                        <Menu.Item
                           as='a'
                           href='http://near.chat/'
                           target='_blank'
                           className='help'
                        >
                           <Image className='navbar-icon' src={HelpImage} />
                        </Menu.Item>
                        <DesktopPopup
                           account={account}
                           handleSelectAccount={this.handleSelectAccount}
                           redirectCreateAccount={this.redirectCreateAccount}
                           handleToggle={this.handleToggle}
                           popupOpen={popupOpen}
                        />
                     </Menu.Menu>
                  )}
               </Menu>
            </Visibility>

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
)(withRouter(DesktopView))
