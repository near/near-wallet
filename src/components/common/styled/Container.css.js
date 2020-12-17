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

    .sub-title, h2 {
        text-align: center !important;
        line-height: 150% !important;
        margin: 25px 0;
        font-size: 16px !important;
        color: #999 !important;
        font-weight: 400 !important;
    }

    &.ledger-theme {
        display: flex;
        flex-direction: column;
        align-items: center;

        svg {
            margin: 20px 0;
        }

        button {

            &.link {
                margin-top: 25px;
            }

            &.blue {
                width: 100% !important;
            }

            &.remove-all-keys {
                min-height: 48px;
                height: auto;
                line-height: 140%;
            }
        }
    }
`

export default Container;