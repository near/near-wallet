import React, { Component } from 'react'
import styled from 'styled-components'
import PropTypes from "prop-types"
import classNames from '../../../utils/classNames'

const Root = styled.div`
  
    label {
        cursor: pointer;
        display: flex;
        align-items: center;
        padding: 15px;
        border: 2px solid #F2F2F2;
        border-radius: 8px;
        overflow: hidden;

        :hover {
            border-color: #E6E6E6;
        }
    }

    .input-wrapper {
        :before {
            content: "";
            border-radius: 100%;
            border: 2px solid #E4E4E4;
            background-color: #FAFAFA;
            width: 100%;
            height: 100%;
            position: absolute;
            top: 0;
            pointer-events: none;
            z-index: 0;
        }

        margin-right: 20px;
        width: 26px;
        height: 26px;
        position: relative;
    }

    &.checked {
        label {
            border-color: #0072CE;
        }

        .input-wrapper {
            :before {
                background-color: #289AF3;
                border-color: #0072ce;
            }
        }
    }

    .radio-content {
        width: 100%;
    }
`
const Fill = styled.div`
    background-color: transparent;
    border-radius: 50%;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) scale(0);
    transition: 0.2s;
    pointer-events: none;
    z-index: 1;
    width: 9px;
    height: 9px;
`

const Input = styled.input`
    width: 26px !important;
    height: 26px !important;
    opacity: 0;
    z-index: 2;
    position: absolute;
    margin: 0;
    cursor: pointer;
  
    :focus {
        outline: none;
    }
  
    :checked {
      & ~ ${Fill} {
        transform: translate(-50%, -50%) scale(1);
        background-color: white;
      }
    }
`

export default class RadioButton extends Component {
    render() {
        const { name, selectedValue } = this.context.radioGroup
        const { onChange, value, children } = this.props
        let checked = false

        if (selectedValue !== undefined) {
            checked = value === selectedValue
        }

        return (
            <Root className={classNames(['radio-wrapper', checked ? 'checked' : ''])}>
                <label className='radio-label'>
                    <div className='input-wrapper'>
                        <Input
                            type='radio'
                            name={name}
                            value={value}
                            checked={checked}
                            aria-checked={checked}
                            onChange={onChange}
                            className='radio-input'
                        />
                        <Fill className='radio-fill'/>
                    </div>
                    <div className='radio-content'>
                        {children}
                    </div>
                </label>
            </Root>
        );
    }
}

RadioButton.contextTypes = {
    radioGroup: PropTypes.object
}

RadioButton.defaultProps = {
    onChange: () => {},
    value: ''
}