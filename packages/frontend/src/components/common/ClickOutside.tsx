import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { ReactNode } from 'react';

type ClickOutsideProps = {
    onClickOutside: ()=>void;
    children: ReactNode | ReactNode[];
    clickInside?: boolean; 
}

export default class ClickOutside extends Component<ClickOutsideProps> {
    public static defaultProps = {
        clickInside: true,
    }
    wrapperRef: ReactNode;

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
            //@ts-ignore
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
