import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { Translate } from 'react-localize-redux'
import { Header } from 'semantic-ui-react'

import FormButton from '../common/FormButton'
import StakingFormAmount from './StakingFormAmount'

const StakingForm = ({
    loader,
    handleChange,
    isLegitForm
}) => (
    <Fragment>
        <Header as='h4'><Translate id='staking.amountStakingInput.title' /></Header>
        <StakingFormAmount
            handleChange={handleChange}
        />
        
        <FormButton
            type='submit'
            color='blue'
            disabled={!isLegitForm()}
            sending={loader}
        >
            <Translate id='button.stake' />
        </FormButton>
    </Fragment>
)

StakingForm.propTypes = {
    loader: PropTypes.bool.isRequired,
    handleChange: PropTypes.func.isRequired,
    isLegitForm: PropTypes.func.isRequired
}

export default StakingForm
