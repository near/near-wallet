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

    userInSignupFlow = () => {
        const signUpRoutes = ['create', 'set-recovery', 'setup-seed-phrase'];
        const currentBaseRoute = this.props.location.pathname.replace(/^\/([^\/]*).*$/, '$1');
        return signUpRoutes.includes(currentBaseRoute);
    }

    render() {
        const { account } = this.props;

        const showNavbarLinks = !this.userInSignupFlow() && account.accountId;

        return (
            <>
                <DesktopView
                    {...this.props}
                    showNavbarLinks={showNavbarLinks}
                    getWidth={this.getWidth}
                />
                <MobileView
                    {...this.props}
                    showNavbarLinks={showNavbarLinks}
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
