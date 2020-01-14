import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

// Add additional theme icons
import errorIcon from '../../images/icon-problems.svg'

const Container = styled.div`
    width: 100%;
    border-radius: 4px;
    padding: 15px;
    margin: 15px 0;
    font-size: 15px;
    font-family: 'benton-sans',sans-serif;
    border: 1px solid #888888;
    color: #888888;
    background-color: #f5f5f5;
    line-height: normal;
    display: flex;
    align-items: center;

    &.error-theme {
        border-color: #FF585D;
        color: #FF585D;
        background-color: rgba(255, 88, 93, 0.2);

        .theme-icon {
            background: url(${errorIcon}) center no-repeat;
        }
    }
`

const Icon = styled.div`
    min-height: 25px;
    min-width: 25px;
    height: 25px;
    width: 25px;
    margin-right: 15px;
`

const Button = styled.div`
    margin-left: auto;
    white-space: nowrap;
    font-weight: 600;
    cursor: pointer;
`

class InlineNotification extends Component {

    render() {

        const {
            message,
            buttonMsg,
            theme,
            onClick,
            show
        } = this.props;

        if (show)
            return <Container className={`${theme}-theme`} onClick={onClick}>
                        <Icon className='theme-icon'/>
                        {message}
                        {onClick && buttonMsg &&
                            <Button role='button'>{buttonMsg}</Button>
                        }
                    </Container>;
        else
            return null;
    }
}

InlineNotification.propTypes = {
    message: PropTypes.string.isRequired,
    theme: PropTypes.string.isRequired,
    show: PropTypes.bool.isRequired,
    onClick: PropTypes.func,
    buttonMsg: PropTypes.string,
}

export default InlineNotification;