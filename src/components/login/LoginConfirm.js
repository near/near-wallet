import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Translate } from 'react-localize-redux';
import { connect } from 'react-redux';
import { Grid } from 'semantic-ui-react';


import IconHelp from '../../images/IconHelp';
import FormButton from '../common/FormButton';
import MobileContainer from '../sign/MobileContainer';

class LoginForm extends Component {
    state = {
        accountId: '',
        confirmStatus: ''
    }

    handleChange = (value) => {
        this.setState(() => ({
            accountId: value,
            confirmStatus: ''
        }));
    }

    handleConfirmSubmit = () => {
        if (this.state.accountId === this.props.account.accountId) {
            this.setState(() => ({
                confirmStatus: 'success'
            }));
            this.props.handleAllow();
        }
        else {
            this.setState(() => ({
                confirmStatus: 'problem'
            }));
        }
    }

    render() {
        const { appTitle, buttonLoader } = this.props;
        const { accountId, confirmStatus } = this.state;

        return (
            <MobileContainer>
                <Grid padded>
                    <Grid.Row centered>
                        <Grid.Column
                            textAlign='center'
                            className='authorize'
                        >
                            <IconHelp color='#ff595a' />
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row className='title'>
                        <Grid.Column
                            as='h1'
                            textAlign='center'
                            computer={16}
                            tablet={16}
                            mobile={16}
                        >
                            <div><b><Translate id='login.confirm.pageTitle' /></b></div>
                            <div className='h2'>
                                <Translate>
                                    {({ translate }) => (
                                        <Translate id='login.confirm.pageText' data={{ appTitle: appTitle || translate('sign.unknownApp') }} />
                                    )}
                                </Translate>
                            </div>
                            <div className='h2'><br /><Translate id='login.confirm.pageTextSecondLine' /></div>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
                <form onSubmit={e => {this.handleConfirmSubmit(); e.preventDefault();}}>
                    <Grid padded>
                        <Grid.Row centered>
                            <Grid.Column largeScreen={6} computer={8} tablet={10} mobile={16}>
                                <Translate>
                                    {({ translate }) => (
                                        <input
                                            name='accountId'
                                            value={accountId}
                                            onChange={e => this.handleChange(e.target.value)}
                                            className={`${confirmStatus ? (confirmStatus === 'success' ? 'success' : 'problem') : ''}`}
                                            placeholder={translate('login.confirm.username')}
                                            maxLength='64'
                                            required
                                            autoComplete='off'
                                            autoCorrect='off'
                                            autoCapitalize='off'
                                            spellCheck='false'
                                            tabIndex='1'
                                        />
                                    )}
                                </Translate>
                                <div className='alert-info'>
                                    {confirmStatus === 'problem' && <Translate id='account.nameDoesntMatch' />}
                                </div>
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row centered className='but-sec'>
                            <Grid.Column largeScreen={6} computer={8} tablet={10} mobile={16}>
                                <FormButton
                                    color='gray-white'
                                    type='button'
                                    onClick={() => this.props.history.goBack()}
                                    trackingId="LOGIN Click cancel button"
                                >
                                    <Translate id='button.cancel' />
                                </FormButton>
                                <FormButton
                                    color='blue'
                                    disabled={confirmStatus !== 'problem' && accountId ? false : true}
                                    sending={buttonLoader}
                                    type='submit'
                                >
                                    <Translate id='button.confirm' />
                                </FormButton>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </form>
            </MobileContainer>
);}}

LoginForm.propTypes = {
    buttonLoader: PropTypes.bool.isRequired,
    appTitle: PropTypes.string,
    handleAllow: PropTypes.func.isRequired
};

const mapStateToProps = ({ account }) => ({
    account
});

export default connect(mapStateToProps)(LoginForm);
