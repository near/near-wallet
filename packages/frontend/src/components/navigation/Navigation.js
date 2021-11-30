import { getRouter } from 'connected-react-router';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import styled from 'styled-components';

import { switchAccount, getAvailableAccountsBalance, getAccountBalance } from '../../redux/actions/account';
import { selectAccountSlice } from '../../redux/slices/account';
import { selectAvailableAccounts } from '../../redux/slices/availableAccounts';
import { selectFlowLimitationMainMenu, selectFlowLimitationSubMenu } from '../../redux/slices/flowLimitation';
import DesktopContainer from './DesktopContainer';
import MobileContainer from './MobileContainer';

const Container = styled.div`
    &&& {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        z-index: 1000;
        @media (max-width: 991px) {
            bottom: ${props => props.open ? '0' : 'unset'};
        }

        h6 {
            font-size: 13px;
            margin-bottom: 5px;
            color: #72727A;
            font-weight: normal;
        }

        .account-selector {
            padding: 0;
            box-shadow: none;
            border-radius: 0;
        }
    }
`;
class Navigation extends Component {

    state = {
        menuOpen: false
    }

    componentDidUpdate(prevState) {

        const { menuOpen } = this.state;

        if (menuOpen !== prevState.menuOpen) {
            if (menuOpen) {
                document.addEventListener('keydown', this.handleKeyDown);
                document.addEventListener('click', this.handleClick);
            } else {
                document.removeEventListener('keydown', this.handleKeyDown);
                document.removeEventListener('click', this.handleClick);
            }
        }
    }

    handleKeyDown = (e) => {
        if (e.keyCode === 27) {
            this.setState({ menuOpen: false });
        }
    }

    handleClick = (e) => {
        const desktopMenu = document.getElementById('desktop-menu');
        const mobileMenu = document.getElementById('mobile-menu');

        if (e.target.tagName === 'SPAN') {
            return false;
        }

        if (e.target.tagName === 'BUTTON' || e.target.tagName === 'A' || (!desktopMenu.contains(e.target) && !mobileMenu.contains(e.target))) {
            this.setState({ menuOpen: false });
        }
    }

    get showNavLinks() {
        return this.props.account.localStorage?.accountFound;
    }

    toggleMenu = () => {
        if (!this.state.menuOpen) {
            this.props.getAvailableAccountsBalance();
        }

        this.setState(prevState => ({
            menuOpen: !prevState.menuOpen
        }));
    }

    handleSelectAccount = accountId => {
        this.props.switchAccount({ accountId });
        this.setState({ menuOpen: false });
    }

    render() {
        const { menuOpen } = this.state;
        const { 
            flowLimitationMainMenu,
            flowLimitationSubMenu,
            isInactiveAccount
        } = this.props;

        return (
            <Container id='nav-container' open={menuOpen}>
                <DesktopContainer
                    menuOpen={menuOpen}
                    toggleMenu={this.toggleMenu}
                    handleSelectAccount={this.handleSelectAccount}
                    showNavLinks={this.showNavLinks}
                    flowLimitationMainMenu={flowLimitationMainMenu}
                    flowLimitationSubMenu={flowLimitationSubMenu}
                    refreshBalance={this.props.getAccountBalance}
                    isInactiveAccount={isInactiveAccount}
                    {...this.props}
                />
                <MobileContainer
                    menuOpen={menuOpen}
                    toggleMenu={this.toggleMenu}
                    handleSelectAccount={this.handleSelectAccount}
                    showNavLinks={this.showNavLinks}
                    flowLimitationMainMenu={flowLimitationMainMenu}
                    flowLimitationSubMenu={flowLimitationSubMenu}
                    refreshBalance={this.props.getAccountBalance}
                    isInactiveAccount={isInactiveAccount}
                    {...this.props}
                />
            </Container>
        );
    }
}

const mapStateToProps = (state) => ({
    account: selectAccountSlice(state),
    router: getRouter(state),
    availableAccounts: selectAvailableAccounts(state),
    flowLimitationMainMenu: selectFlowLimitationMainMenu(state),
    flowLimitationSubMenu: selectFlowLimitationSubMenu(state)
});

const mapDispatchToProps = {
    switchAccount,
    getAvailableAccountsBalance,
    getAccountBalance
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withRouter(Navigation));
