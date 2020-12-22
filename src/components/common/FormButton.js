import React from 'react'
import PropTypes from 'prop-types'
import { Button } from 'semantic-ui-react'
import { Translate } from 'react-localize-redux'
import { withRouter } from 'react-router'
import classNames from '../../utils/classNames'

import ArrowGrnImage from '../../images/icon-arrow-grn.svg'
import ArrowWhiteImage from '../../images/icon-arrow-white.svg'

import styled from 'styled-components'

const CustomButton = styled(Button)`
    &&& {
        color: #fff;
        letter-spacing: 2px;

        margin: 24px 0 0 0;
        border: 2px solid;

        width: 288px;
        height: 48px;
        border-radius: 30px;
        
        font-size: 14px;

        svg {
            width: 16px;
            height: 16px;
            margin: 0 0 -4px 8px;
        }

        &.small {
            width: 110px;
            height: 36px;
            border-radius: 20px;
            letter-spacing: 0;
            padding: 0px 0px;
            
            font-size: 14px;
        }

        &.light-blue {
            background-color: #F0F9FF !important;
            border: 0;
            color: #0072ce;
            border-radius: 4px;

            &.small {
                padding: 6px 12px;
                height: auto;
                font-weight: 400 !important;
                letter-spacing: 0.5px;
                font-size: 13px;
            }
        }

        &.red {
            border-color: #ff585d;
            background: #ff585d;

            :disabled {
                background: #e6e6e6;
                border-color: #e6e6e6;
                opacity: 1 !important;
            }
            :active,
            :hover,
            :focus {
                border-color: #ff585d;
                background: #fff;
                color: #ff585d;
            }
            &.dots {
                color: #fff;
            }
        }
        &.blue {
            border-color: #0072ce;
            background: #0072ce;
            text-transform: uppercase;

            :active,
            :hover,
            :focus {
                border-color: #007fe6;
                background: #007fe6;
            }
            :disabled {
                background: #e6e6e6;
                border-color: #e6e6e6;
                opacity: 1 !important;
            }
        }
        &.seafoam-blue {
            border-color: #6ad1e3;
            background: #6ad1e3;

            :disabled {
                background: #e6e6e6;
                border-color: #e6e6e6;
                opacity: 1 !important;
            }
            :active,
            :hover,
            :focus {
              opacity: 0.8;
            }
        }
        &.seafoam-blue-white {
            border-color: #6ad1e3;
            background: #fff;
            color: #6ad1e3;

            :disabled {
                background: #fff;
                border-color: #e6e6e6;
                opacity: 1 !important;
            }
            :active,
            :hover,
            :focus {
              opacity: 0.8;
            }
        }
        &.green {
            border-color: #5ace84;
            background: #5ace84;

            :disabled {
                border-color: #e6e6e6;
                background: #e6e6e6;
                opacity: 1 !important;
            }
            :active,
            :hover,
            :focus {
                border-color: #61de8d;
                background: #61de8d;
            }
        }
        &.green-white-arrow {
            color: #5ace84;
            border-color: #5ace84;
            background-color: #fff;
            background-image: url(${ArrowGrnImage});
            background-repeat: no-repeat;
            background-position: 90% center;
            background-size: 14px 20px;
            font-weight: 500 !important;

            :disabled {
                color: e6e6e6;
                border-color: #e6e6e6;
                background: #fff;
                opacity: 1 !important;
            }
            :active,
            :hover,
            :focus {
                color: #fff;
                border-color: #61de8d;
                background-color: #61de8d;
                background-image: url(${ArrowWhiteImage});
            }
        }
        &.gray-white {
            color: #cccccc;
            border-color: #cccccc;
            background: #fff;
            text-transform: uppercase;

            :disabled {
                border-color: #e6e6e6;
                background: #e6e6e6;
                opacity: 1 !important;
            }
            :active,
            :hover,
            :focus {
                color: #fff;
                border-color: #cccccc;
                background: #cccccc;
            }
        }
        &.gray-red {
            color: #FF585D;
            border: none;
            background-color: #f8f8f8;
            text-transform: uppercase;

            :hover,
            :active,
            :focus {
                color: #fff;
                background-color: #FF585D;
            }

            :disabled {
                background-color: #e6e6e6;
                color: white;
            }
        }
        &.gray-blue {
            color: #0072ce;
            border-color: #f8f8f8;
            background: #f8f8f8;

            :disabled {
                border-color: #e6e6e6;
                background: #e6e6e6;
                opacity: 1 !important;
            }
            :active,
            :hover,
            :focus {
                color: #0072ce;
                border-color: #f8f8f8;
                background: #fff;
            }

            &.dark {
                border-color: #EFEFEF;
                background: #EFEFEF;
            }
        }
        &.link {
            width: auto;
            height: auto;
            letter-spacing: 0;
            padding: 0;
            margin: 0;

            border-radius: 0px;

            font-size: 14px;
            background: none;
            border: none;
            display: inline;

            text-decoration: underline;
            color: #0072ce;

            :hover,
            :focus {
                text-decoration: none;
                color: #0072ce;
                background-color: transparent;
            }

            &.gray {
                text-decoration: none;
                color: #999;

                :hover,
                :focus {
                    text-decoration: underline;
                    color: #999;
                }
            }

            &.red {
                color: #ff585d;
                text-decoration: none;

                :disabled {
                    opacity: 0.8;
                    background: transparent !important;
                }
            }

        }

        &.dots {
            color: #fff;
            border-color: #cccccc;
            background-color: #cccccc;
            cursor: default;

            :active,
            :hover,
            :focus,
            :disabled {
                background: #cccccc;
                border-color: #cccccc;
            }
            :after {
                content: '.';
                animation: dots 1s steps(5, end) infinite;
            
                @keyframes dots {
                    0%, 20% {
                        color: rgba(0,0,0,0);
                        text-shadow:
                            .3em 0 0 rgba(0,0,0,0),
                            .6em 0 0 rgba(0,0,0,0);
                    }
                    40% {
                        color: white;
                        text-shadow:
                            .3em 0 0 rgba(0,0,0,0),
                            .6em 0 0 rgba(0,0,0,0);
                    }
                    60% {
                        text-shadow:
                            .3em 0 0 white,
                            .6em 0 0 rgba(0,0,0,0);
                    }
                    80%, 100% {
                        text-shadow:
                            .3em 0 0 white,
                            .6em 0 0 white;
                    }
                }
            }
        }

        &.link.dots {
            color: #24272a;
            border: 0;
            background-color: transparent;
            text-transform: lowercase;
            text-decoration: none;

            :active,
            :hover,
            :focus,
            :disabled {
                background: transparent;
                border: 0;
            }
            :after {
                content: '.';
                animation: link 1s steps(5, end) infinite;
            
                @keyframes link {
                    0%, 20% {
                        color: rgba(0,0,0,0);
                        text-shadow:
                            .3em 0 0 rgba(0,0,0,0),
                            .6em 0 0 rgba(0,0,0,0);
                    }
                    40% {
                        color: #24272a;
                        text-shadow:
                            .3em 0 0 rgba(0,0,0,0),
                            .6em 0 0 rgba(0,0,0,0);
                    }
                    60% {
                        text-shadow:
                            .3em 0 0 #24272a,
                            .6em 0 0 rgba(0,0,0,0);
                    }
                    80%, 100% {
                        text-shadow:
                            .3em 0 0 #24272a,
                            .6em 0 0 #24272a;
                    }
                }
            }
        }
        &.bold {
            font-weight: 500;
        }
        @media screen and (max-width: 767px) {
            width: 100%;
        }
    }
`

const FormButton = ({ 
    children, 
    type, 
    color = 'blue', 
    disabled = false,
    onClick,
    sending = false,
    sendingString,
    size,
    linkTo,
    history,
    className,
    id
}) => (
    <CustomButton
        type={type}
        id={id}
        className={classNames([color, size, className, {'dots': sending}])}
        disabled={disabled}
        onClick={(e) => {
            onClick && onClick(e)
            linkTo && history.push(linkTo)
        }}
        tabIndex='3'
    >
        {sending
            ? <Translate id={sendingString ? sendingString : 'sending'} />
            : children
        }
    </CustomButton>
)

FormButton.propTypes = {
    children: PropTypes.node.isRequired,
    type: PropTypes.string,
    color: PropTypes.string,
    disabled: PropTypes.bool,
    onClick: PropTypes.func,
    sending: PropTypes.bool,
    size: PropTypes.string,
    linkTo: PropTypes.string,
    className: PropTypes.string
}

export default withRouter(FormButton)
