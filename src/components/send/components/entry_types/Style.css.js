import styled from 'styled-components';

const Style = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0px 15px;
    min-height: 75px;
    color: #72727A;

    .icon, .amount {
        color: black;
        font-weight: 600;
        font-size: 16px;
    }

    .icon {
        display: flex;
        align-items: center;

        svg {
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
`;

export default Style;