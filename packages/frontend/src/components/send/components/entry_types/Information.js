import React from 'react';
import { Translate } from 'react-localize-redux';

import StyledContainer from './css/Style.css';
import classNames from '../../../../utils/classNames';

const Information = ({ className, translateIdTitle, informationValue, onClick }) => {
    /* TODO: Handle long informationValue */
    return (
        <StyledContainer
            className={classNames(['information' , className, { 'clickable' : onClick }])}
            onClick={onClick}
        >
            <Translate id={translateIdTitle} />
            <div>{informationValue}</div>
        </StyledContainer>
    );
};

export default Information;
