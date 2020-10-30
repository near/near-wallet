import styled from 'styled-components';

const Container = styled.div`
    width: auto;
    margin: 20px auto 0 auto;
    max-width: 100%;
    padding: 0 14px;

    @media (min-width: 768px) {
        width: 723px;
    }

    @media (min-width: 992px) {
        width: 933px;
    }

    @media (min-width: 1200px) {
        width: 1127px;
    }

    &.small-centered {
        max-width: 490px;

        h1,
        h2 {
            text-align: center;
        }
    }
`

export default Container;