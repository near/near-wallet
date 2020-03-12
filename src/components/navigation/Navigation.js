import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { refreshAccount, switchAccount } from '../../actions/account';
import { connect } from 'react-redux';
import DesktopContainer from './DesktopContainer';
import MobileContainer from './MobileContainer';

class Navigation extends Component {

    state = {
        menuOpen: false
    }

    componentDidUpdate(prevState) {

        const { menuOpen } = this.state;

        if (menuOpen !== prevState.menuOpen) {
            if (menuOpen) {
                document.addEventListener('keydown', this.handleMenu);
                document.addEventListener('click', this.handleMenu);
            } else {
                document.removeEventListener('keydown', this.handleMenu);
                document.removeEventListener('click', this.handleMenu);
            }
        }
    }

    handleMenu = (e) => {
        const desktopMenu = document.getElementById('desktop-menu');
        const mobileMenu = document.getElementById('mobile-menu');
        if (e.key === 'Escape' || e.target.tagName === 'BUTTON' || e.target.tagName === 'A' || (!desktopMenu.contains(e.target) && !mobileMenu.contains(e.target))) {
            this.setState({ menuOpen: false });
        }
    }

    get showNavLinks() {
        const { availableAccounts } = this.props;
        const signUpRoutes = ['create', 'set-recovery', 'setup-seed-phrase', 'recover-account', 'recover-seed-phrase'];
        const currentBaseRoute = window.location.pathname.replace(/^\/([^/]*).*$/, '$1');
        
        return !signUpRoutes.includes(currentBaseRoute) || availableAccounts.length > 1 || (availableAccounts.length > 0 && currentBaseRoute === 'create');
    }

    toggleMenu = () => {
        this.setState(prevState => ({
            menuOpen: !prevState.menuOpen
        }));
    }

    handleSelectAccount = accountId => {
        this.props.switchAccount(accountId)
        this.props.refreshAccount()
        this.setState({ menuOpen: false });
    }

    render() {

        const { menuOpen } = this.state;

        return (
            <>
                <DesktopContainer
                    menuOpen={menuOpen}
                    toggleMenu={this.toggleMenu}
                    selectAccount={this.handleSelectAccount}
                    showNavLinks={this.showNavLinks}
                    {...this.props}
                />
                <MobileContainer
                    menuOpen={menuOpen}
                    toggleMenu={this.toggleMenu}
                    selectAccount={this.handleSelectAccount}
                    showNavLinks={this.showNavLinks}
                    {...this.props}
                />
            </>
        )
    }
}

const mapStateToProps = ({ account, availableAccounts }) => ({
    account,
    availableAccounts
})

const mapDispatchToProps = {
    refreshAccount,
    switchAccount
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withRouter(Navigation))
