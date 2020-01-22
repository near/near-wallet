import React, { Component, Fragment } from 'react';
import { withRouter } from 'react-router-dom';
import { handleRefreshAccount, switchAccount } from '../../actions/account';
import { Responsive } from 'semantic-ui-react';
import { connect } from 'react-redux';
import MobileView from './MobileView';
import DesktopView from './DesktopView';

class ResponsiveContainer extends Component {

    getWidth = () => {
        const isSSR = typeof window === 'undefined';
        return isSSR ? Responsive.onlyTablet.minWidth : window.innerWidth;
    }

    showNavLinks = () => {
        const { account, location } = this.props;
        const accounts = account.accounts;
        const signUpRoutes = ['create', 'set-recovery', 'setup-seed-phrase'];
        const currentBaseRoute = location.pathname.replace(/^\/([^\/]*).*$/, '$1');

        return !signUpRoutes.includes(currentBaseRoute) || !!accounts && (currentBaseRoute === 'create' || Object.keys(accounts).length > 1);
    }

    render() {

        return (
            <>
                <DesktopView
                    {...this.props}
                    showNavbarLinks={this.showNavLinks()}
                    getWidth={this.getWidth}
                />
                <MobileView
                    {...this.props}
                    showNavbarLinks={this.showNavLinks()}
                    getWidth={this.getWidth}
                />
                <div className='main'>
                    {this.props.children}
                </div>
            </>
        );
    }
}

const mapStateToProps = ({ account }) => ({
    account
})

const mapDispatchToProps = {
    handleRefreshAccount,
    switchAccount
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withRouter(ResponsiveContainer))
