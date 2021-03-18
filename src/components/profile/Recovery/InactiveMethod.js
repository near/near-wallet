import React from 'react';
import styled from 'styled-components';
import { Translate } from 'react-localize-redux';
import { Link } from 'react-router-dom';
import { Mixpanel } from '../../../mixpanel/index';

const NotEnabledContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: #24272a;
    font-weight: 500;
`

const Button = styled(Link)`
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    background-color: #0072ce;
    border-radius: 40px;
    transition: 150ms;
    font-weight: 600;

    :hover {
        background-color: rgb(0, 127, 230);
        color: white;
        text-decoration: none;
    }
`

const InactiveMethod = ({ method, accountId }) => (
    <NotEnabledContainer>
        <Translate id={`recoveryMgmt.methodTitle.${method}`}/>
        <Button 
            to={{
                pathname: `${method !== 'phrase' ? `/set-recovery/${accountId}` : `/setup-seed-phrase/${accountId}/phrase`}`,
                method: method
            }}
            onClick={() => Mixpanel.track(method === 'phrase' ? 'SR-SP Click enable button': `SR Click enable button for ${method}`)}
        >
            <Translate id='button.enable'/>
        </Button>
    </NotEnabledContainer>
);

export default InactiveMethod;