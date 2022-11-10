import styled from 'styled-components';

export const Container = styled.div`
    border: 2px solid #f0f0f1;
    border-radius: 8px;

    width: 100%;
    padding: 16px;
`;

export const Main = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    
    > button {
        margin: 0 !important;
    }
`;

export const TitleWrapper = styled.div`
    display: flex;
`;

export const Title = styled.div`
    font-weight: 700;
    font-size: 14px;
    line-height: 150%;
    color: #3F4045;
`;

export const Description = styled.div`
    margin-top: 26px;
    font-weight: 500;
    font-size: 14px;
    line-height: 20px;
    color: #a2a2a8;
`;
