import styled from 'styled-components';

import Container from '../common/styled/Container.css';

export const StyledContainer = styled(Container)`
    @media (max-width: 991px) {
        .right {
            margin-top: 50px;
        }
    }

    h2 {
        font-weight: 900 !important;
        font-size: 22px !important;
        margin: 10px 0;
        text-align: left !important;
        line-height: 140% !important;
        display: flex;
        align-items: center;
        color: #24272a !important;

        svg {
            margin-right: 15px;

            &.user-icon {
                margin-right: 10px;
            }

            .background {
                display: none;
            }
        }
    }

    .left, .right {
        .animation-wrapper {
            border-radius: 8px;
            overflow: hidden;
        }
    }

    .left {
        @media (min-width: 992px) {
            > hr {
                margin: 50px 0px 30px 0px;
            }
        }
        
        .animation-wrapper {
            margin-top: 50px;
            :last-of-type {
                margin-top: 30px;
            }
        }

        .tooltip {
            margin-bottom: -1px;
        }
    }

    .right {
        > h4 {
            margin: 50px 0 20px 0;
            display: flex;
            align-items: center;
        }

        .animation-wrapper {
            margin-top: 10px;
        }

        > button {
            &.gray-blue {
                width: 100%;
                margin-top: 30px;
            }
        }
    }

    hr {
        border: 1px solid #F0F0F0;
        margin: 50px 0 40px 0;
    }

    .sub-heading {
        margin: 20px 0;
        color: #72727A;
    }

    .auth-apps {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 35px;

        button {
            &.link {
                text-decoration: none !important;
                white-space: nowrap;
            }
        }
    }

    .authorized-app-box {
        margin-top: 20px !important;
    }
`;

export const RecoveryOption = styled.div`
    margin-top: 10px;
`;
