import styled, {css} from 'styled-components';

export const Wrapper = styled.div`
    position: relative;
`;

export const InputContent = styled.div`
`;

export const InputElement = styled.input<{error: boolean}>`
    margin-top: 0 !important;
    padding-right: 50px;
    
    ${props => props.error && css`
        box-shadow: 0px 0px 0px 2px rgba(242, 0, 0, 0.2);
        border: 1px solid #DC3D43;
        background: #ffffff;
        
        &:focus {
            box-shadow: 0px 0px 0px 2px rgba(242, 0, 0, 0.2);
            border: 1px solid #DC3D43;
        }
    `}
`;

export const IconClickArea = styled.div`
    position: absolute;
    right: 0px;
    top: 0px;
    width: 50px;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
`;

export const ErrorTextWrapper = styled.div<{ show?: boolean }>`
    position: absolute;
    left: 0px;
    padding-top: 6px;
    display: ${props => props.show ? 'block' : 'none'};
    font-weight: 500;
    font-size: 12px;
    line-height: 16px;
    color: #DC3D43;
`;
