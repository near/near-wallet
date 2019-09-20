import React, { Component } from 'react'
import { connect } from 'react-redux'

import { withRouter } from 'react-router-dom'

import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import DesktopPopup from './DesktopPopup'
import GlobalAlert from './GlobalAlert'
import NodeAnimatedDot from '../node-staking/NodeAnimatedDot'

import { Image, Responsive, Segment, Visibility } from 'semantic-ui-react'

import LogoImage from '../../images/wallet.png'
import HelpImage from '../../images/icon-help.svg'
import ActivityImage from '../../images/icon-activity.svg'
import RecentImage from '../../images/icon-recent.svg'
import SendImage from '../../images/icon-send.svg'

import { handleRefreshAccount, switchAccount } from '../../actions/account'

import styled from 'styled-components'

const CustomResponsive = styled(Responsive)`
   .spacer {
      height: 72px;
   }
   &&& .navbar {
      width: 100%;
      background-color: #24272a;
      height: 72px;
      border-radius: 0;
      position: fixed;
      top: 0px;
      z-index: 100;

      .left {
         float: left;
      }
      .right {
         float: right;
      }
      .overflow {
         overflow: hidden;
      }
      .devider {
         float: left;
         width: 2px;
         height: 40px;
         background: #5d5f60;
         padding: 0px;
         margin: 16px 28px 0 0;
      }
      .help {
         float: left;
         margin-top: 22px;
         margin-right: 28px;
      }
      &-icon {
         height: 24px;
         display: inline-block;
      }
      .mainlogo {
         float: left;
         padding-right: 6px;
         img {
            height: 72px;
         }
      }
      .node-staking {
         > a > div {
            position: relative;
         }
         .node-dot {
            position: absolute;
            top: 29px;
            left: 29px;
         }
      }
      .item {
         float: left;
         color: white;
         font-family: 'benton-sans', sans-serif;
         font-weight: 500;
         font-size: 14px;
         padding-left: 0px;
         padding-right: 30px;
         letter-spacing: 2px;
         line-height: 72px;
         img {
            margin-right: 10px;
         }
         a {
            color: #fff;
         }
         a:hover {
            color: #6ad1e3;
            text-decoration: none;
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
      activeItem: 'home',
      popupOpen: false
   }

   hideFixedMenu = () => this.setState({ fixed: false })

   showFixedMenu = () => this.setState({ fixed: true })

   handleItemClick = (e, { name }) => this.setState({ activeItem: name })

   handleSelectAccount = accountId => {
      this.props.switchAccount(accountId)
      this.props.handleRefreshAccount(this.props.history)
      this.props.history.push(`/`)
   }

   redirectCreateAccount = () => {
      this.setState(() => ({
         popupOpen: false
      }))
      this.props.history.push('/create')
   }

   handleToggle = () => {
      this.setState(state => ({
         popupOpen: !state.popupOpen
      }))
   }

   handleClose = () => {
      this.setState(state => ({
         popupOpen: false
      }))
   }

   handleOpen = () => {
      this.setState(state => ({
         popupOpen: true
      }))
   }


   render() {
      const { popupOpen } = this.state
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
               <GlobalAlert />
               <div className='navbar'>
                  <div className='left'>
                     <div>
                        <div className={`mainlogo ${this.props.location.pathname === `/node-staking` ? `node-staking` : ``}`}>
                           <Link to='/'>
                              <div>
                                 <Image src={LogoImage} />
                                 {this.props.location.pathname === `/node-staking` && <NodeAnimatedDot color='red' />}
                              </div>
                           </Link>
                        </div>
                        <div className='item'>
                           <Link to='/'>
                              <Image
                                 className='navbar-icon'
                                 src={RecentImage}
                              />
                              SUMMARY
                           </Link>
                        </div>
                        {false ? (
                           <div className='item'>
                              <Link to='/'>
                                 <Image
                                    className='navbar-icon'
                                    src={ActivityImage}
                                 />
                                 ACTIVITY
                              </Link>
                           </div>
                        ) : null}
                        <div className='item'>
                           <Link to='/send-money'>
                              <Image className='navbar-icon' src={SendImage} />
                              SEND MONEY
                           </Link>
                        </div>
                     </div>
                  </div>
                  <div className='overflow'>
                     {account.accountId && (
                        <div className='right'>
                           <div className='help'>
                              <a href='http://near.chat/'>
                                 <Image
                                    className='navbar-icon'
                                    src={HelpImage}
                                 />
                              </a>
                           </div>
                           <div className='devider' />
                           <div className='overflow'>
                              <DesktopPopup
                                 account={account}
                                 handleSelectAccount={this.handleSelectAccount}
                                 redirectCreateAccount={
                                    this.redirectCreateAccount
                                 }
                                 handleToggle={this.handleToggle}
                                 handleClose={this.handleClose}
                                 handleOpen={this.handleOpen}
                                 popupOpen={popupOpen}
                              />
                           </div>
                        </div>
                     )}
                  </div>
               </div>
            </Visibility>
         </CustomResponsive>
      )
   }
}

const mapDispatchToProps = {
   handleRefreshAccount,
   switchAccount
}

const mapStateToProps = ({ account }) => ({
   account
})

export default connect(
   mapStateToProps,
   mapDispatchToProps
)(withRouter(DesktopView))
