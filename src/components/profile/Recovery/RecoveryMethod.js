import React, { Component } from 'react';
import Enabled from './Enabled';
import NotEnabled from './NotEnabled';
import { Translate } from 'react-localize-redux';

class RecoveryMethod extends Component {

    state = {
        disable: false
    };

    handleToggleDisable = () => {
        this.setState(prevState => ({
            disable: !prevState.disable
        }));
    }

    render() {

        let methodTitle = <Translate id={`recoveryMgmt.methodTitle.${this.props.data.method}`}/>;

        if (this.props.data.enabled) {
            return <Enabled
                        {...this.props}
                        onToggleDisable={this.handleToggleDisable}
                        onResend={this.props.onResend}
                        disable={this.state.disable}
                        title={methodTitle}
                    />;
        } else {
            return <NotEnabled 
                        {...this.props}
                        onEnable={this.props.onEnable}
                        title={methodTitle}
                    />;
        }
    }
}

export default RecoveryMethod;