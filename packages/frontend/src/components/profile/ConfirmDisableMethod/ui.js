import styled from 'styled-components';

export const Title = styled.h3`
     margin: 15px 0;
     font-size: 18px;
     font-weight: 700;
`;

export const Description = styled.p`
    line-height: 1.5;
    font-size: 14px;
`;

export const Container = styled.div`
    padding: 15px 0 10px 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;

    > button {
        width: 100%;
    }
`;
