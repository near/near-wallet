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

        if (isOutside) {
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

ClickOutside.defaultProps = {
    clickInside: true
}

ClickOutside.propTypes = {
    onClickOutside: PropTypes.func.isRequired,
    children: PropTypes.oneOfType([
        PropTypes.element,
        PropTypes.array
    ])
};
