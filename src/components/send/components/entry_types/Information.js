import React from 'react';
import { Translate } from 'react-localize-redux';

import classNames from '../../../../utils/classNames';
import StyledContainer from './css/Style.css';

const Information = ({ className, translateIdTitle, informationValue }) => {
    /* TODO: Handle long informationValue */
    return (
        <StyledContainer className={classNames(['information' , className])}>
            <Translate id={translateIdTitle} />
            <div>{informationValue}</div>
        </StyledContainer>
    );
};

export default Information;