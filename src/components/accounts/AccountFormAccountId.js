import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Form, Responsive } from 'semantic-ui-react';
import styled from 'styled-components';
import RequestStatusBox from '../common/RequestStatusBox';
import { checkAccountAvailable, checkNewAccount } from '../../actions/account';

const CustomFormInput = styled(Form.Input)`
   
`;

class AccountFormAccountId extends Component {
    
    state = {
        accountId: this.props.defaultAccountId || ''
    }

    handleChangeAccountId = (e, { name, value }) => {
        if (value.match(/[^a-zA-Z0-9_-]/)) {
            return false
        }

        this.setState(() => ({
            [name]: value.trim().toLowerCase()
        }))

        this.props.handleChange(e, { name, value })

        this.timeout && clearTimeout(this.timeout)

        this.timeout = setTimeout(() => {
            this.props.type === 'create'
                ? this.props.checkNewAccount(value)
                : this.props.checkAccountAvailable(value)
        }, 500)
    }

    render() {
        const {
            formLoader,
            requestStatus,
            autoFocus
        } = this.props;

        const { accountId } = this.state;

        return (
            <>
                <CustomFormInput
                    loading={formLoader}
                    className={`create username-input-icon ${requestStatus ? (requestStatus.success ? 'success' : 'problem') : ''}`}
                    name='accountId'
                    value={accountId}
                    onChange={this.handleChangeAccountId}
                    placeholder='satoshi.test'
                    maxLength='32'
                    required
                    autoComplete='off'
                    autoCorrect='off'
                    autoCapitalize='off'
                    spellCheck='false'
                    tabIndex='1'
                    autoFocus={autoFocus && accountId.length === 0}
                />
                <Responsive as={RequestStatusBox} maxWidth={767} requestStatus={requestStatus} />
            </>
        )
    }
}

AccountFormAccountId.propTypes = {
    formLoader: PropTypes.bool.isRequired,
    handleChange: PropTypes.func.isRequired,
    type: PropTypes.string,
    defaultAccountId: PropTypes.string,
    autoFocus: PropTypes.bool
}

AccountFormAccountId.defaultProps = {
    autoFocus: false
}

const mapDispatchToProps = {
    checkAccountAvailable,
    checkNewAccount
}

const mapStateToProps = ({ account }, { match }) => ({
    ...account,
})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AccountFormAccountId)
