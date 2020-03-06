import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class ClickOutside extends Component {

    componentDidMount() {
        document.addEventListener('click', this.handleClickOutside);
    }

    componentWillUnmount() {
        document.removeEventListener('click', this.handleClickOutside);
    }

    setWrapperRef = (node) => {
        this.wrapperRef = node;
    }

    handleClickOutside = (e) => {
            const isOutside = this.wrapperRef && !this.wrapperRef.contains(e.target);
            const clickIsFunction = typeof this.props.onClickOutside === 'function';
            const isClickable = (e.target.tagName === 'BUTTON' || e.target.tagName === 'A');

        if ((isOutside || isClickable) && clickIsFunction) {
            this.props.onClickOutside();
        }
    }

    render() {
        return (
            <div ref={this.setWrapperRef} className='click-outside'>
                {this.props.children}
            </div>
        );
    }
}

ClickOutside.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.element,
        PropTypes.array
    ])
};
