import React, { Component } from 'react'
import { connect } from 'react-redux'

import { withRouter, Link } from 'react-router-dom'

import PropTypes from 'prop-types'

import { Wallet } from '../../utils/wallet'

import {
   Header,
   Image,
   Menu,
   Responsive,
   Segment,
   Sidebar,
   List,
   Button,
   Loader
} from 'semantic-ui-react'

import LogoImage from '../../images/wallet.png'
import HelpImage from '../../images/icon-help.svg'
import SidebarImage from '../../images/sidebar.png'

import { handleRefreshAccount } from '../../actions/account'

import styled from 'styled-components'

const CustomResponsive = styled(Responsive)`
   min-height: 100vh;
   position: static;

   .sidebar.menu {
      min-height: 100vh;
   }

   .sidebar.menu .item {
      background: #24272a;

      color: white;
      font-family: 'benton-sans', sans-serif;
      font-weight: 400;
      font-size: 14px;
      padding: 20px 20px;
      border-bottom: 1px solid #363b3e;
   }

   &&& .sidebar-mobile {
      background: #111314;
      border: 0px;
      box-shadow: 0 0 0 transparent;

      .account-dropdown {
         padding: 20px;

         h6 {
            padding-bottom: 6px;
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
            background: #6ad1e3;
            color: #fff;

            :hover {
               background: #fff;
               color: #6ad1e3;
            }
         }
      }
   }

   && .sidebar-mobile-header {
      height: 72px;
      padding: 0px 0 0 20px;
      margin: 0px;
      line-height: 72px;
      color: #fff;
      font-size: 14px;

      > .segment {
         margin: 0px;
         padding: 0px;
         font-family: 'benton-sans', sans-serif;
         font-weight: 400;

         text-overflow: ellipsis;
         overflow: hidden;
         width: 100px;
      }

      .account-tokens {
         line-height: 24px;
         font-size: 12px;

         color: #fff;

         margin: 23px 20px 0 10px;
         height: 24px;
         background: #24272a;
         border-radius: 12px;
         padding: 0 10px;

         :hover {
            color: #fff;
         }

         .near {
            font-size: 16px;
         }
      }
   }

   &&&& .sidebar-mobile-submenu {
      .header {
         font-size: 12px;
         color: #999;
         margin: 0;
      }

      a {
         color: #6ad1e3;
         padding-left: 20px;
         font-size: 14px;
      }

      & > .menu {
         a {
            border-bottom: 0px solid #363b3e;
            padding: 10px 20px;
         }
      }
   }

   .pusher {
      padding-bottom: 200px;
   }

   .pusher .pusher-image {
      padding-right: 0;
   }

   .navbar {
      background-color: #24272a;
      height: 72px;
      border-radius: 0;
      margin-bottom: 1rem;

      &-icon {
         height: 24px;
         margin-right: 14px;
         display: inline-block !important;
      }

      .item {
         color: white;
         font-family: 'benton-sans', sans-serif !important;
         font-weight: 400;
         font-size: 14px;
         padding-left: 0px;
         letter-spacing: 2px;

         .mainlogo {
            width: 220px !important;
         }
      }
   }

   .header.item {
      width: 215px;
      padding: 0;
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
      sidebarOpened: false
   }

   handleSidebarHide = () => this.setState({ sidebarOpened: false })

   handleToggle = () => this.setState({ sidebarOpened: true })

   handleSelectAccount = account_id => {
      this.wallet = new Wallet()
      this.wallet.select_account(account_id)
      this.props.handleRefreshAccount(this.wallet, this.props.history)
      this.handleSidebarHide()
   }

   redirectCreateAccount = () => {
      this.wallet = new Wallet()
      this.handleSidebarHide()
      this.wallet.redirect_to_create_account({}, this.props.history)
   }

   render() {
      const { sidebarOpened } = this.state
      const { account } = this.props

      return (
         <CustomResponsive
            getWidth={getWidth}
            maxWidth={Responsive.onlyTablet.maxWidth}
         >
            <Sidebar.Pushable>
               <Sidebar
                  as={Menu}
                  animation='push'
                  onHide={this.handleSidebarHide}
                  vertical
                  visible={sidebarOpened}
                  direction='right'
                  className='sidebar-mobile'
               >
                  <Header className='sidebar-mobile-header'>
                     <Segment basic floated='left'>
                        {account.loader || !account.account_id ? (
                           <Loader active inline size='mini' />
                        ) : (
                           `@${account.account_id}`
                        )}
                     </Segment>
                     <Segment basic floated='right' className='account-tokens'>
                        {account.loader || !account.account_id ? (
                           <Loader active inline size='mini' />
                        ) : (
                           account.amount
                        )}
                        <span className='near'>Ⓝ</span>
                     </Segment>
                  </Header>
                  <Menu.Item as='a' href='http://near.chat/' target='_blank'>
                     <Image className='navbar-icon' src={HelpImage} />
                     HELP
                  </Menu.Item>
                  {/* <Menu.Item
                     as='a'
                     href='https://github.com/nearprotocol/debugger/issues'
                     target='_blank'
                  >
                     <Image className="navbar-icon" src={IssuesImage} />
                     ISSUES
                  </Menu.Item>
                  <Menu.Item className='sidebar-mobile-submenu'>
                     <Header>
                        MANAGE ACCOUNT
                     </Header>
                     <Menu.Menu className='Sidebar-submenu'>
                        <Menu.Item as='a'>
                           <Image className="navbar-icon" src={AccountImage} />
                           Profile
                        </Menu.Item>
                        <Menu.Item as='a'>
                           <Image className="navbar-icon" src={ContactsImage} />
                           Contacts
                        </Menu.Item>
                     </Menu.Menu>
                  </Menu.Item> */}
                  <Segment basic className='account-dropdown'>
                     <List>
                        <List.Item as='h6'>SWITCH ACCOUNT</List.Item>

                        {account.accounts &&
                           Object.keys(account.accounts)
                              .filter(a => a !== account.account_id)
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
               </Sidebar>

               <Sidebar.Pusher dimmed={sidebarOpened}>
                  <Menu className='navbar' borderless size='large'>
                     <Menu.Item as={Link} to='/'>
                        <Image className='mainlogo' src={LogoImage} />
                     </Menu.Item>
                     <Menu.Menu position='right'>
                        <Menu.Item
                           className='pusher-image'
                           onClick={this.handleToggle}
                        >
                           <Image
                              className='navbar-icon'
                              src={SidebarImage}
                              align='right'
                           />
                        </Menu.Item>
                     </Menu.Menu>
                  </Menu>

                  {this.props.children}
               </Sidebar.Pusher>
            </Sidebar.Pushable>
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
