import React from 'react'
import styled from 'styled-components'
import Accordion from '../common/Accordion'
import classNames from '../../utils/classNames'
import PropTypes from 'prop-types'
import ChevronIcon from '../svg/ChevronIcon'

const Container = styled.div`
    position: relative;

    &.disabled {
        pointer-events: none;

        .chevron-icon {
            display: none;
        }
    }

    .dropdown-title-wrapper {
        display: flex;
        align-items: center;
        border: 2px solid #F2F2F2;
        border-radius: 8px;
        padding: 12px 25px 12px 15px;
        cursor: pointer;
        transition: 100ms;

        > svg {
            margin-left: auto;
            transform: rotate(90deg);
            transition: 200ms;
            path {
                stroke: #D5D4D8;
            }
        }

        .icon-wrapper {
            margin-right: 10px;
            margin-top: 3px;
        }

        .dropdown-title {
            font-size: 16px;
            font-weight: 500;
        }

        :hover, &.open {
            > svg {
                path {
                    stroke: #0072ce;
                }
            }

            border-color: #E6E6E6;
        }

        &.open {
            border-bottom-left-radius: 0;
            border-bottom-right-radius: 0;

            > svg {
                transform: rotate(-90deg);
            }
        }
    }

    .dropdown-content {
        position: absolute;
        background-color: white;
        width: 100%;
        border-radius: 8px;

        &.open {
            border: 2px solid #F0F0F0;
            border-top: 0;
            border-top-left-radius: 0;
            border-top-right-radius: 0;
            box-shadow: 0px 3px 9px -1px rgb(206 206 206 / 17%);
        }
    }
    
    &.max-height {
        .dropdown-content {
            &.open {
                max-height: 200px;
                overflow-y: scroll !important;
            }
        }
    }

`

export default function DropDown({ name, title, icon, content, disabled, maxHeight = true }) {
    return (
        <Container className={classNames(['dropdown-container', disabled ? 'disabled' : '', maxHeight ? 'max-height' : ''])}>
            <div id={name} className='dropdown-title-wrapper'>
                {icon ? (
                    <div className='icon-wrapper'>
                        {icon}
                    </div>
                ) : null}
                <div className='dropdown-title'>
                    {title}
                </div>
                <ChevronIcon color='#0072ce'/>
            </div>
            <Accordion
                trigger={name}
                className='dropdown-content'
                transition='0'
                disabled={disabled}
            >
                {content}
            </Accordion>
        </Container>
    )
}

DropDown.propTypes = {
    name: PropTypes.string.isRequired,
    icon: PropTypes.object,
    title: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.object
    ]),
    content: PropTypes.oneOfType([
        PropTypes.array,
        PropTypes.object
    ])
}