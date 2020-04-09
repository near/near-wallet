import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { Translate } from 'react-localize-redux'
import { Grid } from 'semantic-ui-react'

import MobileContainer from '../sign/MobileContainer'
import FormButton from '../common/FormButton'
import SelectAccountDropdown from './SelectAccountDropdown'

import IconProblems from '../../images/IconProblems'
import IconAuthorize from '../../images/IconAuthorize'

const LoginForm = ({
    dropdown,
    account,
    availableAccounts,
    appTitle,
    contractId,
    handleOnClick,
    handleDeny,
    handleAllow,
    handleSelectAccount,
    redirectCreateAccount,
    buttonLoader,
    match
}) => (
    <MobileContainer>
        <Grid padded>
            <Grid.Row centered>
                <Grid.Column
                    textAlign='center'
                    className='authorize'
                >
                    {contractId && (
                        <IconAuthorize color='#999' />
                    )}
                    {!contractId && (
                        <IconProblems color='#fca347' />
                    )}
                </Grid.Column>
            </Grid.Row>
            <Grid.Row className='title'>
                <Grid.Column
                    as='h1'
                    className='font-benton'
                    textAlign='center'
                    computer={16}
                    tablet={16}
                    mobile={16}
                >
                    {contractId && (
                        <Fragment>
                            <div><b>{appTitle}</b></div>
                            <div className='h2'><Translate id='login.form.isRequestingTo' /> </div>
                            <div className='h2'><Translate id='login.form.accessYourAccount' /></div>
                        </Fragment>
                    )}
                    {!contractId && (
                        <Fragment>
                            <div><b>{appTitle}</b></div>
                            <div className='h2 font-benton'><Translate id='login.form.isRequestingFullAccess' /></div>
                            <div className='h2 font-benton'><Translate id='login.form.toYourAccount' /></div>
                        </Fragment>
                    )}
                </Grid.Column>
            </Grid.Row>
            <Grid.Row>
                <Grid.Column
                    textAlign='center'
                    computer={16}
                    tablet={16}
                    mobile={16}
                    className='color-black'
                >
                    {contractId && (
                        <div><Translate id='login.form.thisDoesNotAllow' /></div>
                    )}
                    {!contractId && (
                        <div><Translate id='login.form.thisProvidesAccess' /></div>
                    )}
                </Grid.Column>
            </Grid.Row>
            <Grid.Row centered>
                <Grid.Column
                    largeScreen={12}
                    computer={14}
                    tablet={16}
                    className='cont'
                    textAlign='center'
                >
                    <FormButton
                        linkTo={`${match.url}${match.url.substr(-1) === '/' ? '' : '/'}details`}
                        className='more-information'
                    >
                        <Translate id='button.moreInformation' />
                    </FormButton>
                </Grid.Column>
            </Grid.Row>
        </Grid>
        <Grid padded>
            <Grid.Row centered>
                <Grid.Column largeScreen={6} computer={8} tablet={10} mobile={16}>
                    <SelectAccountDropdown
                        handleOnClick={handleOnClick}
                        account={account}
                        availableAccounts={availableAccounts}
                        dropdown={dropdown}
                        handleSelectAccount={handleSelectAccount}
                        redirectCreateAccount={redirectCreateAccount}
                    />
                </Grid.Column>
            </Grid.Row>
            <Grid.Row centered className='but-sec'>
                <Grid.Column largeScreen={6} computer={8} tablet={10} mobile={16}>
                    <FormButton
                        color='gray-white'
                        onClick={handleDeny}
                    >
                        <Translate id='button.deny' />
                    </FormButton>

                    {contractId && (
                        <FormButton
                            color='blue'
                            sending={buttonLoader}
                            onClick={handleAllow}
                        >
                            <Translate id='button.allow' />
                        </FormButton>
                    )}
                    {!contractId && (
                        <FormButton
                            linkTo={`${match.url}${match.url.substr(-1) === '/' ? '' : '/'}confirm`}
                            color='blue'
                            sending={buttonLoader}
                        >
                            <Translate id='button.allow' />
                        </FormButton>
                    )}
                </Grid.Column>
            </Grid.Row>
        </Grid>
    </MobileContainer>
)

LoginForm.propTypes = {
    dropdown: PropTypes.bool.isRequired,
    handleOnClick: PropTypes.func.isRequired,
    handleDeny: PropTypes.func.isRequired,
    handleSelectAccount: PropTypes.func.isRequired,
    redirectCreateAccount: PropTypes.func.isRequired
}

const mapStateToProps = ({ account, availableAccounts }) => ({
    account,
    availableAccounts
})

export default connect(mapStateToProps)(withRouter(LoginForm))
