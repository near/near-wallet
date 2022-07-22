import React, { useCallback } from 'react';
import { Translate } from 'react-localize-redux';
import styled from 'styled-components';

import iconWarning from '../../../images/icon-warning.svg';

const HapiContainer = styled.div`
    margin-top: 20px;
    margin-bottom: -25px;
`;

const HapiWarning = styled.div`
    background: #FFEFEF;
    border-radius: 4px;
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    padding: 16px 12px;
    gap: 10px;
    color: #CD2B31;
    font-size: 12px;
    line-height: 16px;
`;

const HapiConsent = styled.div`
    margin-top: 38px;
    line-height: 20px;
    color: #000000;
    display: flex;
    padding-left: 26px;

    & label {
      user-select: none;
      display: flex;
      gap: 0 12px;
      
      & input {
        width: inherit;
        height: inherit;
        border: none;
        appearance: auto;
        position: inherit;
        margin: 0;
        background: none;
        box-shadow: none;
      }
    }
`;

const HapiForm = ({ setAccountIdIsValid, setIsHAPIConsentEnabled }) => {

    const onCheckboxChange = useCallback((e) => {
        const isChecked = e.target.checked;
        setAccountIdIsValid(isChecked);
        setIsHAPIConsentEnabled(isChecked);
    }, []);

    return (
        <HapiContainer>
            <HapiWarning>
                <img src={iconWarning} alt="Warning"/>
                <div>
                    <Translate id='hapi.scamWarning' />
                </div>
            </HapiWarning>
            <HapiConsent>
                <label>
                    <input type="checkbox" onChange={onCheckboxChange}/>
                    <Translate id='hapi.checkbox' />
                </label>
            </HapiConsent>
        </HapiContainer>
    );
};

export default HapiForm;
