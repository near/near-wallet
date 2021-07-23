import styled from 'styled-components';

const Style = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px 15px;
    color: #72727A;

    &.information {
        color: #272729;
        font-weight: 600;

        > div {
            font-weight: 400;
        }
    }

    .tooltip {
        margin-right: auto;
        width: 15px;
        margin-top: 2px;
    }

    .icon, .amount {
        color: #272729;
        font-weight: 600;
        font-size: 16px;
        text-align: right;
    }

    .icon {
        display: flex;
        align-items: center;

        img, svg {
            height: 32px;
            width: 32px;
            margin-right: 10px;
        }
    }

    .receiver {
        font-weight: 600;
        background-color: #F0F0F1;
        padding: 10px 18px;
        border-radius: 40px;
    }

    .time, .status {
        color: #3F4045;
    }

    &.stand-alone {
        border-radius: 8px;
        background-color: #FAFAFA;
    }
`;

export default Style;