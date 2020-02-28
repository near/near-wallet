import React from 'react';
import { Translate } from 'react-localize-redux'

import styled from 'styled-components';

const Container = styled.div`
    position: relative;
    width: 100%;
    line-height: normal;
    margin: 10px 0;

    &:after {
        content: '';
        display: block;
        width: 100%;
        border-top: 1px solid #e6e6e6;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, 0);
        z-index: -1;
    }
`

const Wrapper = styled.div`
    background-color: white;
    padding: 0 10px;
    display: inline-block;
    color: #25282A;
    font-size: 16px;
`

const Divider = (props) => (
    <Container className='divider-container'>
        <Wrapper className='divider-wrapper'>
            {props.title || <Translate id='or' />}
        </Wrapper>
    </Container>
)

export default Divider;