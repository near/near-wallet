import React, { Component } from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

const Container = styled.div`

    .radio-wrapper {
        margin-bottom: 10px;

        :last-of-type {
            margin-bottom: 0;
        }
    }

`

export default class RadioGroup extends Component {
    getChildContext() {
        const { name, selectedValue, onChange } = this.props
        return {
            radioGroup: {
                name,
                selectedValue,
                onChange
            }
        };
    }

    render() {
        const { name, selectedValue, children, ...rest } = this.props
        return (
            <Container role='radiogroup' {...rest}>
                {children}
            </Container>
        );
    }
}

RadioGroup.childContextTypes = {
    radioGroup: PropTypes.object
};

RadioGroup.defaultProps = {
    name: '',
    selectedValue: ''
};