import React, { Component } from 'react';
import Enabled from './Enabled';
import NotEnabled from './NotEnabled';

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

        if (this.props.methodData.enabled) {
            return <Enabled
                        {...this.props}
                        onToggleDisable={this.handleToggleDisable}
                        disable={this.state.disable}
                    />;
        } else {
            return <NotEnabled 
                        {...this.props}
                        onEnable={this.props.onEnable}
                    />;
        }
    }
}

export default RecoveryMethod;