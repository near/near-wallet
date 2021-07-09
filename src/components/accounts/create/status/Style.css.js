import styled from 'styled-components';

const Style = styled.div`
    border-radius: 8px;
    color: #D5D4D8;
    font-size: 14px;
    background-color: #111618;

    > div {
        padding: 15px;

        &.status, &.amount {
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
    }

    .address {
        > div {
            :first-of-type {
                display: flex;
                align-items: center;
                justify-content: space-between;
            }
            
            :last-of-type {
                color: white;
                background-color: #3F4045;
                border-radius: 8px;
                line-break: anywhere;
                padding: 15px;
                font-size: 14px;
                margin-top: 10px;
            }
        }
    }

    .status {
        border-top: 1px solid #d5d4d84f;
        border-bottom: 1px solid #d5d4d84f;
        span {
            border-radius: 40px;
            font-size: 11px;
            padding: 6px 14px;
            background-color: #FFDBB2;
            color: #995200;
        }
    }

    .amount {
        span {
            color: white;
            font-weight: 700;
            font-size: 14px;
        }
    }

    &.funded {
        .status {
            span {
                background-color: #90E9C5;
                color: #005A46;
            }
        }
    }

    .copy-funding-address {
        display: flex;
        align-items: center;
        font-size: 12px;
        color: #8FCDFF;

        svg {
            margin-right: 4px;
            width: 16px;

            path {
                stroke: #8FCDFF;
            }
        }
    }
`;

export default Style;