import styled from 'styled-components';

const PageTheme = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 30px 14px 0 14px;
    max-width: 800px;
    font-family: BwSeidoRound !important;

    @media (min-width: 768px) {
        margin: 30px auto 0 auto;
    }

    h1 {
        text-align: center;

        @media (max-width: 767px) {
            max-width: 70%
        }
    }

    svg {
        margin-top: 10px;
    }

    p {
        max-width: 500px;

        :first-of-type {
            margin-top: 25px;
        }
    }

    button {
        margin-top: 25px;

        :first-of-type {
            width: 300px;

            @media (max-width: 500px) {
                width: 100%;
            }
        }

        &.link {
            border: 0;
        }
    }
`;

export default PageTheme;