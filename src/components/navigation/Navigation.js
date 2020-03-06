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

    get showNavLinks() {
        const { availableAccounts } = this.props;
        const signUpRoutes = ['create', 'set-recovery', 'setup-seed-phrase'];
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
    }

    render() {

        const { menuOpen } = this.state;

        return (
            <>
                <DesktopContainer
                    menuOpen={menuOpen}
                    toggleMenu={this.toggleMenu}
                    closeMenu={this.state.menuOpen ? () => this.setState({ menuOpen: false }) : null }
                    selectAccount={this.handleSelectAccount}
                    showNavLinks={this.showNavLinks}
                    {...this.props}
                />
                <MobileContainer
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
