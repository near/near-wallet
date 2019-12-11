import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Image, Responsive, Segment, Visibility } from 'semantic-ui-react';
import DesktopPopup from './DesktopPopup';
import GlobalAlert from './GlobalAlert';
import NodeAnimatedDot from '../node-staking/NodeAnimatedDot';

// Images
import LogoImage from '../../images/wallet.png';
import HelpImage from '../../images/icon-help.svg';
import RecentImage from '../../images/icon-recent.svg';
import SendImage from '../../images/icon-send.svg';
//import ActivityImage from '../../images/icon-activity.svg';

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
        .divider {
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
        .testnet-indicator {
            margin-top: 26px;
            color: #6ad1e3;
        }
    }
`

class DesktopView extends Component {
    static propTypes = {
        children: PropTypes.node
    }

    static defaultProps = {
        children: ''
    }

    state = {
        activeItem: 'home',
        popupOpen: false,
    }

    handleItemClick = (e, { name }) => this.setState({ activeItem: name })

    handleSelectAccount = accountId => {
        this.props.switchAccount(accountId)
        this.props.handleRefreshAccount(this.props.history)
        this.props.history.push(`/`)
    }

    redirectCreateAccount = () => {
        this.setState({ popupOpen: false });
        this.props.history.push('/create');
    }

    handleToggle = () => {
        this.setState(prevState => ({
            popupOpen: !prevState.popupOpen
        }));
    }

    render() {
        const { popupOpen } = this.state;
        const { account, showNavbarLinks, getWidth } = this.props;

        return (
            <CustomResponsive
                getWidth={getWidth}
                minWidth={Responsive.onlyComputer.minWidth}
            >
                <Visibility
                    once={false}
                    onBottomPassed={() => this.setState({ fixed: true })}
                    onBottomPassedReverse={() => this.setState({ fixed: false })}
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
                                {showNavbarLinks &&
                                    <>
                                        <div className='item'>
                                            <Link to='/'>
                                                <Image
                                                    className='navbar-icon'
                                                    src={RecentImage}
                                                />
                                                SUMMARY
                                            </Link>
                                        </div>
                                        {/*
                                            <div className='item'>
                                                <Link to='/'>
                                                    <Image
                                                        className='navbar-icon'
                                                        src={ActivityImage}
                                                    />
                                                    ACTIVITY
                                                </Link>
                                            </div>
                                        */}
                                        <div className='item'>
                                            <Link to='/send-money'>
                                                <Image className='navbar-icon' src={SendImage} />
                                                SEND TOKENS
                                            </Link>
                                        </div>
                                    </>
                                }
                            </div>
                        </div>
                        {showNavbarLinks &&
                            <div className='overflow'>
                                <div className='right'>
                                    <div className='item testnet-indicator'>
                                        <p>TESTNET</p>
                                    </div>
                                    <div className='help'>
                                        <a href='http://near.chat/'>
                                            <Image
                                                className='navbar-icon'
                                                src={HelpImage}
                                            />
                                        </a>
                                    </div>
                                    <div className='divider' />
                                    <div className='overflow'>
                                        <DesktopPopup
                                            account={account}
                                            handleSelectAccount={this.handleSelectAccount}
                                            redirectCreateAccount={this.redirectCreateAccount}
                                            handleToggle={this.handleToggle}
                                            handleClose={() => this.setState({ popupOpen: false })}
                                            handleOpen={() => this.setState({ popupOpen: true })}
                                            popupOpen={popupOpen}
                                        />
                                    </div>
                                </div>
                            </div>
                        }
                    </div>
                </Visibility>
            </CustomResponsive>
        )
    }
}

export default DesktopView;
