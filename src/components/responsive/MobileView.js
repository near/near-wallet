import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import NodeAnimatedDot from '../node-staking/NodeAnimatedDot';
import {
    Image,
    Menu,
    Responsive,
    Segment,
    List,
    Button
} from 'semantic-ui-react';
import PopupMenuTrigger from './PopupMenuTrigger';
import GlobalAlert from './GlobalAlert';

// Images
import SendImage from '../../images/icon-send.svg';
import AuthorizedGreyImage from '../../images/icon-authorized.svg';
import LogoImage from '../../images/wallet.png';
import AccountGreyImage from '../../images/icon-account.svg';
import RecentImage from '../../images/icon-recent.svg';
import KeysImage from '../../images/icon-keys.svg';
//import ContactsGreyImage from '../../images/icon-contacts.svg';
//import LogoutImage from '../../images/icon-logout.svg';
//import ActivityImage from '../../images/icon-activity.svg';

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

               > a > div {
                  width: 50px;
                  overflow: hidden;
                  > img.image {
                     width: 160px;
                     max-width: none;
                  }
               }
            }
            .node-staking {
               > a > div {
                  position: relative;
               }
               .node-dot {
                  position: absolute;
                  top: 24px;
                  left: 24px;
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

            .receive {
                transform: rotate(180deg);
            }

            .switch-account {
               background: #000;
               padding: 0 1rem;
               padding: 20px;
               .item {
                  padding: 0px;
               }
               h6.item {
                  padding-bottom: 5px;
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

                  &:last-of-type {
                      border-bottom: 0;
                  }
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
`;

const LogoLink = styled(Link)`
    display: block;
    pointer-events: ${props => props.pointerEvents};
`;

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

    handleDropdown = () => {
        this.setState(prevState => ({
            dropdown: !prevState.dropdown
        }));
    }

    handleSelectAccount = accountId => {
        this.props.switchAccount(accountId)
        this.props.handleRefreshAccount(this.props.history)
        this.handleDropdown()
        this.props.history.push(`/`)
    }

    redirectCreateAccount = () => {
        this.handleDropdown()
        this.props.history.push('/create')
    }

    render() {
        const { dropdown } = this.state
        const { account, availableAccounts, showNavbarLinks, getWidth } = this.props

        return (
            <CustomResponsive
                getWidth={getWidth}
                maxWidth={Responsive.onlyTablet.maxWidth}
            >
                <Segment basic className='navbar'>
                    <Menu className='navbar-main' borderless>
                        <div className={`mainlogo ${this.props.location.pathname === `/node-staking` ? `node-staking` : ``}`}>
                            <LogoLink to='/' pointerEvents={showNavbarLinks ? 'all' : 'none'}>
                                <div>
                                    <Image src={LogoImage} />
                                    {this.props.location.pathname === `/node-staking` && <NodeAnimatedDot color='red' />}
                                </div>
                            </LogoLink>
                        </div>
                        {showNavbarLinks &&
                            <div className='trigger'>
                                <PopupMenuTrigger
                                    account={account}
                                    handleClick={this.handleDropdown}
                                    type='mobile'
                                    dropdown={dropdown}
                                />
                            </div>
                        }
                    </Menu>
                    <Segment basic className={`navbar-sub ${dropdown ? `hide` : ``}`}>
                        <Menu.Menu>
                            <Link to='/' onClick={this.handleDropdown}>
                                <Menu.Item className='main'>
                                    <Image src={RecentImage} />
                                    SUMMARY
                                </Menu.Item>
                            </Link>
                            {/*
                                <Link to='/activity' onClick={this.handleDropdown}>
                                    <Menu.Item className='main'>
                                        <Image src={ActivityImage} />
                                        ACTIVITY
                                    </Menu.Item>
                                </Link>
                            */}
                            <Link to='/send-money' onClick={this.handleDropdown}>
                                <Menu.Item className='main border'>
                                    <Image src={SendImage} />
                                    SEND
                                </Menu.Item>
                            </Link>
                            <Link to='/receive-money' onClick={this.handleDropdown}>
                                <Menu.Item className='main border'>
                                    <Image src={SendImage} className='receive'/>
                                    RECEIVE
                                </Menu.Item>
                            </Link>
                            <Menu.Menu className='sub'>
                                <Link to={`/profile/${account.accountId}`} onClick={this.handleDropdown}>
                                    <Menu.Item>
                                        <Image src={AccountGreyImage} />
                                        Profile
                                    </Menu.Item>
                                </Link>
                                {/*
                                    <Link to='/contacts' onClick={this.handleDropdown}>
                                        <Menu.Item>
                                            <Image src={ContactsGreyImage} />
                                            Contacts
                                        </Menu.Item>
                                    </Link>
                                */}
                                <Link to='/authorized-apps' onClick={this.handleDropdown}>
                                    <Menu.Item>
                                        <Image src={AuthorizedGreyImage} />
                                        Authorized Apps
                                    </Menu.Item>
                                </Link>
                                <Link to='/full-access-keys' onClick={this.handleDropdown}>
                                    <Menu.Item>
                                        <Image src={KeysImage} />
                                        Full Access Keys
                                    </Menu.Item>
                                </Link>
                                {/*
                                    <Link to='/' onClick={this.handleDropdown}>
                                        <Menu.Item>
                                            <Image src={LogoutImage} />
                                            Logout
                                        </Menu.Item>
                                    </Link>
                                */}
                            </Menu.Menu>
                            <Segment basic className='switch-account'>
                                <List>
                                    <List.Item as='h6'>SWITCH ACCOUNT</List.Item>
                                    {availableAccounts
                                        .filter(a => a !== account.accountId)
                                        .map((account, i) => (
                                            <List.Item
                                                as='a'
                                                key={`mf-${i}`}
                                                onClick={() => this.handleSelectAccount(account)}
                                                className='account-title'
                                            >
                                                @{account}
                                            </List.Item>
                                        ))}
                                    {availableAccounts.length < 2 && 'You have no other accounts'}
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

export default MobileView;
