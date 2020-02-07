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

    get methodTitle() {
        switch (this.props.data.method) {
            case 'email':
                return 'Email Address'
            case 'phone':
                return 'Phone Number'
            case 'phrase':
                return 'Seed Phrase'
            default:
                return ''
        }
    }

    render() {

        if (this.props.data.enabled) {
            return <Enabled
                        {...this.props}
                        onToggleDisable={this.handleToggleDisable}
                        disable={this.state.disable}
                        title={this.methodTitle}
                    />;
        } else {
            return <NotEnabled 
                        {...this.props}
                        onEnable={this.props.onEnable}
                        title={this.methodTitle}
                    />;
        }
    }
}

export default RecoveryMethod;