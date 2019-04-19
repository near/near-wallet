import React, { Component } from 'react'
import { connect } from 'react-redux'

import { withRouter } from 'react-router-dom'

import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import { Wallet } from '../../utils/wallet'

import {
   Image,
   Menu,
   Responsive,
   Segment,
   Visibility,
   List,
   Button,
   Loader
} from 'semantic-ui-react'

import LogoImage from '../../images/wallet.png'
import HelpImage from '../../images/icon-help.svg'
import AccountGreyImage from '../../images/icon-account-grey.svg'
import ArrowDownImage from '../../images/icon-arrow-down.svg'

import { handleRefreshAccount } from '../../actions/account'

import styled from 'styled-components'

const CustomResponsive = styled(Responsive)`
   padding-bottom: 200px;

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
         font-weight: 400;
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
      .item:hover {
         color: #999999;
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
         padding-right: 20px;

         img {
            width: 12px;
         }
      }

      .dropdown-tr {
         .devider {
            width: 2px;
            height: 40px;
            background: #5d5f60;
            padding: 0px;
            margin: 16px 28px 0 0;
         }

         .account-dropdown {
            position: absolute;
            top: 44px;
            right: 20px;
            display: none;

            width: 290px;
            min-height: 100px;
            border-radius: 5px;
            box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.2);
            background-color: #f8f8f8;

            padding: 20px;

            &-scroll {
               max-height: 318px;
               overflow-y: auto;
               width: 270px;

               > .item {
                  width: 250px;
                  margin: 0px;
                  padding: 0px;

                  :hover {
                     text-decoration: underline;
                  }
                  ::before {
                     display: none;
                  }
                  ::after {
                     display: none;
                  }
               }
            }

            h6 {
               padding-bottom: 6px;
            }
            .account-title {
               height: 40px;
               line-height: 40px;
               color: #4a4f54;
               font-weight: 500;
               border-bottom: 2px solid #e6e6e6;
               letter-spacing: normal;

               text-overflow: ellipsis;
               overflow: hidden;
            }
            button {
               width: 100%;
               border-radius: 30px;
               background: #fff;
               color: #6ad1e3;

               :hover {
                  background: #6ad1e3;
                  color: #fff;
               }
            }
         }

         :hover {
            .account-dropdown {
               display: block;
            }
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
      activeItem: 'home'
   }

   hideFixedMenu = () => this.setState({ fixed: false })

   showFixedMenu = () => this.setState({ fixed: true })

   handleItemClick = (e, { name }) => this.setState({ activeItem: name })

   handleSelectAccount = account_id => {
      this.wallet = new Wallet()
      this.wallet.select_account(account_id)
      this.props.handleRefreshAccount(this.wallet, this.props.history)
   }

   redirectCreateAccount = () => {
      this.wallet = new Wallet()
      this.wallet.redirect_to_create_account({}, this.props.history)
   }

   render() {
      const { fixed } = this.state
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
                  <Menu.Menu position='right'>
                     <Menu.Item as='a' href='http://near.chat/' target='_blank'>
                        <Image className='navbar-icon' src={HelpImage} />
                        HELP
                     </Menu.Item>
                     <Menu.Menu position='right' className='dropdown-tr'>
                        <Menu.Item className='devider' />
                        <Menu.Item className='account-img'>
                           <Image src={AccountGreyImage} />
                        </Menu.Item>
                        <Menu.Item className='account-name'>
                           {account.loader || !account.account_id ? (
                              <Loader active inline size='mini' />
                           ) : (
                              `@${account.account_id}`
                           )}
                        </Menu.Item>
                        <Menu.Item className='account-tokens'>
                           {account.loader || !account.account_id ? (
                              <Loader active inline size='mini' />
                           ) : (
                              account.amount
                           )}
                           <span className='near'>Ⓝ</span>
                        </Menu.Item>
                        <Menu.Item className='account-arrow'>
                           <Image src={ArrowDownImage} />
                        </Menu.Item>

                        <Segment basic className='account-dropdown'>
                           <List>
                              <List.Item as='h6'>SWITCH ACCOUNT</List.Item>
                           </List>
                           <List className='account-dropdown-scroll'>
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
                     </Menu.Menu>
                  </Menu.Menu>
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
