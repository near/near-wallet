import styled from 'styled-components';

const Container = styled.div`
    width: auto;
    margin: 30px auto 0 auto;
    max-width: 100%;
    padding: 0 14px;

    @media (min-width: 768px) {
        width: 720px;
    }

    @media (min-width: 992px) {
        width: 920px;
        padding: 10px 0 10px 0;
    }

    @media (min-width: 1200px) {
        width: 1000px;
    }

    &.small-centered, &.xs-centered {
        max-width: 500px;

        @media (min-width: 768px) {
            &.border {
                border: 1px solid #F0F0F1;
                border-radius: 16px;
                padding: 40px;
                margin-top: 40px;
            }
        }

        &.center {
            display flex;
            flex-direction: column;
            align-items: center;
            text-align: center;

            h2 {
                margin: 10px 0;
            }

            h1, h2 {
                text-align: center !important;
            }
        }
    }

    &.xs-centered {
        max-width: 350px !important;
    }

    &.medium {
        max-width: 600px;
    }

    @media (min-width: 992px) {
        .split {
            display: flex;

            .left {
                flex: 1.5;
                margin-right: 40px;
            }
    
            .right {
                flex: 1;
                max-width: 365px;
            }
        }
    }


    .sub-title, h2 {
        line-height: 150%;
        margin: 25px 0;
        font-size: 16px;
        color: #72727A;
        font-weight: 400;
    }

    &.ledger-theme {
        display: flex;
        flex-direction: column;
        align-items: center;

        > svg {
            margin: 20px 0;
        }

        button {

            &.link {
                margin-top: 25px;
            }

            &.link {
                &.red {
                    margin-top: 25px !important;
                }
            }

            &.blue {
                width: 100% !important;
            }

            &.remove-all-keys {
                min-height: 56px;
                height: auto;
                line-height: 140%;
            }
        }
    }
`;

export default Container;
