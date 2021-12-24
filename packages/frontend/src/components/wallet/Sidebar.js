import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

import CreateCustomName from './CreateCustomName';
import ExploreApps from './ExploreApps';

const StyledContainer = styled.div`
    background-color: black;
    border-radius: 8px;
    padding-bottom: 30px;
    margin-bottom: 40px;
    .dots {
        margin-top: -30px;
        display: flex;
        align-items: center;
        justify-content: center;
        .dot {
            width: 8px;
            height: 8px;
            background-color: #D5D4D8;
            border-radius: 50%;
            margin: 0 5px;
            cursor: pointer;
            
            &.active {
                cursor: default;
                background-color: #8FCDFF;
            }
        }
    }
`;

export default ({ availableAccounts }) => {
    const [index, setIndex] = useState(0);
    useEffect(() => {
        if (availableAccounts.length > 0) {
            setIndex(availableAccounts.filter(a => a.length < 64).length > 0 ? 0 : 1);
        }
    }, [availableAccounts]);
    const components = [
        <ExploreApps />,
        <CreateCustomName />
    ];
    return (
        <StyledContainer>
            {components.map((component, i) => {
                if (i === index) {
                    return (
                        <div key={i}>{components[i]}</div>
                    );
                }
            })}
            <div className='dots'>
                {components.map((component, i) => <div key={i} className={`dot ${index === i ? 'active' : ''}`} onClick={() => setIndex(i)}></div>)}
            </div>
        </StyledContainer>
    );
};