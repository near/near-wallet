import React, { useState } from 'react';
import { Translate } from 'react-localize-redux';
import styled from 'styled-components';

import Tooltip from '../../common/Tooltip';

const StyledContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px 15px;
    color: #72727A;

    .tooltip {
        margin-right: auto;
        width: 15px;
        margin-top: 2px;
    }

    .buttonsContainer {
        display: flex;
        flex-direction: row;
    }

    button {
        margin: 0px 4px;
        border-radius: 16px;
        background-color: white;
        border-color: white;
        border-style: solid;
        padding: 4px 10px;
        :hover {
            border-color: #006ADC;
            background-color: #006ADC;
            color: white;
        }
    }

    .active {
        border-color: #006ADC;
        background-color: #006ADC;
        color: white;
    }
`;

const slippageValues = [0.5, 1, 3];

const SlippagePicker = ({
    translateIdTitle,
    translateIdInfoTooltip,
    setSlippage
}) => {
    const [active, setActive] = useState(1);
    
    const handleClick = (value) => {
        setActive(value);
        setSlippage(value);
    };

    return (
        <StyledContainer>
            <Translate id={translateIdTitle} />
            {translateIdInfoTooltip &&
                <Tooltip translate={translateIdInfoTooltip} />
            }
            <div className={'buttonsContainer'} >
                {slippageValues.map((value) => 
                    <button 
                        className={active == value ? 'active' : ''} 
                        onClick={() => handleClick(value)}
                    >
                        {value}%
                    </button>)}
            </div>
        </StyledContainer>
    );
};

export default SlippagePicker;
