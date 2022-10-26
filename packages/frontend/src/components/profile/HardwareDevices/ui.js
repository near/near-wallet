import styled from 'styled-components';

import Card from '../../common/styled/Card.css';

export const Container = styled(Card)`
    i {
        margin-top: 16px;
        display: block;
        color: #A1A1A9;
        font-style: normal;
    }

    .color-red {
        margin-top: 20px;
    }
`;

export const Device = styled.div`
    button {
        width: 100px !important;
        height: 36px !important;
        margin: 0 !important;
        padding: 0;
    }
`;

export const MainTitle = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 26px;
`;

export const Name = styled.div`
    font-weight: 700;
    color: #24272a;
`;

export const Authorized = styled.div`
    color: #5ace84;
    font-weight: 500;
`;
