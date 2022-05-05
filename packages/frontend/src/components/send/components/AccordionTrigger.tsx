import React from 'react';
import { Translate } from 'react-localize-redux';
import styled from 'styled-components';

import classNames from '../../../utils/classNames';
import ChevronIcon from '../../svg/ChevronIcon';

const StyledContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #F0F0F1;
    padding: 10px;
    border-bottom-left-radius: 8px;
    border-bottom-right-radius: 8px;
    cursor: pointer;
    font-size: 13px;

    > svg {
        width: 10px;
        height: 10px;
        transform: rotate(90deg);
        margin-left: 8px;
    }

    &.open {
        background-color: #FAFAFA;

        > svg {
            transform: rotate(-90deg);
        }
    }
`;

type AccordionTriggerProps = {
    id: string;
    onClick: () => void;
    translateIdTitle: string;
    open: boolean;
};

const AccordionTrigger = ({ id, onClick, translateIdTitle, open }:AccordionTriggerProps) => {
    return (
        <StyledContainer
            id={id}
            onClick={onClick}
            className={classNames(['accordion-trigger' , open ? 'open' : ''])}
        >
            <Translate id={translateIdTitle} />
            <ChevronIcon color='#0072ce'/>
        </StyledContainer>
    );
};

export default AccordionTrigger;
