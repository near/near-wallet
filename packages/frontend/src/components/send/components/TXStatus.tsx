import React from 'react';
import { Translate } from 'react-localize-redux';
import styled from 'styled-components';

const StyledContainer = styled.div`
    display: flex;
    align-items: center;
`;
const Indicator = styled.span`
    display: inline-block;
    width: 9px;
    height: 9px;   
    background-color: ${(props: {color: string}) => props.color};
    border-radius: 50%;
    margin-right: 10px;
`;

const getStatusColor = (status: string) => {
    switch (status) {
        case 'SuccessValue':
            return '#4DD5A6';
        case 'Failure':
            return '#ff585d';
        case 'notAvailable':
            return '#ff585d';
        default:
            return;
    }
};

type TXStatusProps = {
    status: string;
};

const TXStatus = ({ status }: TXStatusProps) => {
    return (
        <StyledContainer className='status'>
            <Indicator color={getStatusColor(status)} />
            <Translate id={`sendV2.TXEntry.status.${status}`} />
        </StyledContainer>
    );
};

export default TXStatus;
