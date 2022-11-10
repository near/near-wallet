import styled, { css } from 'styled-components';

export const Wrapper = styled.div`
    height: 4px;
`;

export const Content = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

export const LevelWrapper = styled.div`
    display: flex;
    max-width: 70%;
`;

export const Level = styled.div<{ level: number }>`
    ${(props) => props.level === 1 && css`
        background-color: #dc3d43;
    `}
    ${(props) => props.level === 2 && css`
        background-color: #ffa01c;
    `}
    ${(props) => props.level === 3 && css`
        background-color: #299764;
    `}

    border-radius: 4px;
    width: 90px;
    height: 4px;
    margin-right: 4px;
`;

export const Description = styled.div`
    font-weight: 500;
    font-size: 12px;
    line-height: 16px;
    color: #7E868C;
`;

