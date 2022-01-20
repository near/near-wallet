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
    const [activeComponent, setActiveComponent] = useState('ExploreApps');

    useEffect(() => {
        if (availableAccounts.length > 0) {
            const numNonImplicitAccounts = availableAccounts.filter(a => a.length < 64).length;
            setActiveComponent(numNonImplicitAccounts === 0 ? 'CreateCustomName' : 'ExploreApps');
        }
    }, [availableAccounts]);

    return (
        <StyledContainer>
            {activeComponent === 'ExploreApps' ? <ExploreApps /> : <CreateCustomName />}
            <div className='dots'>
                <div className={`dot ${activeComponent === 'CreateCustomName' ? 'active' : ''}`} onClick={() => setActiveComponent('CreateCustomName')}></div>
                <div className={`dot ${activeComponent === 'ExploreApps' ? 'active' : ''}`} onClick={() => setActiveComponent('ExploreApps')}></div>
            </div>
        </StyledContainer>
    );
};