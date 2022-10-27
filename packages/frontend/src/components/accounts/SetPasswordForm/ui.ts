import styled from 'styled-components';

export const PasswordForm = styled.div`
  margin-bottom: 72px;
`;

export const WithoutPassword = styled.div<{ hide: boolean }>`
    opacity: ${(props) => props.hide ? '0' : '1'};
    margin-top: 48px;
    font-weight: 500;
    font-size: 16px;
    line-height: 150%;
    text-align: center;
    color: #0072CE;
    flex: none;
    order: 3;
    align-self: stretch;
    flex-grow: 0;
    cursor: pointer;
`;

export const Submit = styled.div`
    > button {
        margin: 0;
        width: 100%;
    }
`;
