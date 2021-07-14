import React from 'react';

import isDataURL from '../../../utils/isDataURL';
import DefaultTokenIconBlack from '../../svg/DefaultTokenIconBlack';

const TokenIcon = ({ symbol = 'Token', icon }) => {
    if (icon && isDataURL(icon)) {
        return <img src={icon} alt={symbol}/>;
    } else {
        return <DefaultTokenIconBlack/>;
    }
};

export default TokenIcon;