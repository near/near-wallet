import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import closeIcon from '../../images/icon-close-white.svg';

// Add additional theme icons
import successIcon from '../../images/icon-check-white.svg';

const Container = styled.div`
    position: fixed;
    left: 50%;
    transform: translateX(-50%);
    width: 90%;
    z-index: 1;
    visibility: hidden;
    opacity: 0;
    transition: 250ms ease;
    bottom: 0px;
    pointer-events: none;
    padding: 0 !important;

    @media (min-width: 768px) {
        width: 330px;
        right: 30px;
        left: auto;
        transform: none;
    }

    &.show {
        visibility: visible;
        bottom: 30px;
        opacity: 1;
        pointer-events: all;
    }
`

const Wrapper = styled.div`
    background-color: #f5f5f5;
    color: white;
    border-radius: 4px;
    padding: 14px 15px;
    font-size: 16px;
    display: flex;
    align-items: center;
    box-shadow: 0px 6px 8px 0px rgba(0,0,0,0.14);

    &.success-theme {
        background-color: #8FD6BD;

        .theme-icon {
            background: url(${successIcon}) center no-repeat;
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

const HideButton = styled.div`
    margin-left: auto;
    cursor: pointer;
    min-height: 25px;
    min-width: 25px;
    height: 25px;
    width: 25px;
    background: url(${closeIcon}) center no-repeat;
    background-size: 17px;
`

class Snackbar extends Component {
    constructor(props) {
        super(props);

        this.state = {
            animate: false
        };
    }

    componentDidUpdate(prevProps) {
        if (prevProps.show !== this.props.show && this.props.show) {
            setTimeout(() => {
                this.setState({ animate: true }, () => {
                    setTimeout(() => {
                        this.setState({ animate: false });
                    }, 5000)
                });
            }, 0)
        }
    }

    render() {

        const {
            theme,
            message,
            show,
            onHide
        } = this.props;

        if (show) {
            return (
                <Container className={this.state.animate ? 'show' : ''}>
                    <Wrapper className={`${theme}-theme`}>
                        <Icon className='theme-icon'/>
                        {message}
                        {onHide &&
                            <HideButton onClick={onHide}/>
                        }
                    </Wrapper>
                </Container>
            );
        } else {
            return null;
        }
    }
}

const snackbarDuration = 5500;

Snackbar.propTypes = {
    theme: PropTypes.string.isRequired,
    message: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.object
    ]).isRequired,
    show: PropTypes.bool.isRequired,
    onHide: PropTypes.func,
}

export { Snackbar, snackbarDuration };