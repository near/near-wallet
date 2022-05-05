import React from 'react';

import isDataURL from '../../../utils/isDataURL';
import DefaultTokenIcon from '../../svg/DefaultTokenIcon';
import DefaultTokenIconBlack from '../../svg/DefaultTokenIconBlack';

type TokenIconProps = {
    symbol: string;
    icon: string;
};

const TokenIcon = ({ symbol = 'Token', icon }: TokenIconProps) => {
    if (icon && isDataURL(icon)) {
        return <img src={icon} alt={symbol}/>;
    } else if (symbol === 'NEAR') {
        return <DefaultTokenIconBlack/>;
    } else {
        return <DefaultTokenIcon/>;
    }
};

export default TokenIcon;
