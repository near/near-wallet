import React from 'react'
import styled from 'styled-components'

const Container = styled.div`

    > div {
        border: 0;
        border-bottom: 2px solid #F8F8F8;
        border-radius: 0;
        padding: 20px 0 18px 0;

        &:last-of-type {
            border-bottom: 0;
        }
    }

    .chevron-icon {
        display: block;
    }
`

export default function ListWrapper(props) {
    return (
        <Container>
            {props.children}
        </Container>
    )
}