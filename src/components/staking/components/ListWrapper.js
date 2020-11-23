import React from 'react'
import styled from 'styled-components'

const Container = styled.div`

    > div {
        border: 0;
        border-bottom: 2px solid #F2F2F2;
        border-radius: 0;
        padding: 15px 0;

        &:last-of-type {
            border-bottom: 0;
        }

        @media (max-width: 767px) {
            margin: 0 -14px;
            padding: 15px 14px;
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