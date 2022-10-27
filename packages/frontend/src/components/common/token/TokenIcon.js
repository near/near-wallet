import React from 'react';

import CONFIG from '../../../config';
import isDataURL from '../../../utils/isDataURL';
import DefaultTokenIcon from '../../svg/DefaultTokenIcon';
import DefaultTokenIconBlack from '../../svg/DefaultTokenIconBlack';

const TokenIcon = ({ symbol = 'Token', icon }) => {
    if (icon && isDataURL(icon)) {
        return <img src={icon} alt={symbol}/>;
    }

    if (symbol === CONFIG.NEAR_ID) {
        return <DefaultTokenIconBlack/>;
    }

    return <DefaultTokenIcon/>;
};

export default TokenIcon;
