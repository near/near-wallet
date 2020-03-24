import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Translate } from 'react-localize-redux'

import { Form, Segment } from 'semantic-ui-react'

import styled from 'styled-components'

const CustomFormInput = styled(Form.Input)``

const CustomSegment = styled(Segment)`
    &&& {
        margin: 0px;
        padding: 12px 0 0 0;
    }
`

class StakingFormAmount extends Component {
    state = {
        amountStaking: '',
        amountPercent: 0
    }

    handleChangeAccountId = (e, { name, value }) => {
        if (value.match(/[^0-9.]/)) {
            return false
        }

        this.setState(() => ({
            [name]: value,
            amountPercent: Math.round((value / this.props.amount) * 100) / 100
        }))

        this.props.handleChange(e, { name, value })
    }

    render () {
        const { amount } = this.props
        const { amountStaking, amountPercent } = this.state

        return (
            <Fragment>
                <Translate>
                    {({ translate }) => (
                        <CustomFormInput
                            className={`create ${
                                amountStaking ? (amountPercent <= 100 ? 'success' : 'problem') : ''
                            }`}
                            name='amountStaking'
                            onChange={this.handleChangeAccountId}
                            placeholder={translate('staking.amountStakingInput.placeholder')}
                            required
                            value={amountStaking}
                            autoComplete='off'
                            autoCorrect='off'
                            spellCheck='false'
                            tabIndex='1'
                        />
                    )}
                </Translate>
                <CustomSegment basic textAlign='right' className={`color-black ${amountPercent <= 100 ? `` : `color-red`}`}>
                    <b>{amountPercent}% <Translate id='ofTotal' />: {amount}</b>
                </CustomSegment>
            </Fragment>
        )
    }
}

StakingFormAmount.propTypes = {
    handleChange: PropTypes.func.isRequired
}

const mapStateToProps = ({ account }) => ({
    ...account,
})

export default connect(
    mapStateToProps
)(StakingFormAmount)
