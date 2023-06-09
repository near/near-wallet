import React from 'react';
import styled, { css } from 'styled-components';

const CheckboxContainer = styled.div`
    display: inline-block;
    vertical-align: middle;
    cursor: pointer;
    ${(props) => (props.disabled && css`
        cursor: not-allowed;
    `)};
`;

const Icon = styled.svg`
    fill: none;
    stroke: white;
    stroke-width: 3px;
`;

const HiddenCheckbox = styled.input.attrs({ type: 'checkbox' })`
    border: 0 !important;
    clip: rect(0 0 0 0) !important;
    clippath: inset(50%) !important;
    height: 1px !important;
    margin: -1px !important;
    overflow: hidden !important;
    padding: 0 !important;
    position: absolute !important;
    white-space: nowrap !important;
    width: 1px !important;
`;

const StyledCheckbox = styled.div`
    display: inline-block !important;
    width: 20px !important;
    height: 20px !important;
    background: ${(props) => (props.checked ? '#0072CE' : 'white')};
    border: 2px solid ${(props) => (props.checked ? '#0072CE' : '#E6E5E3')};
    border-radius: 4px !important;
    transition: all 150ms !important;

    ${HiddenCheckbox}:focus + & {
        box-shadow: 0 0 0 2px #C8E3FC;
    }

    ${Icon} {
        visibility: ${(props) => (props.checked ? 'visible' : 'hidden')};
    }

    ${(props) => (props.red && css`
        background: ${(props) => (props.checked ? '#FCECEC' : 'white')};
        border: 2px solid ${(props) => (props.checked ? '#FFBDBE' : '#E6E5E3')};
        ${Icon} {
            stroke: #FC5B5B;
        }
    `)};

    ${(props) => (props.disabled && css`
        background: rgba(0,0,0,0.2);
        border: 2px solid #111618;
    `)};
`;

const Checkbox = ({ className, checked, red, ...props }) => (
    <CheckboxContainer className={className} disabled={props.disabled}>
        <HiddenCheckbox checked={checked} {...props} />
        <StyledCheckbox checked={checked} red={red} disabled={props.disabled}>
            <Icon viewBox="0 0 24 24">
                <polyline points="20 6 9 17 4 12" />
            </Icon>
        </StyledCheckbox>
    </CheckboxContainer>
);

export default Checkbox;
