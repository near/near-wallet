import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

import { isWhitelabel } from '../../config/whitelabel';
import CreateCustomName from './CreateCustomName';
import ExploreApps from './ExploreApps';
import ExploreNativeBanner from './ExploreNativeBanner';

const StyledContainer = styled.div`
    background-color: ${(p) => p.bgColour};
    border-radius: 8px;
    padding-bottom: 30px;
    margin-bottom: 40px;
    .dots {
        margin-top: -30px;
        height: 8px;
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
        if (availableAccounts?.length > 0) {
            const numNonImplicitAccounts = availableAccounts.filter((a) => a.length < 64).length;
            setActiveComponent(numNonImplicitAccounts === 0 ? 'CreateCustomName' : 'ExploreApps');
        }
    }, [availableAccounts]);

    const explorerComponent = isWhitelabel ? <ExploreNativeBanner /> : <ExploreApps />;
    const bgColour = (isWhitelabel && activeComponent === 'ExploreApps') ? 'transparent' : 'black';

    return (
        <StyledContainer bgColour={bgColour}>
            {activeComponent === 'ExploreApps' ? explorerComponent : <CreateCustomName />}
            <div className='dots'>
                {availableAccounts && (
                <>
                    <div className={`dot ${activeComponent === 'CreateCustomName' ? 'active' : ''}`} onClick={() => setActiveComponent('CreateCustomName')}></div>
                    <div className={`dot ${activeComponent === 'ExploreApps' ? 'active' : ''}`} onClick={() => setActiveComponent('ExploreApps')}></div>
                </>
                )}
            </div>
        </StyledContainer>
    );
};
