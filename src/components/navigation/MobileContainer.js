import React, { Component } from 'react';
import styled from 'styled-components';

const Container = styled.div`
    display: none;

    @media (max-width: 768px) {
        display: block;
    }
`

class MobileContainer extends Component {
    render() {
        return (
            <Container>
                Hello mobile
            </Container>
        )
    }
}

export default MobileContainer;